import { Field } from "@sitecore-content-sdk/nextjs";
import { City } from "./City";
import { Promotion } from "./Promotion";
import { CareService } from "./CareService";

export type ResidenceQueryList = {
  residenceList: Residence[];
  endCursor: string;
  hasNext: boolean;
};

export type Residence = {
  propertyID?: any;
  id: string;
  name: string;
  path: string;
  language?: string;
  url?: string;
  title: string;
  imageUrl: string;
  streetNameAndNumber: string;
  startingPrice?: number | null | undefined;
  phone: string;
  city: City;
  province: string;
  provAbbr?: string;
  postalCode: string;
  promotions: Promotion;
  propertyCareServices: string;
  buttonText: string;
  careServiceListTitle: string;
  bookATourLink: any;
  cardButtonText: Field<string>;
  availableCareServices: CareService[];
  latitude: string;
  longitude: string;
  bilingual: string;
  isPriorityProperty?: boolean;
  careServicesAvailable: string;
  careServicesAvailableText: Field<string>;
};

export type ResidenceListModel = {
  residence: Residence;
  propertyId: string;
  language: string;
  bilingual: boolean;
  residenceId: string;
  residenceName: string;
  cityId: string;
  cityName: string;
  cityNameDisplay: string;
  cityLandingPageHref?: any;
  provinceId: string;
  provinceName: string;
  residenceAddress?: string;
  cityLandingPageItem: any;
  Lat: string;
  Lng: string;
  cityLat: string;
  cityLng: string;
  url: string;
  livingOption: string[];
  livingOptions: any;
  assignedPromos?: string;
  isPriorityProperty?: boolean;
  careServiceAvailable: boolean;
  careServiceAvailableText: string;
  bookATourLink: string;
  imageSrc: string;
  residenceImage: any;
  contactNumber: string;
  propertySuitPlans: any[];
  subCityName?: string;
  subCityId?: string;
  subCityNameDisplay?: string;
  subCityLandingPageHref?: any;
};

export type CareServices = {
  [x: string]: string | boolean | any;
  // id: string;
  // language: string;
  // selected?: boolean;
  // disabled?: boolean;
  // name: string;
  // itemName: string;
};
