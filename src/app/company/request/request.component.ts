import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationDialog } from "src/app/shared/dialogs/confirmation/confirmation.component";
import { ToastService } from "src/app/shared/toast/toast.service";
import { RequestDetailView, RequestService, RequestView } from "./request.service";

@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit, OnDestroy {

  submitted:boolean = false;
  activeRequests: RequestView[] = [];
  editRequestForm: FormGroup = this.fb.group({
    note: new FormControl('', [Validators.required])
  });
  selectedRequest?: RequestDetailView;
  modalOptions: NgbModalOptions = {
    backdrop: true,
    backdropClass: 'customBackdrop'
  };
  editNoteForm = new FormGroup({
    newNote: new FormControl('', [Validators.required])
  });
  showRefreshBtn: boolean = false;
  private modalRef?: NgbModalRef;
  private readonly TIME_INTERVAL_IN_SECONDS: number = 60000; // 60 seconds
  intervalId: any;
  showSpinnerActiveRequests: boolean = true;

  constructor(private fb:FormBuilder, 
              private requestService: RequestService,
              private modalService: NgbModal,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.findAllActiveRequests();
    this.intervalId = setInterval(()=> { this.findAllActiveRequests() }, this.TIME_INTERVAL_IN_SECONDS);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  findAllActiveRequests() {
    this.requestService.getAllActiveRequests().subscribe({
      next: response => {
        this.activeRequests = response;
        this.showSpinnerActiveRequests = false;
      },
      error: error => {
        this.showSpinnerActiveRequests = false;
      }
    });
  }

  editNote() {
    if (!this.selectedRequest) {
      return;
    }
    const newNote = this.newNote?.value;
    const requestId = this.selectedRequest?.id;
    this.requestService.editNote(requestId, newNote).subscribe(data => {
      if (this.selectedRequest) {
        this.selectedRequest.note = data.note;
      }
      this.toastService.show('', 'Note has been updated.');
      this.modalRef?.close();
    });
  }

  refreshSelected(id: number) {
    this.requestService.get(id).subscribe(data => {
      this.selectedRequest = data;
      this.showRefreshBtn = false;
      this.toastService.show('', 'Request has been updated.');
    });
  }

  setSelectedRequest(selectedRequest: RequestView) {
    this.requestService.get(selectedRequest.id).subscribe(data => {
      this.selectedRequest = data;
      selectedRequest.seenByCompany = true;
    });
  }

  openEditNoteDialog(content: any) {
    this.newNote?.setValue(this.selectedRequest?.note);
    this.modalRef = this.modalService.open(content, this.modalOptions);
  }

  areAllTermsAccepted():boolean {
    if (!this.selectedRequest) {
      return false;
    }

    for (let talentTermRequest of this.selectedRequest?.talentTermRequests) {
      if (talentTermRequest.status !== 'ACCEPTED') {
        return false;
      }
    }
    return true;
  }

  reject() {
    const modalRef = this.modalService.open(ConfirmationDialog);
    modalRef.componentInstance.message = 'Please confirm that you want to decline request under the note '.concat(this.selectedRequest ? this.selectedRequest?.note : '');
    modalRef.result.then(res => {
      if (!this.selectedRequest || !res) {
        return;
      }
      this.requestService.reject(this.selectedRequest?.id).subscribe({
        next: response => {
          this.toastService.show('', 'Request has been rejected.');
          this.findAllActiveRequests();
          this.selectedRequest = undefined;
        }, 
        error: (err: HttpErrorResponse) => {
          this.toastService.error('Error', 'Unable to update request status');
        }
      });
    }, dismiss => {
      
    });
  }

  get note() {
    return this.editRequestForm.get('note');
  }

  get newNote() {
    return this.editNoteForm.get('newNote');
  }

}