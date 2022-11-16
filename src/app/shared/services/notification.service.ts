import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface NotificationResponse {
  unseenRequests: number,
  lastRequestId?: number,
  unseenMessages: number,
  lastMessageId?: number,
  unseenInfoNotifications: number,
  lastInfoNotificationId?: number
}

export interface NotificationPage {
  content: NotificationView[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  numberOfElements: number
}

export interface NotificationInfosPage {
  content: NotificationInfoView[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  numberOfElements: number
}

export interface NotificationInfoView {
  message: string,
  createdOn: Date,
  type: NotificationInfoType
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

export enum NotificationInfoType {
  REQUEST = 'REQUEST'
}

export enum NotificationType {
  REQUEST = 'REQUEST',
  MESSAGE = 'MESSAGE',
  INFO = 'INFO'
}

@Injectable({
  providedIn: 'any'
})
export class NotificationService {

  private readonly notificationApi = environment.api.backend + 'notifications';

  constructor(private http: HttpClient) { }

  findAll(page: number):Observable<NotificationResponse> {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get<NotificationResponse>(this.notificationApi, {params: params});
  }

  setNotificationToSeen(lastVisibleRequestId: number, type: NotificationType):Observable<void> {
    let params = new HttpParams();
    params = params.append('lastVisibleRequestId', lastVisibleRequestId).append('type', type);
    return this.http.put<void>(this.notificationApi + '/seen', null, {params: params});
  }

  findAllInfos(page: number): Observable<NotificationInfosPage> {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get<NotificationInfosPage>(this.notificationApi + '/infos', { params: params });
  }

}