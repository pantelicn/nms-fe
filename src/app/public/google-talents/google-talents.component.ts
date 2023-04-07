import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService, JwtPayload } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-google-talents',
  templateUrl: './google-talents.component.html'
})
export class GoogleTalentsComponent implements OnInit {

  constructor(private authService: AuthService, private cookieService: CookieService, private router: Router) { }

  ngOnInit(): void {
    const jwt = this.cookieService.get('token');
    const encodedPayload = jwt.split(".")[1];
    const payload: JwtPayload = JSON.parse(atob(encodedPayload));
    this.authService.setCurrentUser(jwt, payload.sub, ['ROLE_TALENT']);
    this.router.navigate(['/talent']);

  }

}
