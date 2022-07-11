import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";
import { RequestDetailView } from "../../request/request.service";


export interface RequestCreate {
  talentId?: string,
  note: string,
  terms: TermCreate[]
}

export interface TermCreate {
  termId: number,
  status: string,
  counterOffer?: string
}

@Injectable({
  providedIn: 'any'
})
export class SendRequestService {

  private readonly companyApi = environment.api.backend + 'companies/';

  constructor(private httpClient: HttpClient,
              private authService: AuthService) {}

  sendRequest(request:RequestCreate) {
    const currentUser = this.authService.currentUser;
    return this.httpClient.post<RequestDetailView>(this.companyApi + currentUser?.username + '/requests', request);
  }

}