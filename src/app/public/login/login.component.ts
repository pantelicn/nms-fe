import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitted = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    google.accounts.id.renderButton(
            document.getElementById("google_btn"),
            { shape: "pill", size: "large", text: "continue_with", width: "350" } 
          );
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.authService.login({
        username: this.username?.value,
        password: this.password?.value
      });
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

}
