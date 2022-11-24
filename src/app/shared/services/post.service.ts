import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Post } from "../model";
import { Pageable } from "../model/pageable.component";
import { PostsType } from "../model/posts-type.enum";

export interface PostsPage {
  content: Post[],
  pageable: Pageable,
  totalPages: number,
  totalElements: number,
  numberOfElements: number
}

@Injectable({
  providedIn: 'any'
})
export class PostService {

  private readonly postsApi = environment.api.backend + 'posts';

  constructor(private http: HttpClient) {}

  findGlobal(page: number): Observable<PostsPage>{
    let params = new HttpParams();
    params = params.append('page', page).append('postsType', PostsType.GLOBAL);
    return this.http.get<PostsPage>(this.postsApi, {params: params});
  }

  findByCountry(page: number, countryId: number) {
    let params = new HttpParams();
    params = params.append('page', page)
      .append('postsType', PostsType.COUNTRY).append('countryId', countryId);
    return this.http.get<PostsPage>(this.postsApi, {params: params});
  }

  findByCompany(page: number, companyId: number) {
    let params = new HttpParams();
    params = params.append('page', page)
      .append('postsType', PostsType.COMPANY).append('companyId', companyId);
    return this.http.get<PostsPage>(this.postsApi, {params: params});
  }

}