import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitted = false;
  activeTab: string = "TALENT";

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.addGoogleBtn();
    this.checkUserType();
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

  setActiveTab(activeTab: string) {
    this.activeTab = activeTab;
  }

  checkUserType() {
    const userType = this.activatedRoute.snapshot.queryParamMap.get('userType');
    if (userType) {
      this.activeTab = userType;
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  private addGoogleBtn() {
    google.accounts.id.renderButton(
      document.getElementById("google_btn"),
      { shape: "pill", size: "large", text: "continue_with", width: "350" } 
    );
  }

}
