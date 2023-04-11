import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../shared/model/user.model';
import { ToastService } from '../shared/toast/toast.service';

declare const google: any;

export interface LoginSuccessResponse {
  username: string,
  token: string,
  roles: string[]
}

export interface JwtPayload {
  sub: string,
  roles: string,
  exp: number
}

export interface LoginRequest {
  username: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user?: User;
  private authenticated = false;
  private expDate?: Date;
  private readonly loginApi = environment.api.root + 'api/login';

  constructor(private router: Router, 
              private toastService: ToastService,
              private httpClient: HttpClient) {
                const jwt = localStorage.getItem("jwt");
    this.initGoogleAccounts();
    if (jwt) {
      this.initAuthenticatedUserDetails(jwt);
    }
  }

  initGoogleAccounts() {
    google.accounts.id.initialize({
      client_id: '533125345294-queakbtfu0dbros8hlhirk1o1ct427m4.apps.googleusercontent.com',
      login_uri: environment.api.backend + 'google-talents',
      ux_mode: 'redirect'
    });
  }

  get currentUser(): User | null | undefined {
    return this.user;
  }

  get isAuthenticated(): boolean {
    return this.expDate !== undefined && this.expDate !== null && this.expDate.getTime() > new Date().getTime()
  }

  login(loginRequest: LoginRequest) {
    this.httpClient.post<LoginSuccessResponse>(this.loginApi, loginRequest).subscribe(response => {
      this.setCurrentUser(response.token, response.username, response.roles);
    },
    () => {
      this.toastService.error('', 'Invalid email or password.');
    });
  }

  logout(): void {
    this.expDate = undefined;
    this.authenticated = false;
    this.user = undefined;
    this.router.navigate(['/login']);
    localStorage.removeItem('jwt');
  }

  setCurrentUser(token: string, username: string, groups: string[]): void {
    this.authenticated = true;
    if (groups?.includes('ROLE_TALENT')) {
      this.user = { username, role: 'TALENT', idToken: token };
      this.router.navigate(['/talent']);
    } else if (groups?.includes('ROLE_COMPANY')) {
      this.user = { username, role: 'COMPANY', idToken: token };
      this.router.navigate(['/company']);
    }
    this.initAuthenticatedUserDetails(token);
    localStorage.setItem("jwt", token);
  }

  private initAuthenticatedUserDetails(jwt: string) {
    const encodedPayload = jwt.split(".")[1];
      const payload: JwtPayload = JSON.parse(atob(encodedPayload));
      const roles = [];
      this.expDate = new Date(payload.exp*1000);
      roles.push(payload.roles);
      if (roles.includes('ROLE_COMPANY')) {
        this.user = { username: payload.sub, role: 'COMPANY', idToken: jwt };
      } else {
        this.user = { username: payload.sub, role: 'TALENT', idToken: jwt };
      }
  }

}
