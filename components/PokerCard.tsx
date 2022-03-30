import React, { FC } from "react";

type CardState = "faceUp" | "faceDown" | "unplayed";

interface Props {
  player?: string;
  value: string;
  state: CardState;
}

const card: Record<CardState, (value: string) => JSX.Element> = {
  faceDown: () => (
    <div className="border-4 border-gray-50 outline outline-1 outline-gray-900/5 w-24 h-36 shadow-md rounded-lg bg-card-back" />
  ),
  faceUp: (value) => (
    <div className="flex outline outline-1 outline-gray-900/5 w-24 h-36 p-1 shadow-md rounded-lg bg-white">
      <div className="flex flex-col w-full justify-between bg-gradient-to-br from-slate-400 to-slate-700 bg-clip-text text-transparent">
        <span className="self-start text-sm">{value}</span>
        <span className="self-center text-4xl font-semibold">{value}</span>
        <span className="self-end text-sm rotate-180">{value}</span>
      </div>
    </div>
  ),
  unplayed: () => (
    <div className="w-24 h-36 bg-gray-500/30 blur-sm rounded-lg" />
  ),
};

export const PokerCard: FC<Props> = (props) => {
  return (
    <div className="flex flex-col items-center gap-1">
      {card[props.state](props.value)}
      {props.player && <span className="font-semibold">{props.player}</span>}
    </div>
  );
};

export default PokerCard;
