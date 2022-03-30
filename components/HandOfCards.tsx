import React, { FC } from "react";
import { PokerCard } from "components";

type Props = {
  values: string[];
  selected?: string;
  onSelection?: (selected: string) => void;
};

export const HandOfCards: FC<Props> = (props) => {
  return (
    <div className="flex">
      {props.values.map((amount) => (
        <button
          key={amount}
          className={
            "disabled:opacity-0 disabled:-translate-y-32 disabled:pointer-events-none hover:-translate-y-16 translate-y-0 transition-all -ml-10 first:ml-0 shadow-md"
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
