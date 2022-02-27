import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "src/app/shared/model";
import { environment } from "src/environments/environment";

interface AddPost {
  title: string,
  content: string
}

@Injectable({
  providedIn: 'any'
})
export class AddPostService {

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) { }

  addPost(addPost: AddPost): Observable<Post> {
    const currentUser = this.authService.currentUser;
    return this.httpClient.post<Post>(environment.api.backend + 'companies/' + currentUser?.username + '/posts', addPost);
  }

}