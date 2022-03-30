export interface Votes {
  [id: string]: string;
}

export interface Session {
  id: string;
  votes: Votes;
}

export interface ChannelMember {
  id: string;
  info: {
    name: string;
  };
}
