import { clientPromise } from "modules/mongodb";
import { pusher } from "modules/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Session>
): Promise<void> {
  const sessionId = req.body.sessionId;
  if (!sessionId) {
    res.status(400).json({ id: "", votes: {}, revealed: false });
    return;
  }
  const client = await clientPromise;
  const sessions = client.db().collection<Session>("sessions");

  const [updateResult] = await Promise.all([
    sessions.findOneAndUpdate(
      { id: sessionId },
      { $set: { revealed: req.body.revealed } },
      {
        upsert: true,
        returnDocument: "after",
        projection: { _id: 0 },
      }
    ),
    pusher.trigger(
      `presence-${req.body.sessionId}`,
      "revealed",
      {},
      { socket_id: req.body.socketId }
    ),
  ]);
  res.status(200).json(updateResult.value!);
}
