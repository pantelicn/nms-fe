import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Position, Skill, Talent, TalentTerm } from "../shared/model";

@Injectable({
  providedIn: 'any'
})
export class TalentService {
  
  private readonly talentsApi = environment.api.backend + 'talents/';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  getTalent(): Observable<Talent> {
    return this.httpClient.get<Talent>(this.talentsApi + this.authService.currentUser?.username);
  }

  getTalentTerms(): Observable<TalentTerm[]> {
    return this.httpClient.get<TalentTerm[]>(this.talentsApi + this.authService.currentUser?.username + '/terms');
  }

  getTalentPositions(): Observable<Position[]> {
    return this.httpClient.get<Position[]>(this.talentsApi + this.authService.currentUser?.username + '/positions');
  }

  getTalentSkills(): Observable<Skill[]> {
    return this.httpClient.get<Skill[]>(this.talentsApi + this.authService.currentUser?.username + '/skills');
  }

}