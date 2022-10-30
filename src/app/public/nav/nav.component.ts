import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'nms-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  constructor(private authService: AuthService, 
    public router: Router) { }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  onLogout(): void {
    this.authService.logout();
  }

}
