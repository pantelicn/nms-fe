import { Component } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/auth/auth.service";
import { Company } from "src/app/shared/model";
import { ContactService, ContactView } from "src/app/shared/services/contact.service";
import { ProductUsageService, ProductUsageView } from "src/app/shared/services/product-usage.service";
import { SubscriptionService, SubscriptionView } from "src/app/shared/services/subscription.service";
import { CompanyService } from "../company.service";
import { BenefitService, BenefitView } from "../../shared/services/benefits.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  company!: Company;
  contacts?: ContactView[];
  benefits?: BenefitView[];
  subscription?: SubscriptionView;
  productUsages: ProductUsageView[] = [];
  modalOptions: NgbModalOptions = {
    backdrop: true,
    backdropClass: 'customBackdrop',
    size: 'lg'
  };

  constructor(private authService: AuthService, 
              private companyService: CompanyService,
              private modalService: NgbModal,
              private contactService: ContactService,
              private benefitService: BenefitService,
              private subscriptionService: SubscriptionService,
              private productUsageService: ProductUsageService) { }

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
      this.subscriptionService.get().subscribe(response => {
        this.subscription = response;
      });
      this.productUsageService.getForCompany().subscribe(response => {
        this.productUsages = response;
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

  profileImageChanged(profileImagePath: any) {
    console.log(profileImagePath);
    this.company.profileImage = profileImagePath;
  }

  get username(): string | undefined {
    return this.authService.currentUser?.username;
  }

  getImageUrl(profileImage: string): string {
    return environment.api.images + profileImage;
  }

}