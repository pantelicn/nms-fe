import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { City, Country } from "src/app/shared/model";
import { LocationService } from "src/app/shared/services/location.service";
import { ToastService } from "src/app/shared/toast/toast.service";
import { RegistrationService } from "../registration/registration.service";

@Component({
  selector: 'registration-company',
  templateUrl: './registration-company.component.html',
  styleUrls: ['./registration-company.component.scss']
})
export class RegistrationCompanyComponent implements OnInit {

  showSpinner: boolean = false;
  userAlreadyExists: boolean = false;
  registrationFinished: boolean = false;
  cities: City[] = [];
  countries: Country[] = [];
  submitted: boolean = false;

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
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^\$\*\.\[\]{}()?"!@#%&/\\,><':;|_~`=+-])[A-Za-z\d\^\$\*\.\[\]{}()?"!@#%&/\\,><':;|_~`=+-]{8,}$/)
    ]),
    passwordConfirmed: new FormControl(''),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    location: new FormGroup({
      countryId: new FormControl('', Validators.required),
      cityId: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required)
    })
  });

  constructor(private registrationService: RegistrationService,
              private toastService: ToastService,
              private locationService: LocationService) {}

  ngOnInit(): void {
    this.getCountries();
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
  
  signUp(): void {
    this.submitted = true;
    this.showSpinner = true;
    this.registrationService.registerCompany(this.registrationForm.value).subscribe({
      next: () => {
        this.showSpinner = false;
          this.onRegistrationSuccess();
        },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.userAlreadyExists = true;
        }
        this.showSpinner = false;
      }
    });
  }

  private onRegistrationSuccess() {
    this.toastService.show(
      'Successful registration!',
      'A message has been sent to your inbox. Please validate your email before logging in.'
    );
    this.registrationFinished = true;
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
    return this.registrationForm.get('name');
  }

  get description() {
    return this.registrationForm.get('description');
  }

  get countryId() {
    return this.registrationForm.get('location')?.get('countryId');
  }

  get cityId() {
    return this.registrationForm.get('location')?.get('cityId');
  }

  get address() {
    return this.registrationForm.get('location')?.get('address');
  }

}