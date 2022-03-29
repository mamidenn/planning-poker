import { serialize } from "cookie";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.body;
  if (!name) res.status(400).json({});
  const user: Pusher.PresenceChannelData = {
    user_id: randomUUID(),
    user_info: {
      name: name,
    },
  };
  res
    .setHeader(
      "Set-Cookie",
      serialize("user", JSON.stringify(user), { sameSite: "strict", path: "/" })
    )
    .redirect(req.body.source || "/");
}
