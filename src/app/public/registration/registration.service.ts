import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company, Talent } from 'src/app/shared/model';
import { CountryService } from 'src/app/shared/services/country.service';
import { environment } from 'src/environments/environment';

interface Location {
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
  location: Location

}

interface TalentRegistration {
  
  username: string,
  password: string,
  passwordConfirmed: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  location: Location

}

@Injectable({
  providedIn: 'any'
})
export class RegistrationService {

  private readonly companiesApi = environment.api.backend + 'companies';
  private readonly talentsApi = environment.api.backend + 'talents';

  constructor(private httpClient: HttpClient, private countryService: CountryService) { }

  registerCompany(formData: CompanyRegistration): Observable<Company> {
    formData.location.country = this.countryService.getByCountryCode(formData.location.countryCode).name;
    return this.httpClient.post<Company>(this.companiesApi, formData);
  }

  registerTalent(formData: TalentRegistration): Observable<Talent> {
    formData.location.country = this.countryService.getByCountryCode(formData.location.countryCode).name;
    return this.httpClient.post<Talent>(this.talentsApi, formData);
  }

}
