import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Company, TermType } from "src/app/shared/model";
import { ProjectView } from "src/app/talent/profile/project.service";
import { environment } from "src/environments/environment";
import { PositionViewDto, SkillViewDto } from "../talents/talents.service";


export interface RequestPage {
  content: RequestView[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  numberOfElements: number,
  last: boolean,
  number: number
}

export interface Pageable {
  pageNumber: number,
  pageSize: number
}

export interface RequestView {
  id: number,
  status: string,
  note: string,
  modifiedOn: Date,
  seenByCompany: boolean,
  seenByTalent: boolean
}

export interface TalentTermRequestViewDto {
  id: number,
  counterOffer: string,
  status: string
  name: string,
  unitOfMeasure: string,
  value: string,
  termType: TermType
}

export interface RequestDetailView {
  id: number,
  status: string,
  note: string,
  modifiedOn: Date,
  company: Company;
  seenByCompany: boolean,
  seenByTalent: boolean,
  talentTermRequests: TalentTermRequestViewDto[],
  skills: SkillViewDto[],
  positions: PositionViewDto[],
  projects: ProjectView[]
}

@Injectable({
  providedIn: 'any'
})
export class RequestService {

  private readonly companiesApi = environment.api.backend + 'companies/';

  constructor(private httpClient: HttpClient, 
              private authService: AuthService) {}

  getAllActiveRequests(): Observable<RequestView[]> {
    const username = this.authService.currentUser?.username;
    return this.httpClient.get<RequestView[]>(this.companiesApi + username + "/requests/active");
  }

  get(id: number): Observable<RequestDetailView> {
    const username = this.authService.currentUser?.username;
    return this.httpClient.get<RequestDetailView>(this.companiesApi + username + "/requests/" + id);
  }

  editNote(id: number, newNote: string): Observable<RequestDetailView> {
    const username = this.authService.currentUser?.username;
    const patchBody = {
      note: newNote
    }
    return this.httpClient.patch<RequestDetailView>(this.companiesApi + username + "/requests/" + id + "/note", patchBody);
  }

  reject(id: number): Observable<void> {
    const username = this.authService.currentUser?.username;
    return this.httpClient.put<void>(this.companiesApi + username + '/requests/' + id + '/reject', {});
  }

}