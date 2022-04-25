import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";
import { RequestDetailView, RequestView } from "./request.service";

export interface RequestResponseDto {
  requestId: number,
  modifiedOn: Date,
  newTermRequest: TalentTermRequestEditDto
}

export interface TalentTermRequestEditDto {
  id: number,
  counterOffer: string,
  status: string
}

@Injectable({
  providedIn: 'any'
})
export class TalentTermRequestService {

  private readonly companiesApi = environment.api.backend + 'companies/';

  constructor(private httpClient: HttpClient, 
              private authService: AuthService) {}

  editByCompany(editRequest: RequestResponseDto): Observable<RequestDetailView> {
    const username = this.authService.currentUser?.username;
    return this.httpClient.put<RequestDetailView>(this.companiesApi + username + "/talent-term-requests", editRequest);
  }
}