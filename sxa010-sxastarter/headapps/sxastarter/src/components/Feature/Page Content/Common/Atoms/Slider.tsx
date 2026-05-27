import { JSX } from "react";
import { useEffect, useRef, useState } from "react";

export type SliderProps = {
  rangeMin: number;
  rangeMax: number;
  value: number;
  onValueChange: (newValue: number) => any;
  unit?: string;
  disabled?: boolean;
  additionalStyles?: string;
};

const Slider = (props: SliderProps): JSX.Element => {
  const [percent, setPercent] = useState<number>(0);
  const ref = useRef(null);

  const unit = props.unit || "";

  const percentToValue = (percent: number, min: number, max: number) => {
    return ((max - min) * percent) / 100 + min;
  };

  const onMouseUp = () => {
    if (props.disabled) {
      return;
    }
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("touchmove", onMouseMove);
    document.removeEventListener("touchend", onMouseUp);
  };

  const onMouseDown = () => {
    if (props.disabled) {
      return;
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onMouseMove);
    document.addEventListener("touchend", onMouseUp);
  };

  const imposePercentBound = (value: number) => {
    if (value > 100) {
      return 100;
    }
    if (value < 0) {
      return 0;
    }
    return value;
  };

  const onMouseMove = (event: any, bypassDisabled?: boolean) => {
    if (props.disabled || bypassDisabled) {
      return;
    }
    if (!ref) {
      return;
    }
    if (!ref.current) {
      return;
    }
    const { left, width } = (ref.current as any).getBoundingClientRect();
    const x = (event?.clientX || event.touches?.[0]?.clientX) - left;
    const percent = imposePercentBound((x / width) * 100);
    setPercent(percent);

    const newValue = percentToValue(percent, props.rangeMin, props.rangeMax).toFixed(Math.floor(props.rangeMin + (props.rangeMax - props.rangeMin) / 2));
    props.onValueChange(parseInt(newValue));
  };

  useEffect(() => {
    const currentPercent = props.value / (props.rangeMax - props.rangeMin);
    setPercent(Math.floor(currentPercent * 100));
  }, [props.rangeMax, props.rangeMin, props.value]);

  return (
    <>
      <div className={`slider ${props.additionalStyles} ${props.disabled ? "opacity-50" : ""}`}>
        <div ref={ref} className="w-full relative select-none pt-4">
          <div className="h-[24px] flex justify-center items-center" onMouseDown={onMouseDown} onTouchStart={onMouseDown} onClick={onMouseMove}>
            <div className="bg-white/80 h-[2px] w-full"></div>
          </div>
          <div
            className="h-[15px] w-[15px] bg-white absolute top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[50%] cursor-pointer z-10 mt-2"
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
            style={{ left: `${imposePercentBound(percent)}%` }}
          >
            <span className="absolute text-sm bottom-[16px] text-white flex select-none">{props.value}</span>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div className="select-none">
            {props.rangeMin} {unit}
          </div>
          <div className="select-none">
            {Math.floor(props.rangeMin + (props.rangeMax - props.rangeMin) / 2)} {unit}
          </div>
          <div className="select-none">
            {props.rangeMax} {unit}
          </div>
        </div>
      </div>
    </>
  );
};

export default Slider;
