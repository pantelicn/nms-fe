import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostReaction, ReactionType } from '../model';

export enum PostReactionType {
  LIKE = 'LIKE',
  AWARD = 'AWARD'
}

@Injectable({
  providedIn: 'any'
})
export class ReactionService {

  private readonly postApi = environment.api.backend + 'posts';

  constructor(private http: HttpClient) { }

  react(postId: number, type: PostReactionType): Observable<PostReaction> {
    const url = this.postApi + '/' + postId + '/reactions';
    return this.http.put<PostReaction>(url, { reaction: type });
  }

  undoReact(postId: number, type: PostReactionType): Observable<void> {
    const url = this.postApi + '/' + postId + '/reactions';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        'reaction': type
      },
    };
    return this.http.delete<void>(url, options);
  }

}