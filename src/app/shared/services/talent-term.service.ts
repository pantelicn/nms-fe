import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";
import { TalentTerm } from "../model";

export interface TalentTermEdit {
  id: string;
  name: string;
  code: string;
  value: string;
  negotiable: boolean;
}

export interface TalentTermAdd {
  code: string;
  value: string;
  negotiable: string;
}

@Injectable({
  providedIn: 'any'
})
export class TalentTermService {

  private readonly talentsApi = environment.api.backend + 'talents';

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  edit(talentTerms: TalentTermEdit[]): Observable<TalentTerm[]> {
    return this.httpClient.put<TalentTerm[]>(this.talentsApi + '/' + this.authService.currentUser?.username + '/terms', talentTerms);
  }

  add(talentTerms: TalentTermAdd[]): Observable<TalentTerm[]> {
    return this.httpClient.post<TalentTerm[]>(this.talentsApi + '/' + this.authService.currentUser?.username + '/terms', talentTerms);
  }

  remove(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.talentsApi + '/' + this.authService.currentUser?.username + '/terms/' + id);
  }

}