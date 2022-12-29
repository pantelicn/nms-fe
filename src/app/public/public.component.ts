import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'nms-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  constructor(private authService: AuthService, 
              private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      if (this.authService.currentUser?.role === 'COMPANY') {
        this.router.navigate(['/company']);
      } else {
        this.router.navigate(['/talent']);
      }
    }
  }

}
