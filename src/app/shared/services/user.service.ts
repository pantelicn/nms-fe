import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'any'
})
export class UserService {

  private readonly usersApi = environment.api.backend + 'users';

  constructor(private httpClient: HttpClient) { }

  resetPasswordBegin(email: string): Observable<void> {
    let params = new HttpParams();
    params = params.append('email', email);
    return this.httpClient.get<void>(this.usersApi + "/reset-password/begin", {params: params});
  }

  resetPasswordFinish(validityToken: string, newPassword: string, newPasswordConfirmation: string): Observable<void> {
    const requestBody = {
      newPassword: newPassword,
      newPasswordConfirmation: newPasswordConfirmation,
      validityToken: validityToken
    }
    return this.httpClient.put<void>(this.usersApi + "/reset-password/finish", requestBody);
  }

}