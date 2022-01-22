import { Company } from "./company.model";

export interface Post {

  id: number;
  description: string;
  url: string;
  likes: number;
  company: Company;
  createdOn: Date;

}
