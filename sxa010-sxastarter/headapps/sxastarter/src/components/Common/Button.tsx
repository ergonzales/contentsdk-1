import { JSX } from "react";
import { useState } from "react";

export type ButtonProps = {
  children?: JSX.Element;
  color?: "plum" | "blue" | "blue-fill-200" | "transparent-white" | "plum-transparent";
  type?: "submit" | "button";
  additionalClass?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = (props: ButtonProps): JSX.Element => {
  const [_state, _setState] = useState<boolean>(false);

  const plumStyle =
    "bg-ChartwellPlum text-ChartwellWhite   hover:bg-ChartwellWhite hover:text-ChartwellPlum focus:bg-ChartwellPlum focus:text-white hover:border-ChartwellPlum focus:border-ChartwellPlum  border-2  ";
  const blueStyle = "bg-white text-ChartwellBlue outline-2 outline-ChartwellBlue outline hover:bg-ChartwellBlue hover:text-white focus:bg-ChartwellBlue focus:text-white";
  const blueFillStyle =
    "bg-ChartwellBlue text-white outline-2 outline-ChartwellBlue outline hover:bg-ChartwellWhite hover:outline-ChartwellBlue hover:text-ChartwellBlue  focus:outline-ChartwellWhite ";
  const transparentWhiteStyle = "bg-transparent text-white outline-2 outline-white outline hover:outline-white hover:bg-white hover:text-ChartwellPlum focus:bg-white focus:text-ChartwellPlum";
  const plumTransparentStyle = "text-ChartwellPlum outline-2 outline-ChartwellPlum outline hover:bg-ChartwellPlum hover:text-white focus:bg-ChartwellPlum focus:text-white";
  const selectStyle = () => {
    switch (props.color) {
      case "plum":
        return plumStyle;
      case "plum-transparent":
        return plumTransparentStyle;
      case "blue":
        return blueStyle;
      case "blue-fill-200":
        return blueFillStyle;
      case "transparent-white":
        return transparentWhiteStyle;
      default:
        return plumStyle;
    }
  };

  return (
    <button
      onClick={() => {
        if (props.disabled) {
          return;
        }

        props.onClick && props.onClick();
      }}
      type={props.type || "button"}
      className={`${selectStyle()}  text-[0.9375rem] rounded-xl duration-300 ease-in-out  ${props.additionalClass} ${props.disabled ? "opacity-50" : ""}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
