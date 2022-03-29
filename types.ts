export interface Votes {
  [id: string]: string;
}

export interface ChannelMember {
  id: string;
  info: {
    name: string;
  };
}
