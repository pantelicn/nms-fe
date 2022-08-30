import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Pageable } from "../request/request.service";

export interface SearchPageResponse {
  content: TalentViewSearchDto[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  numberOfElements: number
}

export interface TalentViewSearchDto {
  talentId: string,
  terms: TalentTermViewDto[],
  skills: SkillViewDto[]
  positions: PositionViewDto[]
}

export interface PositionViewDto {
  id: number,
  name: string,
  description: string,
  code: string
}

export interface SkillViewDto {
  id: number,
  name: string,
  status: string,
  code: string
}

export interface TalentTermViewDto {
  id: number,
  value: string,
  negotiable: boolean,
  unitOfMeasure: string,
  term: TermViewDto
}

export interface TermViewDto {
  name: string,
  code: string,
  description: string,
  type: string
}

export interface FacetSpecifierDto {
  type: string,
  code: string,
  value: string,
  operatorType: string,
  codeType?: string
}

@Injectable({
  providedIn: 'any'
})
export class TalentService {

  private readonly talentFindApi = environment.api.backend + 'talents/';

  constructor(private httpClient: HttpClient) {}

  find(facetSpecifiers: FacetSpecifierDto[]) {
    facetSpecifiers.forEach(facetSpecifier => {
      if (facetSpecifier.type !== 'TERM' || facetSpecifier.codeType === 'BOOLEAN') {
        facetSpecifier.value = facetSpecifier.code;
        facetSpecifier.operatorType = 'EQ'
      }
    });
    const data = {
      facets: facetSpecifiers
    };
    return this.httpClient.post<SearchPageResponse>(this.talentFindApi + "find", data);
  }

}