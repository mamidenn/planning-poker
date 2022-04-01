import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";

type CardState = "faceUp" | "faceDown" | "unplayed";

interface Props {
  player?: string;
  value: string;
  state: CardState;
}

const card: Record<CardState, (value: string) => JSX.Element> = {
  faceDown: () => (
    <div className="border-4 border-gray-50 outline outline-1 outline-gray-900/5 shadow-md rounded-lg bg-card-back" />
  ),
  faceUp: (value) => (
    <div className="flex outline outline-1 outline-gray-900/5 p-1 shadow-md rounded-lg bg-white">
      <div className="flex flex-col w-full justify-between bg-gradient-to-br from-slate-400 to-slate-700 bg-clip-text text-transparent">
        <span className="self-start text-sm">{value}</span>
        <span className="self-center text-4xl font-semibold">{value}</span>
        <span className="self-end text-sm rotate-180">{value}</span>
      </div>
    </div>
  ),
  unplayed: () => <div className="bg-gray-500/30 blur-sm rounded-lg" />,
};

export const PokerCard: FC<Props> = (props) => {
  const [state, setState] = useState(props.state);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (
      (state === "faceDown" && props.state === "faceUp") ||
      (state === "faceUp" && props.state === "faceDown")
    ) {
      (async () => {
        setTransitioning(true);
        await new Promise((resolve) => setTimeout(resolve, 75));
        setState(props.state);
        setTransitioning(false);
      })();
    } else {
      setState(props.state);
    }
  }, [state, props.state]);

  return (
    <div className="flex flex-col gap-2">
      <div
        className={classNames(
          "transition-transform ease-linear aspect-w-2 aspect-h-3",
          {
            "rotate-y-180": transitioning,
          }
        )}
      >
        {card[state](props.value)}
      </div>
      {props.player && (
        <span className="font-semibold text-center overflow-hidden text-ellipsis whitespace-nowrap">
          {props.player}
        </span>
      )}
    </div>
  );
};

export default PokerCard;
