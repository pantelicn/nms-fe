import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


export interface SkillView {
  id: number,
  name: string,
  status: string,
  code: string;
}

@Injectable({
  providedIn: 'any'
})
export class SkillService {

  private readonly skillsApi = environment.api.backend + 'skills';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<SkillView[]> {
    return this.httpClient.get<SkillView[]>(this.skillsApi); 
  }

}