export interface Votes {
  [id: string]: number | null;
}

export interface PokerSession {
  id: string;
  votes: Votes;
  revealed: boolean;
}

export interface ChannelMember {
  id: string;
  info: {
    name: string;
  };
}
