import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { BenefitView } from "src/app/shared/services/benefits.service";
import { environment } from "src/environments/environment";

export interface RequestPage {
  content: RequestView[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  numberOfElements: number
}

export interface Pageable {
  pageNumber: number,
  pageSize: number
}

export interface RequestView {
  id: number,
  status: string,
  company: string,
  modifiedOn: Date,
  seenByTalent: boolean
}

export interface TalentTermRequestViewDto {
  id: number,
  counterOffer: string,
  status: string
  name: string,
  unitOfMeasure: string,
  value: string
}

export interface TalentRequestDetailView {
  id: number,
  status: string,
  company: string,
  modifiedOn: Date,
  seenByTalent: boolean,
  talentTermRequests: TalentTermRequestViewDto[],
  benefits: BenefitView[]
}

@Injectable({
  providedIn: 'any'
})
export class RequestService {

  private readonly talentsApi = environment.api.backend + 'talents/';

  constructor(private httpClient: HttpClient, 
              private authService: AuthService) {}

  getAllActiveRequests(): Observable<RequestPage> {
    const username = this.authService.currentUser?.username;
    return this.httpClient.get<RequestPage>(this.talentsApi + username + "/requests/active");
  }

  get(id: number): Observable<TalentRequestDetailView> {
    const username = this.authService.currentUser?.username;
    return this.httpClient.get<TalentRequestDetailView>(this.talentsApi + username + "/requests/" + id);
  }

}