import { AvailableLocation, Position, Skill, User } from ".";

export interface Talent {

  firstName: string;
  lastName: string;
  skills: Skill[];
  positions: Position[];
  availableLocations: AvailableLocation[];
  user: User;
  likedPosts: number[];
  experienceYears: number;
  available: boolean;

}