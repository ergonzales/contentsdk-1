import React from "react";

interface SAPSvgProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  secondaryColor?: string;
}

const SAPSvg: React.FC<SAPSvgProps> = ({
  width = 24,
  height = 24,
  className = "block",
  color = "#886577", // Default primary color
  secondaryColor = " #fff", // Default secondary color
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 75 75"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={className}
    style={
      {
        "--primary-color": color.length === 0 ? "#886577" : color,
        "--secondary-color": secondaryColor,
      } as React.CSSProperties
    }
  >
    <defs>
      <clipPath id="clippath">
        <rect x="-0.5" width="75" height="75" fill="none" />
      </clipPath>
    </defs>
    <g clipPath="url(#clippath)">
      <path fill="var(--primary-color)" d="M74.5,37.5c0,20.7-16.8,37.5-37.5,37.5S-.5,58.2-.5,37.5,16.3,0,37,0s37.5,16.8,37.5,37.5" />
    </g>
    <path
      fill="var(--secondary-color )"
      d="M50.7,27.7h-6.4v-6.4h6.4v6.4ZM50.7,37.2h-6.4v-6.4h6.4v6.4ZM50.7,45.7h-6.4v-6.4h6.4v6.4ZM50.7,55.2h-6.4v-6.4h6.4v6.4ZM41.2,27.7h-6.4v-6.4h6.4v6.4ZM41.2,37.2h-6.4v-6.4h6.4v6.4ZM41.2,45.7h-6.4v-6.4h6.4v6.4ZM41.2,57.3h-6.4v-8.5h6.4v8.5ZM30.6,27.7h-6.4v-6.4h6.4v6.4ZM30.6,37.2h-6.4v-6.4h6.4v6.4ZM30.6,45.7h-6.4v-6.4h6.4v6.4ZM30.6,55.2h-6.4v-6.4h6.4v6.4ZM54.9,57.3V19.2h1.1v-6.4H18.9v6.4h1.1v38.1h-2.1v4.2h39.2v-4.2h-2.1Z"
    />
  </svg>
);

export default SAPSvg;
