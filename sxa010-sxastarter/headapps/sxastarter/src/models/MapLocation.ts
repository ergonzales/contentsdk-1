import { City } from "./City";
import { Province } from "./Province";

export type MapLocation = {
  id: string;
  name: string;
  latitude: number | string;
  longitude: number | string;
  path?: string;
  url?: string;
  streetNameAndNumber?: string;
  city?: City;
  province?: Province;
  title?: string;
};

export type MapOrigin = {
  latitude: number;
  longitude: number;
  city?: string;
  province?: string;
};
