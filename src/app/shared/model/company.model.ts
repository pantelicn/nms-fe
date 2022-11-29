import { Location, User } from ".";

export interface Company {

  id: number;
  name: string;
  description: string;
  user: User;
  location: Location;
  profileImage: string;
  likedPosts: number[];
  
}
