import { clientPromise } from "modules/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Session>
): Promise<void> {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    res.status(400).json({ id: "", votes: {}, revealed: false });
    return;
  }
  const client = await clientPromise;
  const sessions = client.db().collection<Session>("sessions");

  const data = await sessions.findOne(
    { id: sessionId },
    { projection: { _id: 0 } }
  );
  res.status(200).json(data || { id: sessionId, votes: {}, revealed: false });
}
