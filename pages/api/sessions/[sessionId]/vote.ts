import { clientPromise } from "modules/mongodb";
import { pusher } from "modules/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
import { PokerSession } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PokerSession>
): Promise<void> {
  const {
    body: { session, socketId },
    cookies: { user },
    query: { sessionId },
    method,
  } = req;
  const { user_id } = (user && JSON.parse(user)) ?? { user_id: undefined };

  if (method === "POST") {
    if (!session || !socketId || !user_id) {
      res.status(400).end();
      return;
    }

    console.log(session.votes[user_id]);

    const sessions = (await clientPromise)
      .db()
      .collection<PokerSession>("sessions");
    const updateResult = await sessions.findOneAndUpdate(
      { id: sessionId },
      {
        $set: {
          [`votes.${user_id}`]: session.votes[user_id],
        },
      },
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
