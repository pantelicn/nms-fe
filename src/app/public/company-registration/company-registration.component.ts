import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Country } from 'src/app/shared/model';
import { CountryService } from 'src/app/shared/services/country.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { RegistrationService } from '../registration/registration.service';

@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.scss']
})
export class CompanyRegistrationComponent {

  step: 'FIRST' | 'SECOND' = 'FIRST';
  nextStepClicked = false;
  submitted = false;

  passwordMatches: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirmed = control.get('passwordConfirmed'); 
    return password && passwordConfirmed 
      && password.value === passwordConfirmed.value ? null : { passwordNotMatching : true };
  }

  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required, 
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^\$\*\.\[\]{}()?"!@#%&/\\,><':;|_~`=+-])[A-Za-z\d\^\$\*\.\[\]{}()?"!@#%&/\\,><':;|_~`=+-]{8,}$/gm)
    ]),
    passwordConfirmed: new FormControl('')
  }, {validators: this.passwordMatches});

  companyDetailsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    location: new FormGroup({
      countryCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required)
    })
  })

  constructor(
    private registrationService: RegistrationService,
    private toastService: ToastService,
    private countryService: CountryService
  ) { }

  onSubmit(): void {
    this.submitted = true;
    if (!this.companyDetailsForm.valid) {
      return;
    }

    const formData = {
      ...this.registrationForm.value,
      ...this.companyDetailsForm.value
    }

    this.registrationService.registerCompany(formData).subscribe(() => {
      this.toastService.show(
        'Successful registration!',
        'A message has been sent to your inbox. Please validate your email before logging in.'
      );
      // TODO: Redirect to login page
    });
  }

  onNextStep(): void {
    this.nextStepClicked = true;
    if (this.registrationForm.valid) {
      this.step = 'SECOND';
    }
  }

  get countries(): Country[] {
    return this.countryService.getAll();
  }

  get username() {
    return this.registrationForm.get('username');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get passwordConfirmed() {
    return this.registrationForm.get('passwordConfirmed');
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
