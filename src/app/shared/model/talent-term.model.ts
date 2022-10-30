import { Term, UnitOfMeasure } from ".";

export interface TalentTerm {

    id: number;
    value: string;
    negotiable: boolean;
    unitOfMeasure: UnitOfMeasure;
    term: Term;
    
}