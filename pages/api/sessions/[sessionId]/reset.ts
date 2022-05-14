import { clientPromise } from "modules/mongodb";
import { pusher } from "modules/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
import { PokerSession } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PokerSession>
): Promise<void> {
  const {
    body: { socketId },
    query: { sessionId },
    method,
  } = req;

  const sessions = (await clientPromise)
    .db()
    .collection<PokerSession>("sessions");

  if (method === "POST") {
    const result = await sessions.findOneAndUpdate(
      { id: sessionId },
      {
        $set: {
          revealed: false,
          votes: {},
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        projection: { _id: 0 },
      }
    );
    if (!result.ok) {
      res.status(500).end();
      return;
    }
    await pusher.trigger(`presence-${sessionId}`, "update", result.value, {
      socket_id: socketId,
    });
    res.status(200).json(result.value!);
    return;
  }
  res.status(400).end();
}
