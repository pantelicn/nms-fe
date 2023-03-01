import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/auth/auth.service";
import { TalentTermRequestViewDto, RequestDetailView } from "src/app/company/request/request.service";
import { TalentTermRequestService } from "src/app/shared/services/talent-term-request.service";
import { ToastService } from "src/app/shared/toast/toast.service";
import { TalentRequestDetailView } from "src/app/talent/request/request.service";
import { environment } from "src/environments/environment";
import { Company, TermType, User } from "../../model";

@Component({
  selector: 'talent-term-request',
  templateUrl: './talent-term-request.component.html',
  styleUrls: ['./talent-term-request.component.scss']
})
export class TalentTermRequestComponent implements OnInit {
  
  @Input() talentTermRequest?: TalentTermRequestViewDto;
  @Input() requestId: number = -1;
  @Input() requestModifiedOn: Date = new Date();
  @Input() company!: Company;
  @Output() selectedRequestCompanyChange = new EventEmitter<RequestDetailView>();
  @Output() selectedRequestTalentChange = new EventEmitter<TalentRequestDetailView>();
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
  user?: User;
  termType = TermType;

  constructor(private modalService: NgbModal, 
              private talentTermRequestService: TalentTermRequestService,
              private toastService: ToastService,
              private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user !== null) {
      this.user = user;
    }
  }

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
    if (this.user?.role === 'COMPANY') {
      this.talentTermRequestService.editByCompany(editCounterOfferRequest).subscribe({
        next: (response) => {
          this.selectedRequestCompanyChange.emit(response);
          this.toastService.show('', 'Counter offer has been modified.');
          this.modalRef?.close();
        }, 
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Conflict) {
            this.showRefreshBtnChange.emit();
            this.toastService.warning('', 'Please refresh request before editing talent terms!');
            this.modalRef?.close();
          } 
      }});
    } else {
      this.talentTermRequestService.editByTalent(editCounterOfferRequest).subscribe({
        next: response => {
        this.selectedRequestTalentChange.emit(response);
        this.toastService.show('', 'Counter offer has been modified.');
        this.modalRef?.close();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          this.showRefreshBtnChange.emit();
          this.toastService.warning('', 'Please refresh request before editing talent terms!');
          this.modalRef?.close();
        } 
      }
    });
    }
  }

  sendCounterOffer() {
    if (!this.requestId || !this.requestModifiedOn || !this.selectedTalentTermRequest) {
      return;
    }
    const counterOfferValue = this.newValue?.value;
    const counterOfferBy = this.user?.role === 'COMPANY' ? 'COUNTER_OFFER_COMPANY' : 'COUNTER_OFFER_TALENT';
    const editCounterOfferRequest = {
      requestId: this.requestId,
      modifiedOn: this.requestModifiedOn,
      newTermRequest: {
        id: this.selectedTalentTermRequest.id,
        counterOffer: counterOfferValue,
        status: counterOfferBy
      }
    }
    if (this.user?.role === 'COMPANY') {
      this.talentTermRequestService.editByCompany(editCounterOfferRequest).subscribe({next: response => {
        this.selectedRequestCompanyChange.emit(response);
        this.toastService.show('', 'Counter offer has been sent.');
        this.modalRef?.close();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          this.showRefreshBtnChange.emit();
          this.toastService.warning('', 'Please refresh request before editing talent terms!');
          this.modalRef?.close();
        }
      }}
      )
    } else {
      this.talentTermRequestService.editByTalent(editCounterOfferRequest).subscribe({
        next: response => {
          this.selectedRequestTalentChange.emit(response);
          this.toastService.show('', 'Counter offer has been sent.');
          this.modalRef?.close();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Conflict) {
            this.showRefreshBtnChange.emit();
            this.toastService.warning('', 'Please refresh request before editing talent terms!');
            this.modalRef?.close();
          }
        }
      })
    }
  }

  acceptCompanyCounterTerm(talentTermRequestId: number) {
    const editCounterOfferRequest = {
      requestId: this.requestId,
      modifiedOn: this.requestModifiedOn,
      newTermRequest: {
        id: talentTermRequestId,
        status: 'ACCEPTED'
      }
    }
    this.talentTermRequestService.editByTalent(editCounterOfferRequest).subscribe(response => {
      this.selectedRequestTalentChange.emit(response);
      this.toastService.show('', 'Counter offer has been accepted.');
      this.modalRef?.close();
    })
  }

  acceptTalentCounterTerm(talentTermRequestId: number) {
    const editCounterOfferRequest = {
      requestId: this.requestId,
      modifiedOn: this.requestModifiedOn,
      newTermRequest: {
        id: talentTermRequestId,
        status: 'ACCEPTED'
      }
    }

    this.talentTermRequestService.editByCompany(editCounterOfferRequest).subscribe(response => {
      this.selectedRequestCompanyChange.emit(response);
      this.toastService.show('', 'Counter offer has been accepted.');
      this.modalRef?.close();
    })
  }

  get newValue() {
    return this.counterOfferForm.get('newValue');
  }

  getOfferDescription(): string {
    if (this.talentTermRequest?.status === 'COUNTER_OFFER_COMPANY') {
      return ' is offered';
    } else if (this.talentTermRequest?.status === 'COUNTER_OFFER_TALENT') {
      return ' is requested'
    } else  if (this.talentTermRequest?.status === 'ACCEPTED') {
      return ' is accepted';
    } else if (this.talentTermRequest?.status === 'REJECTED') {
      return ' is rejected';
    } else {
      return '';
    }
  }

  getImageUrl(profileImage: string): string {
    return environment.api.images + profileImage;
  }

}