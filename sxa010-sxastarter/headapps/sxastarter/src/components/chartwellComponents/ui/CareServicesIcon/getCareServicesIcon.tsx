import ALSvg from "./ALSvg";
import ILSvg from "./ILSvg";
import LTCSvg from "./LTCSvg";
import MCSvg from "./MCSvg";
import SAPSvg from "./SAPSvg";

export const getCareServicesIcon = (type: string, width?: number, height?: number, color?: string) => {
  switch (type?.trim().toLowerCase()) {
    case "assisted living":
    case "semi-autonome":
      return <ALSvg width={width} height={height} color={color} />;
    case "independent living":
    case "autonome":
      return <ILSvg width={width} height={height} color={color} />;
    case "long term care":
    case "soins de longue durée":
      return <LTCSvg width={width} height={height} color={color} />;
    case "memory care":
    case "unité de soins":
      return <MCSvg width={width} height={height} color={color} />;
    case "seniors apartments":
    case "appartements":
      return <SAPSvg width={width} height={height} color={color} />;
    default:
      return null;
  }
};
