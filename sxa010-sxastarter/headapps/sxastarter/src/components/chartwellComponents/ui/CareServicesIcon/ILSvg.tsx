import React from "react";

interface ILSvgProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  secondaryColor?: string;
}

const ILSvg: React.FC<ILSvgProps> = ({
  width = 24,
  height = 24,
  className = "block",
  color = "#8e75a0", // Default primary color
  secondaryColor = "#fff", // Default secondary color
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
        "--primary-color": color.length === 0 ? "#8e75a0" : color,
        "--secondary-color": secondaryColor,
      } as React.CSSProperties
    }
  >
    <defs>
      <clipPath id="clippath">
        <rect width="75" height="75" fill="none" />
      </clipPath>
      <clipPath id="clippath-1">
        <path d="M37.5,0C16.79,0,0,16.79,0,37.5s16.79,37.5,37.5,37.5,37.5-16.79,37.5-37.5S58.21,0,37.5,0Z" fill="none" />
      </clipPath>
    </defs>
    <g clipPath="url(#clippath)">
      <path fill="var(--primary-color)" d="M75,37.5c0,20.71-16.79,37.5-37.5,37.5S0,58.21,0,37.5,16.79,0,37.5,0s37.5,16.79,37.5,37.5" />
    </g>
    <g clipPath="url(#clippath-1)">
      <path fill="var(--secondary-color)" d="M25.77,58.12c-.91,1.42-.85,3.16,.7,4.22,1.33,.89,3.7,.78,4.62-.64,1.88-2.94,5.3-5.15,5.3-5.15,0,0-1.26-2.53-1.85-7.27,0,0-6.61,5.5-8.76,8.84" />
      <path
        fill="var(--secondary-color)"
        d="M52.64,32.6c-3.87-3.14-8.01-5.96-12.55-8.23-.49-.33-1.05-.6-1.64-.78-.39-.14-.78-.22-1.15-.22-.62-.07-1.25-.04-1.82,.1-1.51,.37-2.53,1.21-3.11,2.28-2.8,2.98-5.13,6.22-7.23,9.65-2.08,3.4,3.62,6.44,5.7,3.04,.65-1.06,1.32-2.11,2.02-3.14,.6,3.71,1.2,7.43,1.81,11.13,.12,.75,.51,1.4,1.06,1.92,.87,5.28,2.49,10.49,5.02,15.29,1.85,3.49,7.54,.44,5.7-3.04-1.9-3.58-3.16-7.55-3.94-11.55,1.71-1.09,2.33-3.05,2.01-5.03-.59-3.67-1.19-7.33-1.78-10.99,1.81,1.18,3.55,2.47,5.23,3.83,3.17,2.57,7.86-1.67,4.67-4.26"
      />
      <path fill="var(--secondary-color)" d="M42.56,16.35c0,3.14-2.58,5.69-5.76,5.69s-5.75-2.55-5.75-5.69,2.57-5.69,5.75-5.69,5.76,2.55,5.76,5.69" />
    </g>
  </svg>
);

export default ILSvg;
