import { Company } from "./company.model";

export interface Post {

  id: number;
  title: string;
  content: string;
  url: string;
  likes: number;
  company: Company;
  createdOn: Date;

}
