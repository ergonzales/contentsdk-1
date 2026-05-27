import { SetStateAction, useEffect, useRef, useState } from "react";
export type useFullscreenResizerOutput = {
  targetContainerElement: any;
  calculatedWidth: string;
  isFullscreen: boolean;
  toggleFullscreen: SetStateAction<boolean>;
};

export const useFullscreenResizer = () => {
  const targetContainerElement = useRef<HTMLElement>(null);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [calculatedWidth, setCalculatedWidth] = useState<string>("0px");

  const getWidth = (): string => {
    const node = targetContainerElement?.current;
    const nodeStyle = window?.getComputedStyle(node as any);
    const width = nodeStyle?.getPropertyValue("width");
    return width || "0px";
  };

  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  });

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window?.innerHeight,
        width: window?.innerWidth,
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const width = Number(getWidth().replace("px", ""));
    setCalculatedWidth(width.toString() + "px");
  }, [dimensions, dimensions.width, dimensions.height]);

  return {
    targetContainerElement: targetContainerElement,
    calculatedWidth: calculatedWidth,
    isFullscreen: isFullscreen,
    toggleFullscreen: toggleFullscreen,
  };
};
