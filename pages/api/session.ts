import { clientPromise } from "modules/mongodb";
import { pusher } from "modules/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
import { PokerSession } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PokerSession>
): Promise<void> {
  const sessions = (await clientPromise)
    .db()
    .collection<PokerSession>("sessions");

  if (req.method === "GET") {
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
  }
  if (req.method === "PUT") {
    const { session, socketId } = req.body;

    if (!session || !socketId) {
      res.status(400).end();
      return;
    }

    const updateResult = await sessions.findOneAndUpdate(
      { id: session.id },
      {
        $set: {
          revealed: session.revealed,
          votes: session.votes,
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
  if (req.method === "POST") {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).end();
      return;
    }

    const insertResult = await sessions.insertOne({
      id: sessionId as string,
      revealed: false,
      votes: {},
    });
    if (!insertResult.acknowledged) {
      res.status(500).end();
      return;
    }

    res.redirect("/session/" + sessionId);
    return;
  }
  res.status(400).end();
}
