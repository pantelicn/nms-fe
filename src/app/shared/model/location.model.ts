import { City } from "./city.model";
import { Country } from "./country.model";

export interface Location {

  id: number;
  country: Country;
  city: City;
  province: string;
  countryCode: string;
  address: string;

}