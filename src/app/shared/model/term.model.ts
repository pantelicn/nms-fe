import { TermType } from ".";

export interface Term {

  name: string;
  code: string;
  description: string;
  type: TermType;
  availableForSearch: boolean;
  
}