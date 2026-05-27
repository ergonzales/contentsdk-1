export type City = {
  id: string;
  name: string;
  latitude: string | number;
  longitude: string | number;
};

export type CityQueryResult = {
  cityList: City[];
  endCursor: string;
  hasNext: boolean;
};
