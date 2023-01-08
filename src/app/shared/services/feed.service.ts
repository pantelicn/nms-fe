import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Talent, Post } from '../model';

@Injectable({
  providedIn: 'any'
})
export class FeedService {

  private readonly publicPostsApi = environment.api.backend + 'public/posts';
  private readonly publicTalentsApi = environment.api.backend + 'public/talents';

  constructor(private http: HttpClient) { }

  getLatest10ByCountry(country: string): Observable<Post[]> {
    return this.http.get<Post[]>(this.publicPostsApi, { params: { country } });
  }

  getLatest10Talents(): Observable<Talent[]> {
    return this.http.get<Talent[]>(this.publicTalentsApi);
  }

}
