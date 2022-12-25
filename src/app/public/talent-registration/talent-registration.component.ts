import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
    lastName: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
  });

  constructor(private countryService: CountryService) { }

  onSubmit(): void {
    this.submitted = true;
    if (!this.talentDetailsForm.valid) {
      return;
    }

    const talentDetails = {...this.talentDetailsForm.value};
    talentDetails['dateOfBirth'] = this.parseDate(talentDetails['dateOfBirth']);

    this.registered.emit(talentDetails);
  }

  private parseDate(ngbDate: NgbDate): string {
    return new Date(ngbDate.year, ngbDate.month, ngbDate.day).toISOString()
  }

  get minDate(): NgbDateStruct {
    return { year: 1901, month: 1, day: 1 }
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

  get dateOfBirth() {
    return this.talentDetailsForm.get('dateOfBirth');
  }

}
