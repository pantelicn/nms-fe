import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Term } from "src/app/shared/model";
import { environment } from "src/environments/environment";

export interface TermView {
  code: string,
  name: string,
  type: string
}

@Injectable({
  providedIn: 'any'
})
export class TermService {

  private readonly termsApi = environment.api.backend + 'terms';

  constructor(private httpClient: HttpClient) { }

  findAvailableForSearch(): Observable<Term[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("availableForSearch", true);
    return this.httpClient.get<Term[]>(this.termsApi, {params: queryParams}); 
  }

}