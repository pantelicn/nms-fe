import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from 'src/app/shared/model';
import { CompanyService } from '../../company.service';

@Component({
  selector: 'nms-home-profile',
  templateUrl: './home-profile.component.html',
  styleUrls: ['./home-profile.component.scss']
})
export class HomeProfileComponent implements OnInit {

  company!: Company;

  constructor(private authService: AuthService, private companyService: CompanyService) { }

  ngOnInit(): void {
    if (this.username) {
      this.companyService.getCompany(this.username).subscribe(
        company => this.company = company
      );
    }
  }

  get username(): string | undefined {
    return this.authService.currentUser?.username;
  }
  
}
