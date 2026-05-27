import { useState, useEffect } from "react";

const useBackGroundPosition = (initialPosition: string) => {
  const [styleBackGroundPosition, setStyleBackGroundPosition] = useState("");

  useEffect(() => {
    const getBackGroundPosition = (position: string) => {
      switch (position) {
        case "bg-bottom":
          return setStyleBackGroundPosition("object-bottom");
        case "bg-center":
          return setStyleBackGroundPosition("object-center");
        case "bg-left":
          return setStyleBackGroundPosition("object-left");
        case "bg-left-bottom":
          return setStyleBackGroundPosition("object-left-bottom");
        case "bg-left-top":
          return setStyleBackGroundPosition("object-left-top");
        case "bg-right":
          return setStyleBackGroundPosition("object-right");
        case "bg-right-bottom":
          return setStyleBackGroundPosition("object-right-bottom");
        case "bg-right-top":
          return setStyleBackGroundPosition("object-right-top");
        case "bg-top":
          return setStyleBackGroundPosition("object-top");
        default:
          return setStyleBackGroundPosition("object-center");
      }
    };
    getBackGroundPosition(initialPosition);
  }, [initialPosition]);

  return styleBackGroundPosition;
};

export default useBackGroundPosition;
