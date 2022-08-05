import { Component } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/auth/auth.service";
import { Company } from "src/app/shared/model";
import { ContactService, ContactView } from "src/app/shared/services/contact.service";
import { CompanyService } from "../company.service";
import { BenefitService, BenefitView } from "./benefits/benefits.service";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  company!: Company;
  contacts?: ContactView[];
  benefits?: BenefitView[];
  modalOptions: NgbModalOptions = {
    backdrop: true,
    backdropClass: 'customBackdrop',
    size: 'lg'
  };

  constructor(private authService: AuthService, 
              private companyService: CompanyService,
              private modalService: NgbModal,
              private contactService: ContactService,
              private benefitService: BenefitService) { }

  ngOnInit(): void {
    if (this.username) {
      this.companyService.getCompany(this.username).subscribe(
        company => this.company = company
      );
      this.contactService.getAll().subscribe(response => {
        this.contacts = response;
      });
      this.benefitService.getAll().subscribe(response => {
        this.benefits = response;
      });
    }
  }

  openDialog(content: any): void {
    this.modalService.open(content, this.modalOptions);
  }

  newContactsAdded(newContacts: ContactView[]) {
    newContacts.forEach(newContact => {
      this.contacts?.push(newContact);
    })
  }

  get username(): string | undefined {
    return this.authService.currentUser?.username;
  }

}