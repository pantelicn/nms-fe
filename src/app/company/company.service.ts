import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from '../shared/model';

@Injectable({
  providedIn: 'any'
})
export class CompanyService {

  private readonly companiesApi = environment.api.backend + 'companies';

  constructor(private http: HttpClient) { }

  getCompany(username: String): Observable<Company> {
    return this.http.get<Company>(this.companiesApi + '/' +username);
  }

}