import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";

export interface BenefitView {
  id: number;
  name: string;
  description: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BenefitService {

  private readonly companiesApi = environment.api.backend + 'companies';

  constructor(private http: HttpClient, 
              private authService: AuthService) {}

  getAll(): Observable<BenefitView[]> {
    const username = this.authService.currentUser?.username;
    return this.http.get<BenefitView[]>(this.companiesApi + '/' + username + '/benefits');
  }

}