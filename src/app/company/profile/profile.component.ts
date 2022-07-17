import { Component } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/auth/auth.service";
import { Company } from "src/app/shared/model";
import { CompanyService } from "../company.service";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  company!: Company;
  modalOptions: NgbModalOptions = {
    backdrop: true,
    backdropClass: 'customBackdrop',
    size: 'lg'
  };

  constructor(private authService: AuthService, 
              private companyService: CompanyService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    if (this.username) {
      this.companyService.getCompany(this.username).subscribe(
        company => this.company = company 
      );
    }
  }

  openEditDetailsDialog(content: any, company: Company): void {
    console.log('open')
    this.modalService.open(content, this.modalOptions);
  }

  get username(): string | undefined {
    return this.authService.currentUser?.username;
  }

}