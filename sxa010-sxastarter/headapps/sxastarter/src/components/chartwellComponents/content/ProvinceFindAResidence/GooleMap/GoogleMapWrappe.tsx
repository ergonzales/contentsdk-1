import { GoogleMap } from "./GoogleMap";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import dynamic from "next/dynamic";
// import scConfig from 'sitecore.config';
import { Dispatch, JSXElementConstructor, ReactElement, SetStateAction } from "react";
import { ResidenceListModel } from "src/models/Residence";

export const GoogleMapWrapper = ({ residences, setIsGoogleMapAvailable, zoom }: { residences: ResidenceListModel[]; setIsGoogleMapAvailable: Dispatch<SetStateAction<boolean>>; zoom?: number }) => {
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const DynamicGoogleMap = dynamic(() => Promise.resolve(GoogleMap), {
    ssr: false,
  });
  const render = (status: Status): ReactElement<any, string | JSXElementConstructor<any>> => {
    if (status === Status.LOADING) return <div className="bg-ChartwellGrey w-full h-full"></div>;
    if (status === Status.FAILURE) return <div>Error loading map</div>;
    setIsGoogleMapAvailable(false);
    return <></>;
  };
  if (!GOOGLE_API_KEY) {
    setIsGoogleMapAvailable(false);
    return <div>Error loading map</div>;
  }

  return (
    <Wrapper apiKey={GOOGLE_API_KEY} render={render}>
      <DynamicGoogleMap zoom={zoom} residences={residences} />
    </Wrapper>
  );
};
