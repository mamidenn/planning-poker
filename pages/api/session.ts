import { clientPromise } from "modules/mongodb";
import { pusher } from "modules/pusher";
import { MatchKeysAndValues } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import { PokerSession } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PokerSession>
): Promise<void> {
  const sessions = (await clientPromise)
    .db()
    .collection<PokerSession>("sessions");

  switch (req.method) {
    case "GET":
      const { sessionId } = req.query;
      if (!sessionId) {
        res.status(400).end();
        return;
      }
      const data = await sessions.findOne(
        { id: sessionId },
        { projection: { _id: 0 } }
      );
      if (!data) {
        res.status(404).end();
        return;
      }
      res.status(200).json(data);
      return;
    case "POST":
      const { user_id }: Pusher.PresenceChannelData = JSON.parse(
        req.cookies.user
      );
      const { session, socketId } = req.body;

      if (!session || !socketId) {
        res.status(400).end();
        return;
      }

      const $set: MatchKeysAndValues<PokerSession> = {
        revealed: session.revealed,
      };
      if (session.votes[user_id] !== undefined)
        $set["votes." + user_id] = session.votes[user_id];

      const updateResult = await sessions.findOneAndUpdate(
        { id: session.id },
        { $set },
        {
          upsert: true,
          returnDocument: "after",
          projection: { _id: 0 },
        }
      );
      if (!updateResult.ok) {
        res.status(500).end();
        return;
      }
      await pusher.trigger(
        `presence-${session.id}`,
        "update",
        updateResult.value,
        { socket_id: socketId }
      );

      res.status(200).json(updateResult.value!);
      return;
  }
  res.status(400).end();
}
