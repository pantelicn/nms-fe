import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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
    return this.httpClient.get<PositionView[]>(this.positionsApi);
  }

}