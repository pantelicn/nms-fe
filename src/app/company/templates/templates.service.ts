import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { AvailableLocation } from "src/app/shared/model";
import { environment } from "src/environments/environment";


export interface AddTemplate {
  name: string,
  facets: Facet[],
  experienceYears: number,
  availableLocations: AvailableLocation[]
}

export interface Facet {
  id?: number,
  type: string,
  code: string,
  value: string,
  operatorType: string,
  codeType?: string
}

export interface EditTemplate {
  id: number,
  name: string,
  facets: Facet[],
  experienceYears: number,
  availableLocations: AvailableLocation[]
}

export interface TemplateView {
  id: number,
  name: string,
  facets: FacetView[]
  experienceYears: number,
  availableLocations: AvailableLocation[]
}

export interface FacetView {
  id: number,
  type: string,
  code: string,
  value: string,
  operatorType: string
}

@Injectable({
  providedIn: 'any'
})
export class TemplateService {

  constructor(private httpClient: HttpClient,
              private authService: AuthService) {}


  addTemplate(newTemplate: AddTemplate): Observable<TemplateView> {
    newTemplate.facets.forEach(facet => {
      if (facet.type === 'POSITION' || facet.type === 'SKILL' || facet.codeType === 'BOOLEAN') {
        facet.operatorType = 'EQ';
        facet.value = 'true';
      }
    });
    const currentUser = this.authService.currentUser;
    return this.httpClient.post<TemplateView>(environment.api.backend + 'companies/' + currentUser?.username + '/search-templates', newTemplate);
  }

  editTemplate(modified: EditTemplate): Observable<TemplateView> {
    modified.facets.forEach(facet => {
      if (facet.type === 'POSITION' || facet.type === 'SKILL' || facet.codeType === 'BOOLEAN') {
        facet.operatorType = 'EQ';
        facet.value = 'true';
      }
    });
    const currentUser = this.authService.currentUser;
    return this.httpClient.put<TemplateView>(environment.api.backend + 'companies/' + currentUser?.username + '/search-templates', modified);
  }

  findAll(): Observable<TemplateView[]> {
    const currentUser = this.authService.currentUser;
    return this.httpClient.get<TemplateView[]>(environment.api.backend + 'companies/' + currentUser?.username + '/search-templates');
  }

  removeTemplate(id: number): Observable<{}> {
    const currentUser = this.authService.currentUser;
    return this.httpClient.delete<{}>(environment.api.backend + 'companies/' + currentUser?.username + '/search-templates/' + id);
  }

}