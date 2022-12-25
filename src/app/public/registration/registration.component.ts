import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { RegistrationService } from '..';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  registrationFinished: boolean = false;
  userAlreadyExists: boolean = false;
  showSpinner = false;

  constructor(
    private registrationService: RegistrationService,
    private toastService: ToastService,
    private router: Router
  ) { }

  step: 'FIRST' | 'TALENT' | 'COMPANY' = 'FIRST';
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
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^\$\*\.\[\]{}()?"!@#%&/\\,><':;|_~`=+-])[A-Za-z\d\^\$\*\.\[\]{}()?"!@#%&/\\,><':;|_~`=+-]{8,}$/)
    ]),
    passwordConfirmed: new FormControl('')
  }, {validators: this.passwordMatches});

  onNextStep(step: 'TALENT' | 'COMPANY'): void {
    this.nextStepClicked = true;
    if (this.registrationForm.valid) {
      this.step = step;
    }
  }

  onCompanyRegistered(companyDetails: AbstractControl): void {
    this.submitted = true;

    const formData = {
      ...this.registrationForm.value,
      ...companyDetails
    }
    this.showSpinner = true;
    this.registrationService.registerCompany(formData).subscribe({
      next: () => {
        this.showSpinner = false;
          this.onRegistrationSuccess();
        },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.userAlreadyExists = true;
          this.step = 'FIRST';
        }
        this.showSpinner = false;
      }
    });
  }

  onTalentRegistered(talentDetails: AbstractControl): void {
    this.submitted = true;

    const formData = {
      ...this.registrationForm.value,
      ...talentDetails
    }
    this.showSpinner = true;
    this.registrationService.registerTalent(formData).subscribe({
      next: () => {
        this.showSpinner = false;
          this.onRegistrationSuccess();
        },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.userAlreadyExists = true;
          this.step = 'FIRST';
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

}
