import { Injectable } from '@angular/core';
import { Country } from '../model';
import countries from 'src/assets//locale/countries.json';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private countries: Country[];

  constructor() {
    this.countries = countries;
  }

  getAll(): Country[] {
    return this.countries;
  }

  getByCountryCode(countryCode: string): Country {
    return this.countries.filter(country => country.code === countryCode)[0];
  }
}
