import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/shared/toast/toast.service";
import { TalentTermViewDto } from "../talents.service";
import { SendRequestService } from "./send-request.service";

@Component({
  selector: 'send-request',
  templateUrl: './send-request.component.html',
  styleUrls: ['./send-request.component.scss']
})
export class SendRequestComponent implements OnInit {

  @Input() negotiableTerms: TalentTermViewDto[] = [];
  @Input() nonNegotiableTerms: TalentTermViewDto[] = [];
  @Input() talentId?: string = undefined;
  @Output() requestSentChange = new EventEmitter<void>();
  sendRequestForm: FormGroup = this.fb.group({
    note: new FormControl('', [Validators.required]),
    talentId: new FormControl('', [Validators.required]),
    negotiableTermsForm: new FormArray([]),
    nonNegotiableTermsForm: new FormArray([])
  });
  nonNegotiablesAreChecked: boolean = false;

  constructor(private modalService: NgbModal,
              private fb:FormBuilder,
              private sendRequestService: SendRequestService,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.sendRequestForm = this.fb.group({
      note: new FormControl('', [Validators.required]),
      talentId: new FormControl(this.talentId, [Validators.required]),
      negotiableTermsForm: new FormArray([]),
      nonNegotiableTermsForm: new FormArray([])
    });
    this.nonNegotiableTerms.forEach(term => {
      this.nonNegotiableTermsForm.push(this.createTermForm(term));
    });
    this.negotiableTerms.forEach(term => {
      this.negotiableTermsForm.push(this.createTermForm(term));
    });
  }

  checkNonNegotiableTerms() {
    this.nonNegotiablesAreChecked = this.nonNegotiableTermsForm.controls.every(term => term.value.status === true);
  }

  sendRequest() {
    this.nonNegotiableTermsForm.controls.forEach(control => {
      if (control.get('status')) {
        control.get('status')?.setValue('ACCEPTED');
      };
    });
    const request = {
      'talentId': this.talentId,
      'note': this.note?.value,
      'terms': [...this.negotiableTermsForm.value, ...this.nonNegotiableTermsForm.value]
    }
    this.sendRequestService.sendRequest(request).subscribe(response => {
      this.modalService.dismissAll();
      this.toastService.show('', 'Request has been sent.');
      this.requestSentChange.emit();
    });
  }

  private createTermForm(term: TalentTermViewDto) {
    return new FormGroup({
      termId: new FormControl(term.id, [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  addCounterOffer(index: number) {
    (this.negotiableTermsForm.at(index) as FormGroup).addControl('counterOffer', new FormControl('', [Validators.required]));
  }

  removeCounterOffer(index: number) {
    (this.negotiableTermsForm.at(index) as FormGroup).removeControl('counterOffer');
  }

  get note() {
    return this.sendRequestForm.get('note')
  }

  get negotiableTermsForm() {
    return this.sendRequestForm.get('negotiableTermsForm') as FormArray;
  }

  get nonNegotiableTermsForm() {
    return this.sendRequestForm.get('nonNegotiableTermsForm') as FormArray;
  }

}