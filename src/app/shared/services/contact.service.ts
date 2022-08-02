import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface ContactView {
  id: number,
  type: string,
  value: string
}

export interface ContactAdd {
  type: string,
  value: string
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private readonly contactsApi = environment.api.backend + 'contacts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ContactView[]>{
    return this.http.get<ContactView[]>(this.contactsApi);
  }

  edit(modified: ContactView[]): Observable<ContactView[]> {
    return this.http.put<ContactView[]>(this.contactsApi, modified);
  }

  add(newContacts: ContactAdd[]): Observable<ContactView[]> {
    return this.http.post<ContactView[]>(this.contactsApi, newContacts);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(this.contactsApi + '/' + id);
  }

}