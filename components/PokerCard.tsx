import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";

type CardState = "faceUp" | "faceDown" | "unplayed";

interface Props {
  player?: string;
  value: number | null;
  state: CardState;
}

const DynamicText: FC<{ text: string; className: string }> = (props) => {
  return (
    <svg viewBox="0 0 18 18" className={props.className}>
      <text x="50%" y="85%" textAnchor="middle">
        {props.text}
      </text>
    </svg>
  );
};

const card: Record<CardState, (value: string) => JSX.Element> = {
  faceDown: () => (
    <div className="border-4 border-gray-50 outline outline-1 outline-gray-900/5 shadow-md rounded-lg bg-card-back" />
  ),
  faceUp: (value) => (
    <div className="flex outline outline-1 outline-gray-900/5 p-1 shadow-md rounded-lg bg-white">
      <div className="flex flex-col w-full justify-between fill-slate-500">
        <DynamicText className="self-start w-1/6" text={value} />
        <DynamicText className="self-center w-1/2" text={value} />
        <DynamicText className="self-end rotate-180 w-1/6" text={value} />
      </div>
    </div>
  ),
  unplayed: () => <div className="border-4 rounded-lg" />,
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
        {card[state](props.value?.toString() ?? "?")}
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
