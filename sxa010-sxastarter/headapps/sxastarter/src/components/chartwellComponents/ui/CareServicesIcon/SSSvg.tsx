import React from "react";

interface SSSvgProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  secondaryColor?: string;
}

const SSSvg: React.FC<SSSvgProps> = ({
  width = 24,
  height = 24,
  className = "block",
  color = "#fff", // Default primary color
  secondaryColor = "#b06d8f", // Default secondary color
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
        "--primary-color": color.length === 0 ? "#fff" : color,
        "--secondary-color": secondaryColor,
      } as React.CSSProperties
    }
  >
    <defs>
      <clipPath id="clippath">
        <rect width="75" height="75" fill="none" />
      </clipPath>
      <clipPath id="clippath-1">
        <path d="M37.5,0C16.79,0,0,16.79,0,37.5s16.79,37.5,37.5,37.5,37.5-16.79,37.5-37.5S58.21,0,37.5,0Z" />
      </clipPath>
    </defs>
    <g clipPath="url(#clippath)">
      <path fill="var(--secondary-color)" d="M75,37.5c0,20.71-16.79,37.5-37.5,37.5S0,58.21,0,37.5,16.79,0,37.5,0s37.5,16.79,37.5,37.5" />
    </g>
    <g clipPath="url(#clippath-1)">
      <path
        fill="var(--primary-color)"
        d="M49.26,33.21H26.73c-1.04,0-1.88-.78-1.88-1.75s.84-1.75,1.88-1.75h22.53c1.04,0,1.88,.78,1.88,1.75s-.84,1.75-1.88,1.75m-15.01-17.58c0-.58,.5-1.06,1.12-1.06h5.26c.62,0,1.12,.49,1.12,1.06v7.11h-7.5v-7.11Zm16.35,7.11h-5.11V14.11c0-1.45-1.24-2.63-2.8-2.63h-9.39c-1.56,0-2.8,1.18-2.8,2.63v8.63h-5.11c-2.02,0-3.66,1.53-3.66,3.41v31.64c0,1.89,1.64,3.41,3.66,3.41h2.66c.28,1.01,1.26,1.75,2.43,1.75s2.15-.74,2.43-1.75h10.17c.27,1.01,1.26,1.75,2.43,1.75s2.15-.74,2.43-1.75h2.66c2.02,0,3.66-1.52,3.66-3.41V26.16c0-1.89-1.64-3.41-3.66-3.41"
      />
    </g>
  </svg>
);

export default SSSvg;
