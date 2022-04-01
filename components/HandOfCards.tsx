import React, { FC } from "react";
import { PokerCard } from "components";

type Props = {
  values: number[];
  selected?: number;
  onSelection?: (selected: number) => void;
};

export const HandOfCards: FC<Props> = (props) => {
  return (
    <div className="flex">
      {props.values.map((amount) => (
        <button
          key={amount}
          className={
            "w-24 disabled:opacity-0 disabled:-translate-y-20 disabled:pointer-events-none hover:-translate-y-10 translate-y-0 transition-all -ml-8 first:ml-0 shadow-md"
          }
          disabled={amount === props.selected}
          onClick={() => props.onSelection?.(amount)}
        >
          <PokerCard value={amount} state="faceUp" />
        </button>
      ))}
    </div>
  );
};

export default HandOfCards;
