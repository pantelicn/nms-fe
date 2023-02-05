import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";

export interface ProductUsageView {
  id: number,
  remaining: number,
  limited: boolean,
  startDate: Date,
  endDate: Date, 
  period: any,
  product: ProductView,
  total: number
}

export interface ProductView {
  id: number,
  name: string,
  description: string
}

@Injectable({
  providedIn: 'any'
})
export class ProductUsageService {

  private readonly baseApi = environment.api.backend + 'product-usages';

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  getForCompany(): Observable<ProductUsageView[]> {
    const username = this.authService.currentUser?.username;
    return this.http.get<ProductUsageView[]>(this.baseApi + '/company/' + username);
  }

  getRemainingPosts(): Observable<number> {
    const username = this.authService.currentUser?.username;
    return this.http.get<number>(this.baseApi + '/company/' + username + '/remaining-posts');
  }

}