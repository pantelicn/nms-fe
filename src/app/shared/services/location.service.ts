import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { City, Country } from "../model";

@Injectable({
  providedIn: 'any'
})
export class LocationService {

  private readonly countriesApi = environment.api.backend + 'countries';
  
  constructor(private http: HttpClient) {
  }

  public getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countriesApi);
  }

  public getCities(countryId: number): Observable<City[]> {
    return this.http.get<City[]>(this.countriesApi + '/' + countryId + '/cities');
  }

}