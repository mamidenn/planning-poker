import { clientPromise } from "modules/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { PokerSession } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PokerSession>
): Promise<void> {
  const {
    query: { sessionId },
    method,
  } = req;

  const sessions = (await clientPromise)
    .db()
    .collection<PokerSession>("sessions");

  if (method === "GET") {
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
  if (method === "POST") {
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
