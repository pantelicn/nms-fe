import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/shared/services/user.service";

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  showSpinner: boolean = false;
  validityToken?: string;
  tokenExpired: boolean = false;

  passwordMatches: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirmed = control.get('passwordConfirmed'); 
    return password && passwordConfirmed 
      && password.value === passwordConfirmed.value ? null : { passwordNotMatching : true };
  }

  resetPasswordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required, 
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^\$\*\.\[\]{}()?"!@#%&/\\,><':;|_~`=+-])[A-Za-z\d\^\$\*\.\[\]{}()?"!@#%&/\\,><':;|_~`=+-]{8,}$/)
    ]),
    passwordConfirmed: new FormControl('')
  }, {validators: this.passwordMatches});

  constructor(private route: ActivatedRoute, 
              private userService: UserService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.validityToken = params['validityToken'];
      }
    );
  }

  onSubmit() {
    if (!this.validityToken || !this.password?.value || !this.passwordConfirmed?.value) {
      return;
    }
    this.showSpinner = true;
    this.userService.resetPasswordFinish(this.validityToken, this.password.value, this.passwordConfirmed.value).subscribe({
      next: response => {
        this.showSpinner = false;
        this.router.navigate(['login']);
      },
      error: error => {
        const er = error as HttpErrorResponse;
        if (er.status === 409) {
          this.tokenExpired = true;
        }
        this.showSpinner = false;
      }
    })
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get passwordConfirmed() {
    return this.resetPasswordForm.get('passwordConfirmed');
  }


}