export interface Message {

  id: number;
  content: string;
  companyUsername?: string;
  companyName?: string;
  talentUsername?: string;
  talentName?: string;
  createdBy: 'TALENT' | 'COMPANY';
  createdOn: string;
  seen: boolean;

}