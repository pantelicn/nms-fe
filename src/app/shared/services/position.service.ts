import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Page } from "src/app/shared/model/page.model";
import { environment } from "src/environments/environment";


export interface PositionView {
  id: number,
  name: string,
  description: string,
  code: string
}

@Injectable({
  providedIn: 'any'
})
export class PositionService {

  private readonly positionsApi = environment.api.backend + 'positions';

  constructor(private httpClient: HttpClient) {}

  findAll(): Observable<PositionView[]> {
    return this.httpClient.get<Page<PositionView>>(this.positionsApi).pipe(map(positionsPage => positionsPage.content));
  }

}