import axios from "axios";
import { PokerCard } from "components";
import { PusherContext } from "context";
import { GetServerSideProps, NextPage } from "next";
import Pusher, { Channel, Members } from "pusher-js";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { ChannelMember, Session } from "types";
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
  const { data: session, mutate } = useSWR<Session>(
    () => "/api/session?sessionId=" + sessionId,
    fetcher
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
        mutate(
          async (session) => {
            if (!session) return;
            return {
              ...session,
              votes: {
                ...session?.votes,
                [userId]: vote,
              },
            };
          },
          { revalidate: false }
        );
      }
    );
    channel.bind("revealed", () =>
      mutate(
        async (session) => {
          if (!session) return;
          return { ...session, revealed: !session.revealed };
        },
        { revalidate: true }
      )
    );
  }, [channel, sessionId, mutate]);

  if (!session) return <></>;

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-4">
        {members.map((m) => (
          <PokerCard
            key={m.id}
            player={m.info.name}
            value={session.votes[m.id] || ""}
            state={
              session.votes[m.id] === undefined
                ? "unplayed"
                : session.revealed
                ? "faceUp"
                : "faceDown"
            }
          />
        ))}
      </div>
      {[...fibonacci(10), "?"].map((amount) => (
        <button
          key={amount}
          className="bg-slate-400 p-4 m-4"
          onClick={async () => {
            mutate(
              async () =>
                await (
                  await axios.post("/api/vote", {
                    sessionId,
                    vote: amount,
                    socketId,
                    user_id: userId,
                  })
                ).data,
              {
                optimisticData: {
                  ...session,
                  votes: { ...session.votes, [userId]: amount },
                },
                revalidate: false,
              }
            );
          }}
        >
          {amount}
        </button>
      ))}
      <button
        onClick={() =>
          mutate(
            async (session) =>
              await (
                await axios.post("/api/reveal", {
                  sessionId,
                  revealed: session?.revealed,
                  socketId,
                })
              ).data,
            {
              optimisticData: {
                ...session,
                revealed: !session.revealed,
              },
              revalidate: false,
            }
          )
        }
      >
        Flip cards
      </button>
    </>
  );
};

export default Session;
