import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Company } from '../shared/model';

export interface ProfileImage {
  path: string;
}

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

  uploadProfileImage(profileImage: File): Observable<ProfileImage> {
    const username = this.authService.currentUser?.username;
    const formData: FormData = new FormData();

    formData.append('image', profileImage);

    return this.http.put<ProfileImage>(this.companiesApi + '/' + username + '/profile-image', formData);
  }

}