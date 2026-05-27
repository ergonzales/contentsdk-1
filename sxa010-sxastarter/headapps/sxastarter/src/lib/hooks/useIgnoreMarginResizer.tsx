import { useEffect, useRef, useState } from "react";

export type useIgnoreMarginResizerOutput = {
  calculatedWidth: string;
  marginOffsetRef: any;
  pseudoContainerRef: any;
};

export const useIgnoreMarginResizer = (): useIgnoreMarginResizerOutput => {
  const marginOffsetRef = useRef<HTMLDivElement>(null);
  const pseudoContainerRef = useRef<HTMLDivElement>(null);
  const [calculatedWidth, setListingAndMapboxWidth] = useState<string>("0px");

  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  });

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

  const getListingAndMapboxMarginRightValue = (): string => {
    const node = marginOffsetRef?.current;
    const nodeStyle = window?.getComputedStyle(node as any);
    const marginRight = nodeStyle?.getPropertyValue("margin-right");
    return marginRight || "0px";
  };

  const getPseudoMapboxContainerWidthValue = (): string => {
    const node = pseudoContainerRef?.current;
    const nodeStyle = window?.getComputedStyle(node as any);
    const width = nodeStyle?.getPropertyValue("width");
    return width || "0px";
  };

  useEffect(() => {
    const width = Number(getPseudoMapboxContainerWidthValue().replace("px", "")) + Number(getListingAndMapboxMarginRightValue().replace("px", ""));
    setListingAndMapboxWidth(width.toString() + "px");
  }, [dimensions, dimensions.width, dimensions.height]);

  return {
    calculatedWidth: calculatedWidth,
    marginOffsetRef: marginOffsetRef,
    pseudoContainerRef: pseudoContainerRef,
  };
};
