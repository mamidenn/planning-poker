import axios from "axios";
import { PusherContext } from "context";
import Pusher, { Channel, Members } from "pusher-js";
import { useContext, useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import { ChannelMember, PokerSession } from "types";

const fetcher = async (uri: string) => await (await axios.get(uri)).data;

export const usePokerSession = (sessionId: string) => {
  const { pusher, socketId } = useContext(PusherContext);
  const [channel, setChannel] = useState<Channel>();
  const [members, setMembers] = useState<ChannelMember[]>([]);
  const { data: session, mutate } = useSWR<PokerSession>(
    () => "/api/session?sessionId=" + sessionId,
    fetcher
  );
  const mutator = useCallback(
    async (session) =>
      await (
        await axios.put("/api/session", { session, socketId })
      ).data,
    [socketId]
  );
  const setSession = useCallback(
    (session: PokerSession) =>
      mutate(mutator, {
        optimisticData: session,
      }),
    [mutate, mutator]
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
    channel.bind("update", (session: PokerSession) => mutate(session));
  }, [channel, sessionId, mutate]);

  return { session, setSession, members };
};
