import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/shared/toast/toast.service";
import { RequestDetailView, TalentTermRequestViewDto } from "../request.service";
import { TalentTermRequestService } from "../talent-term-request.service";

@Component({
  selector: 'talent-term-request',
  templateUrl: './talent-term-request.component.html',
  styleUrls: ['./talent-term-request.component.scss']
})
export class TalentTermRequestComponent {
  
  @Input() talentTermRequest?: TalentTermRequestViewDto;
  @Input() requestId?: number;
  @Input() requestModifiedOn?: Date;
  @Output() selectedRequestChange = new EventEmitter<RequestDetailView>();
  @Output() showRefreshBtnChange = new EventEmitter<void>();
  selectedTalentTermRequest?: TalentTermRequestViewDto;
  private modalRef?: NgbModalRef;
  counterOfferForm = new FormGroup({
    newValue: new FormControl('', [Validators.required])
  });
  modalOptions: NgbModalOptions = {
    backdrop: true,
    backdropClass: 'customBackdrop'
  };

  constructor(private modalService: NgbModal, 
              private talentTermRequestService: TalentTermRequestService,
              private toastService: ToastService) {}

  openEditCounterOfferDialog(content: any, selectedTalentTermRequest?: TalentTermRequestViewDto) {
    this.selectedTalentTermRequest = selectedTalentTermRequest;
    this.counterOfferForm.get('newValue')?.setValue(this.selectedTalentTermRequest?.counterOffer);
    this.modalRef = this.modalService.open(content, this.modalOptions);
  }

  editCounterOffer() {
    if (!this.requestId || !this.requestModifiedOn || !this.selectedTalentTermRequest || this.newValue?.value === this.selectedTalentTermRequest.counterOffer) {
      return;
    }
    const counterOfferValue = this.newValue?.value;
    const editCounterOfferRequest = {
      requestId: this.requestId,
      modifiedOn: this.requestModifiedOn,
      newTermRequest: {
        id: this.selectedTalentTermRequest.id,
        counterOffer: counterOfferValue,
        status: this.selectedTalentTermRequest.status
      }
    }
    this.talentTermRequestService.editByCompany(editCounterOfferRequest).subscribe(response => {
      this.selectedRequestChange.emit(response);
      this.toastService.show('', 'Counter offer has been modified.');
      this.modalRef?.close();
    }, 
    (error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Conflict) {
        this.showRefreshBtnChange.emit();
        this.toastService.warning('', 'Please refresh request before editing talent terms!');
        this.modalRef?.close();
      } 
    });
  }

  sendCounterOffer() {
    if (!this.requestId || !this.requestModifiedOn || !this.selectedTalentTermRequest) {
      return;
    }
    const counterOfferValue = this.newValue?.value;
    const editCounterOfferRequest = {
      requestId: this.requestId,
      modifiedOn: this.requestModifiedOn,
      newTermRequest: {
        id: this.selectedTalentTermRequest.id,
        counterOffer: counterOfferValue,
        status: 'COUNTER_OFFER_COMPANY'
      }
    }
    this.talentTermRequestService.editByCompany(editCounterOfferRequest).subscribe(response => {
      this.selectedRequestChange.emit(response);
      this.toastService.show('', 'Counter offer has been sent.');
      this.modalRef?.close();
    })
  }

  get newValue() {
    return this.counterOfferForm.get('newValue');
  }

}