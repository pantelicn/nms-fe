import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastService } from "src/app/shared/toast/toast.service";
import { RegistrationService } from "../registration/registration.service";
declare const google: any;

@Component({
  selector: 'registration-talent',
  templateUrl: './registration-talent.component.html',
  styleUrls: ['./registration-talent.component.scss']
})
export class RegistrationTalentComponent implements AfterViewInit {
  
  showSpinner: boolean = false;
  userAlreadyExists: boolean = false;
  registrationFinished: boolean = false;

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
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required)
  }, {validators: this.passwordMatches});
  
  constructor(private registrationService: RegistrationService,
              private toastService: ToastService) {

  }
  ngAfterViewInit(): void {
    this.addGoogleBtn();
  }

  signUp() {
    this.showSpinner = true;
    this.registrationService.registerTalent(this.registrationForm.value).subscribe({
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

  private addGoogleBtn() {
    console.log(document.getElementById("google_btn"));
    google.accounts.id.renderButton(
      document.getElementById("google_btn"),
      { shape: "pill", size: "large", text: "continue_with", width: "350" } 
    );
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

  get firstName() {
    return this.registrationForm.get('firstName');
  }

  get lastName() {
    return this.registrationForm.get('lastName');
  }

}