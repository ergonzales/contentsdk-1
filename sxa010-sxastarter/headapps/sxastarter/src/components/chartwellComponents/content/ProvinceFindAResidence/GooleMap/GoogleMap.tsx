/// <reference types="@types/google.maps" />
import React, { useEffect, useRef, useCallback } from "react";
// ChartwellMarker now comes from DAM
// import scConfig from 'sitecore.config';

import { useI18n } from "next-localization";
// import { getCareServicesIcon } from "components/chartwellComponents/ui/CareServicesIcon/getCareServicesIcon";
// import { createRoot } from "react-dom/client";
import { getCareServicesBgColorIcon } from "components/chartwellComponents/ui/CareServicesIcon/getCareServicesBgColorIcon";
import { promoDataHandler } from "lib/helpers/residence-helpers";
import ReactDOMServer from "react-dom/server";
import InfoWindowContent from "./InfoWindowContent";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

interface Marker {
  latlng: { lat: number; lng: number };
  residenceName: string;
  residenceAddress: string;
  language: string;
  url: string;
  textPrice: string;
  isPromo: boolean;
  livingOption: string[];
  livingOptionsObj: Record<string, any>;
  contactNumber: string;
  imageSrc: string;
}

interface GoogleMapProps {
  residences: any[];
  zoom?: number;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ residences, zoom = 10 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  // No need to fetch SVG, just use the DAM URL
  const MARKER_PNG_URL = "https://dam.chartwell.com/m/95a55a0d8719fa4/mini-google-map-chartwell-pin-01.png"; // TODO: need to grab this from the content instead of hard coded url
  const GOOGLE_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;
  const { sitecoreContext } = useSitecoreContext();
  const { t: dictionary } = useI18n();

  const initMap = useCallback(async () => {
    if (!ref.current || !residences.length) return;
    const { Map, InfoWindow } = (await (window as any).google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = (await (window as any).google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

    const infoWindow = new InfoWindow();
    const center = residences.reduce((acc, res) => ({ lat: acc.lat + Number(res.Lat), lng: acc.lng + Number(res.Lng) }), { lat: 0, lng: 0 });

    center.lat /= residences.length || 1;
    center.lng /= residences.length || 1;

    if (isNaN(center.lat) || isNaN(center.lng)) return;
    const map = new Map(ref.current, { zoom, center, mapId: GOOGLE_MAP_ID });
    const createMarker = (residence: Marker) => {
      // Use AdvancedMarkerElement with PNG image content - Marker is deprecated
      const img = document.createElement("img");
      img.src = MARKER_PNG_URL;
      img.style.width = "40px";
      img.style.height = "40px";
      img.style.pointerEvents = "none";
      img.alt = "Chartwell Marker";
      const marker = new AdvancedMarkerElement({
        position: residence.latlng,
        map,
        title: residence.residenceName,
        content: img,
        gmpClickable: true,
      });
      marker.addEventListener("gmp-click", () => {
        const contentHtml = ReactDOMServer.renderToString(<InfoWindowContent residence={residence} dictionary={dictionary} getCareServicesBgColorIcon={getCareServicesBgColorIcon} />);
        infoWindow.setContent(contentHtml);
        infoWindow.open(map, marker);
      });
    };

    residences.forEach((residence) => {
      if (!residence.Lat || !residence.Lng) return;

      const { isPromo, textPromoPrice, formattedPrice, isPromoPriceLessRegular, regularPrices, promoPrice } =
        (residence?.propertySuitPlans && promoDataHandler(residence?.propertySuitPlans, sitecoreContext, dictionary)) || {};
      const textPrice = isPromo
        ? isPromoPriceLessRegular
          ? dictionary("suitePromoPricetextFormat", { amount: `<span class=\"text-[1.1rem] font-extrabold\">${formattedPrice}</span>` })
          : textPromoPrice
        : dictionary("suitePricetextFormat", { amount: `<span class=\"text-[1.1rem] font-extrabold\">${formattedPrice}</span>` });
      createMarker({
        latlng: { lat: Number(residence.Lat), lng: Number(residence.Lng) },
        residenceName: residence.residenceName,
        residenceAddress: residence.residenceAddress,
        isPromo,
        language: residence.language,
        url: residence.language === "fr" ? "/fr" + residence.url : residence.url,
        textPrice: regularPrices?.length || promoPrice?.length ? textPrice : "",
        livingOption: residence.livingOption,
        livingOptionsObj: residence.livingOptions,
        contactNumber: residence.contactNumber,
        imageSrc: residence.imageSrc,
      });
    });
  }, [residences, zoom, GOOGLE_MAP_ID, dictionary, sitecoreContext]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  return <div className="hidden md:block" ref={ref} id="map" style={{ height: "100vh", width: "100%" }} />;
};
