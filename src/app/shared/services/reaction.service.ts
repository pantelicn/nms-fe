import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostReaction, ReactionType } from '../model';

export enum PostReactionType {
  LIKE = 'LIKE'
}

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

  unlike(postId: number): Observable<void> {
    const url = this.postApi + '/' + postId + '/reactions';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        'reaction': PostReactionType.LIKE
      },
    };
    return this.http.delete<void>(url, options);
  }

}