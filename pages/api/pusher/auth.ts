import { pusher } from "modules/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pusher.AuthResponse>
) {
  const { socket_id, channel_name } = req.body;
  const user: Pusher.PresenceChannelData = JSON.parse(req.cookies.user);
  const auth = pusher.authenticate(socket_id, channel_name, user);
  res.status(200).json(auth);
}
