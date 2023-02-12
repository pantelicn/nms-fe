import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Country } from 'src/app/shared/model';
import { CountryService } from 'src/app/shared/services/country.service';

@Component({
  selector: 'nms-talent-registration',
  templateUrl: './talent-registration.component.html',
  styleUrls: ['./talent-registration.component.scss']
})
export class TalentRegistrationComponent {

  submitted = false;

  @Output() registered = new EventEmitter<AbstractControl>();

  talentDetailsForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required)
  });

  constructor(private countryService: CountryService) { }

  onSubmit(): void {
    this.submitted = true;
    if (!this.talentDetailsForm.valid) {
      return;
    }

    const talentDetails = {...this.talentDetailsForm.value};

    this.registered.emit(talentDetails);
  }

  get countries(): Country[] {
    return this.countryService.getAll();
  }

  get firstName() {
    return this.talentDetailsForm.get('firstName');
  }

  get lastName() {
    return this.talentDetailsForm.get('lastName');
  }

}
