import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface NotificationPage {
  content: NotificationView[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  numberOfElements: number
}

export interface Pageable {
  pageNumber: number,
  pageSize: number
}

export interface NotificationView {
  id: number,
  description: string,
  sean: string,
  type: string,
  referenceId: number
}

@Injectable({
  providedIn: 'any'
})
export class NotificationService {

  private readonly notificationApi = environment.api.backend + 'notifications';

  constructor(private http: HttpClient) { }

  findAll(page: number):Observable<NotificationPage> {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get<NotificationPage>(this.notificationApi, {params: params});
  }

}