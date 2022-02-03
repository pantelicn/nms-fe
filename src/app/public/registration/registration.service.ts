import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Company } from 'src/app/shared/model';
import { CountryService } from 'src/app/shared/services/country.service';
import { environment } from 'src/environments/environment';

interface CompanyLocation {
  countryCode: string;
  country: string;
  city: string;
  address: string;
}

interface CompanyRegistration {

  username: string,
  password: string,
  passwordConfirmed: string,
  name: string,
  description: string,
  location: CompanyLocation

}

@Injectable({
  providedIn: 'any'
})
export class RegistrationService {

  private readonly companiesApi = environment.api.backend + 'companies';

  constructor(private httpClient: HttpClient, private countryService: CountryService) { }

  registerCompany(formData: CompanyRegistration): Observable<Company> {
    formData.location.country = this.countryService.getByCountryCode(formData.location.countryCode).name;
    return this.httpClient.post<Company>(this.companiesApi, formData);
  }

}
