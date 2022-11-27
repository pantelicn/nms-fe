import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FollowerService {

  private readonly followerApi = environment.api.backend + 'followers';

  constructor(private http: HttpClient) { }

  follow(companyId: number): Observable<void> {
    const body = {
      'companyId': companyId
    }
    return this.http.post<void>(this.followerApi, body);
  }

  unfollow(companyId: number): Observable<void> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        'companyId': companyId
      },
    };
    return this.http.delete<void>(this.followerApi, options);
  }

  following(): Observable<number[]> {
    return this.http.get<number[]>(this.followerApi + '/following');
  }

}