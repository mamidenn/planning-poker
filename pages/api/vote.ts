import { clientPromise } from "modules/mongodb";
import { pusher } from "modules/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import { Session } from "types";

const omitId = { projection: { _id: 0 } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Session>
): Promise<void> {
  const sessionId = req.body.sessionId;
  if (!sessionId) {
    res.status(400).json({ id: "", votes: {} });
    return;
  }
  const filter = { id: sessionId };
  const client = await clientPromise;
  const sessions = client.db().collection("sessions");

  const { user_id }: Pusher.PresenceChannelData = JSON.parse(req.cookies.user);
  const [updateResult] = await Promise.all([
    sessions.findOneAndUpdate(
      filter,
      { $set: { ["votes." + user_id]: req.body.vote } },
      {
        upsert: true,
        returnDocument: "after",
        ...omitId,
      }
    ),
    pusher.trigger(
      `presence-${req.body.sessionId}`,
      "member_voted",
      { userId: user_id, vote: req.body.vote },
      { socket_id: req.body.socketId }
    ),
  ]);
  res.status(200).json(updateResult.value as unknown as Session);
}
