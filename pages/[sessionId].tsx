import axios from "axios";
import { PusherContext } from "context";
import { GetServerSideProps, NextPage } from "next";
import Pusher, { Channel, Members } from "pusher-js";
import { useCallback, useContext, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { ChannelMember, Votes } from "types";
import { fibonacci } from "utils/fibonacci";

const fetcher = async (uri: string) => await (await axios.get(uri)).data;

interface Props {
  sessionId: string;
  userId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.req.cookies.user)
    return {
      redirect: {
        destination: `/register?source=/${context.params!.sessionId}`,
        permanent: false,
      },
    };
  const { user_id } = JSON.parse(context.req.cookies.user);
  return {
    props: { userId: user_id, sessionId: context.params!.sessionId },
  };
};

const Session: NextPage<Props> = ({ sessionId, userId }) => {
  const { pusher, socketId } = useContext(PusherContext);
  const [channel, setChannel] = useState<Channel>();
  const [members, setMembers] = useState<ChannelMember[]>([]);
  const voteKey = `/api/vote?sessionId=${sessionId}`;
  const { data: votes } = useSWR<Votes>(voteKey, fetcher);

  const setVote = useCallback(
    (userId: string, vote: string) => {
      mutate(
        voteKey,
        async (votes: Votes) => ({
          ...votes,
          [userId]: vote,
        }),
        { revalidate: false }
      );
    },
    [voteKey]
  );
  Pusher.logToConsole = true;

  useEffect(() => {
    if (!pusher) return;
    setChannel(pusher.subscribe(`presence-${sessionId}`));
  }, [sessionId, pusher]);

  useEffect(() => {
    if (!channel) return;
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: ChannelMember[] = [];
      members.each((member: ChannelMember) => {
        initialMembers.push(member);
      });
      setMembers(initialMembers);
    });
    channel.bind("pusher:member_added", (member: ChannelMember) =>
      setMembers((prev) => [...prev, member])
    );
    channel.bind("pusher:member_removed", (member: ChannelMember) =>
      setMembers((prev) => prev.filter((m) => m.id !== member.id))
    );
    channel.bind(
      "member_voted",
      ({ vote, userId }: { vote: string; userId: string }) => {
        setVote(userId, vote);
      }
    );
  }, [channel, sessionId, setVote]);

  return (
    <>
      Hi!
      <ul>
        {votes &&
          members.map((m) => (
            <li key={m.id}>
              {m.info.name} [{m.id}] ({votes[m.id]})
            </li>
          ))}
      </ul>
      {[...fibonacci(10), "?"].map((amount) => (
        <button
          key={amount}
          className="bg-slate-400 p-4 m-4"
          onClick={() => {
            setVote(userId, amount);
            axios.post("/api/vote", {
              sessionId,
              vote: amount,
              socketId,
              user_id: userId,
            });
          }}
        >
          {amount}
        </button>
      ))}
    </>
  );
};

export default Session;
