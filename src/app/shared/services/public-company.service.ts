import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Location } from "../model";
import { ContactView } from "../model/contact.model";
import { Pageable } from "../model/pageable.component";

export interface CompaniesPage {
  content: PublicCompanyView[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  numberOfElements: number,
  last: boolean,
  number: number
}

export interface PublicCompanyView {
  id: number,
  name: string,
  description: string,
  profileImage: string,
  location: Location,
  contacts: ContactView[]
}

@Injectable({
  providedIn: 'any'
})
export class PublicCompanyService {

  private readonly baseApi = environment.api.backend + 'public/companies';

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<PublicCompanyView> {
    return this.http.get<PublicCompanyView>(this.baseApi + '/' + id);
  }

  findByNameStartsWith(nameStartsWith: string, page: number): Observable<PublicCompanyView[]> {
    let params = new HttpParams();
    params = params.append('page', page)
      .append('nameStartsWith', nameStartsWith);
    return this.http.get<CompaniesPage>(this.baseApi, {params: params}).pipe(map(response => {
      return response.content;
    }));
  }

}