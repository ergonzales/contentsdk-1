// import { HeadingLevel } from "components/chartwellComponents/ui/HeadingLevel/HeadingLevel";
import { useEffect, useState, JSX } from "react";

import { InView, useInView } from "react-intersection-observer";
interface ChartProps {
  chartData: any;
  colorizer: any[];
  colorIndex: number;
}

export const ChartItem = ({ chartData, colorizer, colorIndex }: ChartProps): JSX.Element => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [displayNumber, setDisplayNumber] = useState(0);

  const { fields } = chartData;

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setDisplayNumber((prevNumber) => {
        if (prevNumber < fields.number.value) {
          return prevNumber + 1;
        }
        clearInterval(interval);
        return fields.number.value;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [fields.number.value, inView]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className={`h-[240px] w-[240px] md:h-[200px] md:w-[200px] xl:h-[280px] xl:w-[280px] rounded-full relative ${colorizer[colorIndex].bg} overflow-hidden`}>
        <InView
          id="animation"
          className={`h-[240px] w-[240px] md:h-[200px] md:w-[200px] xl:h-[280px] xl:w-[280px] rounded-full absolute ${inView ? "animation opacity-1 " : "opacity-0"}   `}
          style={{
            background: `conic-gradient(${colorizer[colorIndex].rgb} ${displayNumber}%, ${colorizer[colorIndex].rgb} ${displayNumber}%, transparent ${displayNumber}%,transparent 100%)`,
          }}
        ></InView>

        <div className="h-[150px] w-[150px] md:h-[130px] md:w-[130px] xl:h-[180px] xl:w-[180px] bg-ChartwellWhite rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className={` absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[80%] text-5xl xl:text-6xl leading-7 ${colorizer[colorIndex].text}`}>{displayNumber}%</p>
        </div>
      </div>
      <p className={`${colorizer[colorIndex].text} font-bold text-center text-xl`}>{fields?.Description?.value}</p>
    </div>
  );
};
