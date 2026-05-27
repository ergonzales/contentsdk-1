import Geonames from "geonames.js";
import { GeonamesInstance } from "geonames.js/dist/geonames-types";

export class GeonamesService {
  geonamesInstance: GeonamesInstance;
  country: string;

  constructor() {
    this.geonamesInstance = Geonames({
      username: process.env.GEONAMES_USERNAME || "chartwellrr",
      token: process.env.GEONAMES_TOKEN || "chartwellrr",
      lan: "en",
      encoding: "JSON",
    });
    this.country = "CA";
  }

  async searchPostalCode(postalCode: string): Promise<any> {
    return this.geonamesInstance.postalCodeSearch({
      postalcode_startsWith: postalCode.trim().slice(0, 3),
      maxRows: 10,
      country: this.country,
    });
  }

  async searchCity(cityName: string): Promise<any> {
    return await this.geonamesInstance.search({
      q: cityName,
      maxRows: 10,
      fuzzy: 0.8,
      country: this.country,
    });
  }

  async searchPostalCodeByLatLang(lat: number, lng: number): Promise<any> {
    return await this.geonamesInstance.findNearbyPostalCodes({
      lat,
      lng,
      country: this.country,
    });
  }
}
