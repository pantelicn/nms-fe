import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Country } from 'src/app/shared/model';
import { CountryService } from 'src/app/shared/services/country.service';

@Component({
  selector: 'nms-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.scss']
})
export class CompanyRegistrationComponent {

  submitted = false;

  @Output() registered = new EventEmitter<AbstractControl>();

  companyDetailsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    location: new FormGroup({
      countryCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required)
    })
  });

  constructor(private countryService: CountryService) { }

  onSubmit(): void {
    this.submitted = true;
    if (!this.companyDetailsForm.valid) {
      return;
    }

    this.registered.emit(this.companyDetailsForm.value);
  }

  get countries(): Country[] {
    return this.countryService.getAll();
  }

  get name() {
    return this.companyDetailsForm.get('name');
  }

  get description() {
    return this.companyDetailsForm.get('description');
  }

  get countryCode() {
    return this.companyDetailsForm.get('location')?.get('countryCode');
  }

  get city() {
    return this.companyDetailsForm.get('location')?.get('city');
  }

  get address() {
    return this.companyDetailsForm.get('location')?.get('address');
  }
}
