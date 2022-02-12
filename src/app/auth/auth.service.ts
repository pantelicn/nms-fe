import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  IAuthenticationDetailsData
} from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import { User } from '../shared/model/user.model';
import { ToastService } from '../shared/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user!: User;
  private authenticated = false;
  private readonly userPool: CognitoUserPool;

  constructor(private router: Router, private toastService: ToastService) {
    this.userPool = new CognitoUserPool({
        UserPoolId: environment.cognito.userPoolId,
        ClientId: environment.cognito.appClientId
    });
    this.initUser();
  }

  private initUser(): void {
    const cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((_: null, session: CognitoUserSession) => this.setCurrentUser(session));
    }
  }

  get currentUser(): User | null {
    return this.user;
  }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  login(formData: IAuthenticationDetailsData) {
    const authenticationDetails = new AuthenticationDetails(formData);
    const cognitoUser = new CognitoUser({
      Username: formData.Username,
      Pool: this.userPool
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session: CognitoUserSession) => this.setCurrentUser(session),
      onFailure: (error: Error) => this.toastService.error('Error logging in.', error.message)
    });
  }

  logout(): void {
    this.userPool.getCurrentUser()?.signOut(() => {
      this.authenticated = false;
      this.router.navigate(['/login']);
    });
  }

  private setCurrentUser(session: CognitoUserSession): void {
    if (session.isValid()) {
      this.authenticated = true;
      const idToken = session.getIdToken().getJwtToken();
      const username = session.getIdToken().decodePayload()['email'];
      const groups: string[] = session.getIdToken().decodePayload()['cognito:groups'];
      if (groups?.includes('TALENT')) {
        this.user = { username, idToken, role: 'TALENT' };
        this.router.navigate(['/talent']);
      } else if (groups?.includes('COMPANY')) {
        this.user = { username, idToken, role: 'COMPANY' };
        this.router.navigate(['/company']);
      }
    } else {
      this.authenticated = false;
    }
  }

}
