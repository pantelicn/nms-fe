import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";

export interface SubscriptionView {
  id: number,
  startDate: Date,
  endDate: Date,
  autoRenewal: boolean,
  plan: PlanView
}

export interface PlanView {
  id: number,
  name: string,
  description: string
}

@Injectable({
  providedIn: 'any'
})
export class SubscriptionService {

  private readonly baseApi = environment.api.backend + 'subscriptions';

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  get(): Observable<SubscriptionView> {
    const username = this.authService.currentUser?.username;
    return this.http.get<SubscriptionView>(this.baseApi + '/' + username);
  }

}