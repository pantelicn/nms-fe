import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { City, Country } from 'src/app/shared/model';
import { LocationService } from 'src/app/shared/services/location.service';

@Component({
  selector: 'nms-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.scss']
})
export class CompanyRegistrationComponent implements OnInit {

  submitted = false;
  cities: City[] = [];
  countries: Country[] = [];

  @Output() registered = new EventEmitter<AbstractControl>();

  companyDetailsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    location: new FormGroup({
      countryId: new FormControl('', Validators.required),
      cityId: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required)
    })
  });

  constructor(private locationService: LocationService) { }
  
  ngOnInit(): void {
    this.getCountries();
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.companyDetailsForm.valid) {
      return;
    }
    console.log(this.companyDetailsForm.value);
    this.registered.emit(this.companyDetailsForm.value);
  }

  citiesForCountryId() {
    if (!this.countryId?.value) {
      return;
    }
    this.locationService.getCities(this.countryId.value).subscribe({next : response => {
      this.cities = response;
    },
    error : errro => {

    }});
  }

  getCountries() {
    this.locationService.getCountries().subscribe({
      next: response => {
        this.countries = response;
      },
      error: error => {

      }
    })
  }

  get name() {
    return this.companyDetailsForm.get('name');
  }

  get description() {
    return this.companyDetailsForm.get('description');
  }

  get countryId() {
    return this.companyDetailsForm.get('location')?.get('countryId');
  }

  get cityId() {
    return this.companyDetailsForm.get('location')?.get('cityId');
  }

  get address() {
    return this.companyDetailsForm.get('location')?.get('address');
  }
}
