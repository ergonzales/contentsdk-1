import { Field, Item } from "@sitecore-content-sdk/nextjs";

/**
 * Interface representing the fields for a City item in Sitecore
 */
export interface CityFields {
  "City Name": Field<string>;
}
/**
 * Interface representing the fields for a Province item in Sitecore
 */
export interface ProvinceFields {
  "Province Name": Field<string>;
  fullName: Field<string>;
}
/**
 * Interface representing the property address fields from Sitecore
 */
export interface PropertyFields {
  StreetNameAndNumber?: Field<string>;
  City?: Item[];
  Province?: Item[];
  "Postal code"?: Field<string>;
  fullName: Field<string>;
}
