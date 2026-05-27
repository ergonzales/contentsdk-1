import React from "react";

interface LTCSvgProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  secondaryColor?: string;
}

const LTCSvg: React.FC<LTCSvgProps> = ({
  width = 24,
  height = 24,
  className = "block",
  color = "#89c85f", // Default primary color
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
        "--primary-color": color.length === 0 ? "#89c85f" : color,
        "--secondary-color": secondaryColor,
      } as React.CSSProperties
    }
  >
    <defs>
      <clipPath id="clippath">
        <rect width="75" height="75" fill="none" />
      </clipPath>
      <clipPath id="clippath-1">
        <circle cx="37.5" cy="37.5" r="37.5" fill="none" />
      </clipPath>
    </defs>
    <g clipPath="url(#clippath)">
      <path fill="var(--primary-color)" d="M75,37.5c0,20.7-16.8,37.5-37.5,37.5S0,58.2,0,37.5,16.8,0,37.5,0s37.5,16.8,37.5,37.5" />
    </g>
    <g clipPath="url(#clippath-1)">
      <g>
        <path fill="var(--secondary-color)" d="M29.2,24.6c2.8,0,5.1-2.3,5.1-5.1s-2.3-5.1-5.1-5.1-5.1,2.3-5.1,5.1,2.3,5.1,5.1,5.1" />
        <path fill="var(--secondary-color)" d="M47.7,30.8c2.7,0,4.8-2.1,4.8-4.8s-2.2-4.8-4.8-4.8-4.8,2.1-4.8,4.8,2.2,4.8,4.8,4.8" />
        <path
          fill="var(--secondary-color)"
          d="M47.5,59c-3.3,0-6.1-2.7-6.1-6.1s.2-1.5.4-2.2c.1,0,.2,0,.3,0h11c.2.7.4,1.4.4,2.1,0,3.3-2.7,6.1-6.1,6.1M49.9,42.7c1,.8,2,1.6,3.3,2.2h-3.3v-2.2ZM60.6,60l-1.5-5.5-2.2-8.2c0-.3-.2-.5-.4-.8h0c1,0,1.9-.8,1.9-1.9s-.8-1.9-1.9-1.9c-2.8,0-4.6-1.2-5.6-7.1,0-.1,0-.3-.1-.4-.2-1.7-1.8-2.9-3.3-3.2,0,0-.5-.1-1-.1-.5,0-1.1.1-1.1.1h0c-1.6.4-3.3,1.7-3.3,3.7v9.6l-1.4-10c-.1-.8-.9-1.4-1.7-1.3-.8.1-1.4.9-1.3,1.7v.5c0,0,0,0,0,0-3.1-.4-5-.7-5.9-1.8-.7-.9-1.1-5.4-1.2-5.6-.3-1.4-1.5-2.5-2.6-3.1,0,0-.5-.3-1.1-.4-.5-.1-1.2-.1-1.2-.1h0c-1.8,0-3.9,1-4.3,3.1l-2.4,11c-.2,1.1-.4,2.2,0,3.2l-.2,8.8-3.3,8.4c-.5,1.3.1,2.8,1.4,3.3.3.1.6.2.9.2,1,0,2-.6,2.4-1.6l3.5-8.7c0-.2.1-.5.2-.8l1-4.5,3.1,4.5,2.4,9.3c.3,1.1,1.3,1.9,2.4,1.9s.4,0,.7,0c1.3-.4,2.2-1.7,1.8-3.1l-2.5-9.7c0-.2-.2-.5-.3-.7l-4.4-7.6c.1-.3.2-.5.3-.8l.7-3.7c1.1,1.3,6.3,2.7,8.9,2.7.2,0,.4,0,.5,0l1.2,9c-.8,1.4-1.3,3-1.3,4.7,0,5.1,4.1,9.2,9.2,9.2s6.3-1.8,7.9-4.5h0s0,0,0,0l1,3.6c.3,1.1,1.5,1.8,2.6,1.5,1.2-.3,1.8-1.5,1.5-2.6"
        />
      </g>
    </g>
  </svg>
);

export default LTCSvg;
