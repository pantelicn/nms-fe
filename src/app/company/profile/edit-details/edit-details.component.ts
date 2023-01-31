import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { City, Company, Country } from "src/app/shared/model";
import { LocationService } from "src/app/shared/services/location.service";
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
    description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
  });
  @Input() company?: Company;
  @Output() detailsChange = new EventEmitter<Company>();
  cities: City[] = [];
  countries: Country[] = [];

  constructor(private modalService: NgbModal, 
              private companyService: CompanyService,
              private toastService: ToastService,
              private locationService: LocationService) {}

  ngOnInit(): void {
    this.getCountries();
    this.editDetailsForm = new FormGroup({
      id: new FormControl(this.company?.id, [Validators.required]),
      name: new FormControl(this.company?.name, [Validators.required]),
      description: new FormControl(this.company?.description, [Validators.required, Validators.maxLength(1000)]),
      newLocation: new FormGroup({
        id: new FormControl(this.company?.location.id, [Validators.required]),
        countryId: new FormControl(this.company?.location.country.id, [Validators.required]),
        province: new FormControl(this.company?.location.province, []),
        cityId: new FormControl(this.company?.location.city.id, [Validators.required]),
        address: new FormControl(this.company?.location.address, [Validators.required]),
      })
    });
  }

  edit(modified: Company) {
    this.companyService.edit(modified).subscribe(result => {
      this.toastService.show('', 'Details updated.');
      this.detailsChange.emit(result);
      this.close();
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  citiesForCountryId() {
    if (!this.countryId?.value) {
      return;
    }
    this.locationService.getCities(this.countryId.value).subscribe({next : response => {
      this.cities = response;
    },
    error : errro => {

    }});
  }

  getCountries() {
    this.locationService.getCountries().subscribe({
      next: response => {
        this.countries = response;
        this.citiesForCountryId();
      },
      error: error => {

      }
    })
  }

  deselectCity() {
    (this.editDetailsForm.controls['newLocation'] as FormGroup).controls['cityId'].setValue(undefined);
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

  get countryId() {
    return this.editDetailsForm.get('newLocation.countryId');
  }

  get province() {
    return this.editDetailsForm.get('newLocation.province');
  }

  get cityId() {
    return this.editDetailsForm.get('newLocation.cityId');
  }

  get address() {
    return this.editDetailsForm.get('newLocation.address');
  }

}