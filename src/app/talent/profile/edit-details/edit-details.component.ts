import { AfterContentInit, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TalentService } from 'src/app/company/talents/talents.service';
import { Talent } from 'src/app/shared/model';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.scss']
})
export class EditDetailsComponent implements AfterContentInit {

  constructor(private modalService: NgbModal, private talentService: TalentService, private toastService: ToastService) { }

  @Input()
  talent!: Talent;

  nameForm!: FormGroup 

  ngAfterContentInit(): void {
    this.nameForm = new FormGroup({
      firstName: new FormControl(this.talent.firstName, [Validators.required]),
      lastName: new FormControl(this.talent.lastName, [Validators.required]),
      experienceYears: new FormControl(this.talent.experienceYears, [Validators.required, Validators.min(0), Validators.max(99)])
    });
  }

  close(): void {
    this.modalService.dismissAll();
  }

  onUpdateName(): void {
    const data = this.nameForm.value;
    this.talentService.updateBasicInfo(data).subscribe(talent => {
      this.talent.firstName = talent.firstName;
      this.talent.lastName = talent.lastName;
      this.talent.experienceYears = talent.experienceYears;
      this.nameForm.markAsPristine();
      this.toastService.show('', 'Updated basic info.');
    });
  }

  get firstName() {
    return this.nameForm.get('firstName');
  }

  get lastName() {
    return this.nameForm.get('lastName');
  }

}
