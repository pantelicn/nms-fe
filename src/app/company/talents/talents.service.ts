import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Talent } from "src/app/shared/model";
import { ProjectView } from "src/app/talent/profile/project.service";
import { environment } from "src/environments/environment";
import { Pageable, RequestView } from "../request/request.service";

export interface SearchPageResponse {
  content: TalentViewSearchDto[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  numberOfElements: number,
  last: boolean,
  number: number
}

export interface TalentViewSearchDto {
  talentId: string,
  terms: TalentTermViewDto[],
  skills: SkillViewDto[],
  positions: PositionViewDto[],
  previousRequest: RequestView,
  requestSent: boolean,
  experienceYears: number,
  projects: ProjectView[]
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

export interface TalentBasicInfoDto {
  firstName: string;
  lastName: string;
}

export interface AvailableLocationSearch {
  country: string;
  cities: string[];
  id?: number;
}

export interface AvailableLocationView {
  id: number,
  country: string,
  cities: string[],
  countryId: number
}

@Injectable({
  providedIn: 'any'
})
export class TalentService {

  private readonly talentsApi = environment.api.backend + 'talents/';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  find(facetSpecifiers: FacetSpecifierDto[], experienceYears: number, locations: AvailableLocationSearch[], page: number): Observable<SearchPageResponse> {
    let params = new HttpParams();
    params = params.append('page', page);
    facetSpecifiers.forEach(facetSpecifier => {
      if (facetSpecifier.type !== 'TERM' || facetSpecifier.codeType === 'BOOLEAN') {
        facetSpecifier.value = facetSpecifier.code;
        facetSpecifier.operatorType = 'EQ'
      }
    });
    const data = {
      facets: facetSpecifiers,
      experienceYears,
      locations
    };
    return this.httpClient.post<SearchPageResponse>(this.talentsApi + "find", data, {params: params});
  }

  addAvailableLocation(country: string, countryId: number): Observable<AvailableLocationView> {
    const data = {
      country: country,
      countryId: countryId
    };
    return this.httpClient.post<AvailableLocationView>(
      this.talentsApi + this.authService.currentUser?.username + '/available-locations',
      data
    );
  }

  removeAvailableLocation(id: number): Observable<Talent> {
    return this.httpClient.delete<Talent>(
      this.talentsApi + this.authService.currentUser?.username + '/available-locations/' + id
    );
  }

  updateBasicInfo(basicInfo: TalentBasicInfoDto): Observable<Talent> {
    return this.httpClient.put<Talent>(this.talentsApi + this.authService.currentUser?.username, basicInfo);
  }

  removeAvailableCity(cityName: string, availableLocationId: number): Observable<void> {
    return this.httpClient.delete<void>(
      this.talentsApi + this.authService.currentUser?.username + '/available-locations/' + availableLocationId + '/cities/' + cityName
    );
  }

  addAvailableCity(cityName: string, availableLocationId: number): Observable<void> {
    const data = {
      city: cityName
    };
    return this.httpClient.patch<void>(
      this.talentsApi + this.authService.currentUser?.username + '/available-locations/' + availableLocationId,
      data
    );
  }

}