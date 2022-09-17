import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface NotificationResponse {
  unseenRequests: number,
  lastRequestId?: number
}

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

  findAllUnseen(page: number):Observable<NotificationResponse> {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get<NotificationResponse>(this.notificationApi, {params: params});
  }

  setRequestsToSeen(lastVisibleRequestId: number):Observable<void> {
    let params = new HttpParams();
    params = params.append('lastVisibleRequestId', lastVisibleRequestId);
    return this.http.put<void>(this.notificationApi + '/requests/seen', null, {params: params});
  }

}