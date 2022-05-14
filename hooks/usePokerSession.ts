import axios from "axios";
import { PusherContext } from "context";
import { Channel, Members } from "pusher-js";
import { useContext, useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import { ChannelMember, PokerSession } from "types";

const fetcher = async (uri: string) => await (await axios.get(uri)).data;

export const usePokerSession = (sessionId: string) => {
  const { pusher, socketId } = useContext(PusherContext);
  const [channel, setChannel] = useState<Channel>();
  const [members, setMembers] = useState<ChannelMember[]>([]);
  const { data: session, mutate } = useSWR<PokerSession>(
    () => `/api/sessions/${sessionId}`,
    fetcher
  );
  const resetter = useCallback(
    async () =>
      await (
        await axios.post(`/api/sessions/${sessionId}/reset`, { socketId })
      ).data,
    [sessionId, socketId]
  );
  const flipper = useCallback(
    async () =>
      await (
        await axios.post(`/api/sessions/${sessionId}/flip`, { socketId })
      ).data,
    [sessionId, socketId]
  );
  const voter = useCallback(
    async (session) =>
      await (
        await axios.post(`/api/sessions/${sessionId}/vote`, {
          session,
          socketId,
        })
      ).data,
    [sessionId, socketId]
  );
  const reset = useCallback(
    () =>
      mutate(resetter, {
        optimisticData: { ...session!, revealed: false, votes: {} },
        revalidate: false,
      }),
    [mutate, resetter, session]
  );
  const flip = useCallback(
    () =>
      session &&
      mutate(flipper, {
        optimisticData: { ...session, revealed: !session.revealed },
        revalidate: false,
      }),
    [flipper, mutate, session]
  );
  const vote = useCallback(
    (vote) =>
      session &&
      mutate(voter, {
        optimisticData: { ...session, votes: { ...session.votes, ...vote } },
        revalidate: false,
      }),
    [mutate, session, voter]
  );

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
    channel.bind("update", (session: PokerSession) =>
      mutate(session, { revalidate: false })
    );
  }, [channel, sessionId, mutate]);

  return { session, members, vote, flip, reset };
};
