import { User } from ".";
import { Location } from "./location.model";

export interface Talent {

  firstName: string;
  lastName: string;
  skills: string[];
  positions: string[];
  location: Location;
  availableLocations: Location[];
  user: User;

}