import { clientPromise } from "modules/mongodb";
import { pusher } from "modules/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import { Votes } from "types";

const omitIds = { projection: { _id: 0, id: 0 } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Votes>
): Promise<void> {
  const sessionId = req.body.sessionId || req.query.sessionId;
  if (!sessionId) {
    res.status(400).json({});
    return;
  }
  const filter = { id: sessionId };
  const client = await clientPromise;
  const sessions = client.db().collection("sessions");
  switch (req.method) {
    case "GET":
      const data = await sessions.findOne<Votes>(filter, omitIds);
      res.status(200).json(data || {});
      break;
    case "POST":
      const { user_id }: Pusher.PresenceChannelData = JSON.parse(
        req.cookies.user
      );
      const [updateResult] = await Promise.all([
        sessions.findOneAndUpdate(
          filter,
          { $set: { [user_id]: req.body.vote } },
          {
            upsert: true,
            returnDocument: "after",
            ...omitIds,
          }
        ),
        pusher.trigger(
          `presence-${req.body.sessionId}`,
          "member_voted",
          { userId: user_id, vote: req.body.vote },
          { socket_id: req.body.socketId }
        ),
      ]);
      res.status(200).json(updateResult.value as Votes);
      break;
  }
}
