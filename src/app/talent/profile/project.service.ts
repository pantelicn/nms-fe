import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";

export interface ProjectCreate {
  description: string;
  technologiesUsed: string;
  myRole: string;
}

export interface ProjectView {
  id: number;
  description: string;
  technologiesUsed: string;
  myRole: string;
}

export interface EditProject {
  id: number;
  description: string;
  technologiesUsed: string;
  myRole: string;
}

@Injectable({
  providedIn: 'any'
})
export class ProjectService {

  private readonly talentsApi = environment.api.backend + 'talents/';

  constructor(private httpClient: HttpClient, 
              private authService: AuthService) {}

  create(newProject: ProjectCreate): Observable<ProjectView> {
    const username = this.authService.currentUser?.username;
    return this,this.httpClient.post<ProjectView>(this.talentsApi + username + '/projects', newProject);
  }

  edit(modified: EditProject): Observable<ProjectView> {
    const username = this.authService.currentUser?.username;
    return this,this.httpClient.put<ProjectView>(this.talentsApi + username + '/projects/', modified);
  }

  remove(id: number): Observable<void> {
    const username = this.authService.currentUser?.username;
    return this.httpClient.delete<void>(this.talentsApi + username + '/projects/' + id);
  }

}