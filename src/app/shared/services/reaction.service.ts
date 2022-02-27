import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostReaction, ReactionType } from '../model';

@Injectable({
  providedIn: 'any'
})
export class ReactionService {

  private readonly postApi = environment.api.backend + 'posts';

  constructor(private http: HttpClient) { }

  like(postId: number): Observable<PostReaction> {
    const url = this.postApi + '/' + postId + '/reactions';
    return this.http.put<PostReaction>(url, { reaction: ReactionType.Like });
  }

}