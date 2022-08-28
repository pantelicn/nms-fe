import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { TalentRequestDetailView } from "src/app/talent/request/request.service";
import { environment } from "src/environments/environment";
import { RequestDetailView } from "../../company/request/request.service";

export interface RequestResponseDto {
  requestId: number,
  modifiedOn: Date,
  newTermRequest: TalentTermRequestEditDto
}

export interface TalentTermRequestEditDto {
  id: number,
  counterOffer?: string,
  status: string
}

@Injectable({
  providedIn: 'any'
})
export class TalentTermRequestService {

  private readonly companiesApi = environment.api.backend + 'companies/';

  private readonly talentsApi = environment.api.backend + 'talents/';

  constructor(private httpClient: HttpClient, 
              private authService: AuthService) {}

  editByCompany(editRequest: RequestResponseDto): Observable<RequestDetailView> {
    const username = this.authService.currentUser?.username;
    return this.httpClient.put<RequestDetailView>(this.companiesApi + username + "/talent-term-requests", editRequest);
  }

  editByTalent(editRequest: RequestResponseDto): Observable<TalentRequestDetailView> {
    const username = this.authService.currentUser?.username;
    return this.httpClient.put<TalentRequestDetailView>(this.talentsApi + username + "/talent-term-requests", editRequest);
  }
  
}