import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Company } from "src/app/shared/model";
import { ToastService } from "src/app/shared/toast/toast.service";
import { CompanyService } from "../../company.service";

@Component({
  selector: 'edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.scss']
})
export class EditDetailsComponent implements OnInit {
  editDetailsForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });
  @Input() company?: Company;

  constructor(private modalService: NgbModal, 
              private companyService: CompanyService,
              private toastService: ToastService ) {}

  ngOnInit(): void {
    this.editDetailsForm = new FormGroup({
      id: new FormControl(this.company?.id, [Validators.required]),
      name: new FormControl(this.company?.name, [Validators.required]),
      description: new FormControl(this.company?.description, [Validators.required]),
      newLocation: new FormGroup({
        id: new FormControl(this.company?.location.id, [Validators.required]),
        country: new FormControl(this.company?.location.country, [Validators.required]),
        province: new FormControl(this.company?.location.province, []),
        city: new FormControl(this.company?.location.city, [Validators.required]),
        countryCode: new FormControl(this.company?.location.countryCode, [Validators.required]),
        address: new FormControl(this.company?.location.address, [Validators.required]),
      })
    });
  }

  edit(modified: Company) {
    this.companyService.edit(modified).subscribe(result => {
      this.toastService.show('', 'Details updated.');
      this.close();
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  get name() {
    return this.editDetailsForm.get('name');
  }

  get description() {
    return this.editDetailsForm.get('description');
  }

  get id () {
    return this.editDetailsForm.get('id');
  }

  get country() {
    return this.editDetailsForm.get('newLocation.country');
  }

  get province() {
    return this.editDetailsForm.get('newLocation.province');
  }

  get city() {
    return this.editDetailsForm.get('newLocation.city');
  }

  get address() {
    return this.editDetailsForm.get('newLocation.address');
  }

}