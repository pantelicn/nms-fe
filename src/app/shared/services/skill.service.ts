import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Skill } from "src/app/shared/model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'any'
})
export class SkillService {

  private readonly skillsApi = environment.api.backend + 'skills';
  private readonly talentsApi = environment.api.backend + 'talents';

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  findAll(): Observable<Skill[]> {
    return this.httpClient.get<Skill[]>(this.skillsApi); 
  }

  add(code: string): Observable<Skill> {
    return this.httpClient.post<Skill[]>(this.talentsApi + '/' + this.authService.currentUser?.username + '/skills', [code])
      .pipe(map(skills => skills[0]));
  }

  remove(code: string): Observable<void> {
    return this.httpClient.delete<void>(this.talentsApi + '/' + this.authService.currentUser?.username + '/skills/' + code);
  }

}