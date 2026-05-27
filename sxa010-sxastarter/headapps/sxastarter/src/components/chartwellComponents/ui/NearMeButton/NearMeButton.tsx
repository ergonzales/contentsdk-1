import { useI18n } from "next-localization";
import { Dispatch, SetStateAction } from "react";
import { convertGeoLocationCoordsToPostalCode } from "lib/helpers/helper";
import { useState } from "react";
import { Spinner } from "../Spinner";

interface NearMeButtonProps {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setMaxDistance: Dispatch<SetStateAction<number>>;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  styleText?: string;
  BTNStyle?: string;
  icon: string;
  iconSize?: number;
}

export const NearMeButton = ({
  setSearchTerm,
  setMaxDistance,
  setIsSearching,
  styleText = "",
  BTNStyle = "decoration-ChartwellWhite hover:decoration-ChartwellBlue",
  icon,
  iconSize = 24,
}: NearMeButtonProps) => {
  const { t: dict } = useI18n();
  const [isClicked, setIsClicked] = useState(false);

  const getLocationAndPostalCode = async () => {
    setIsClicked(true);
    setSearchTerm("");
    try {
      const { coords } = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      if (coords) {
        const postalCodeFromGeoLocLatLng = await convertGeoLocationCoordsToPostalCode(coords);
        setMaxDistance(25);
        setSearchTerm((postalCodeFromGeoLocLatLng as string).toUpperCase() || "");

        setIsSearching(true);
        setIsClicked(false);
      }
    } catch (error) {
      setIsSearching(false);
      setIsClicked(false);
      setSearchTerm("");
    }
  };

  return (
    <button className={`flex items-center gap-2 underline  p-2 ${BTNStyle}`} onClick={getLocationAndPostalCode}>
      {!isClicked ? (
        <svg width={iconSize} height={iconSize} className={`block`}>
          <image href={icon} width={iconSize} height={iconSize} />
        </svg>
      ) : (
        <Spinner w="6" h="6" fill="fill-ChartwellWhite" />
      )}

      <span className={` text-[1rem] md:text-[1.1rem] ${styleText} mr-1 `}>{dict(`ExploreResidencesNearMe`)}</span>
    </button>
  );
};
