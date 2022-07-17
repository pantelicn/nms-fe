import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Company } from '../shared/model';

@Injectable({
  providedIn: 'any'
})
export class CompanyService {

  private readonly companiesApi = environment.api.backend + 'companies';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCompany(username: String): Observable<Company> {
    return this.http.get<Company>(this.companiesApi + '/' + username);
  }

  edit(modified: Company): Observable<Company> {
    const username = this.authService.currentUser?.username;
    return this.http.put<Company>(this.companiesApi + '/' + username, modified);
  }

}