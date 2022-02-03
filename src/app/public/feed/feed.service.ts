import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'src/app/shared/model/post.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class FeedService {

  private readonly publicPostApi = environment.api.backend + 'public/posts';

  constructor(private http: HttpClient) { }

  getLatest10ByCountry(country: string): Observable<Post[]> {
    return this.http.get<Post[]>(this.publicPostApi, { params: { country } });
  }

}
