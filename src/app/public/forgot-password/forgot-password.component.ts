import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  submitted = false;
  showSpinner: boolean = false;
  mailSent: boolean = false;

  emailForm = new FormGroup({
    username: new FormControl('', [Validators.required])
  });

  constructor(private userService: UserService) {}

  onSubmit() {
    this.showSpinner = true;
    this.userService.resetPasswordBegin(this.username?.value).subscribe({
      next: response => {
        this.showSpinner = false;
        this.mailSent = true;
      },
      error: error => {
        this.showSpinner = false;
      }
    })
  }

  get username() {
    return this.emailForm.get('username');
  }

}