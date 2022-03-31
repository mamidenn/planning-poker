import classNames from "classnames";
import React, { FC } from "react";

interface Props {
  primary?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: FC<Props> = (props) => {
  return (
    <button
      type={props.type ?? "button"}
      className={classNames(
        " py-2 px-4 shadow-md border-2 rounded-md text-white font-semibold active:translate-y-[1px] active:shadow-none",
        {
          "bg-orange-500": props.primary,
        }
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
