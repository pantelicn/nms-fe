import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationDialog } from "src/app/shared/dialogs/confirmation/confirmation.component";
import { ToastService } from "src/app/shared/toast/toast.service";
import { TalentRequestDetailView, RequestService, RequestView } from "./request.service";

@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit, OnDestroy {

  private readonly TIME_INTERVAL_IN_SECONDS: number = 60000; // 60 seconds
  activeRequests: RequestView[] = [];
  selectedRequest?: TalentRequestDetailView;
  showRefreshBtn: boolean = false;
  intervalId?: any;
  
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
    this.requestService.getAllActiveRequests().subscribe(data => {
      this.activeRequests = data.content;
    });
  }

  setSelectedRequest(selectedRequest: RequestView) {
    this.requestService.get(selectedRequest.id).subscribe(data => {
      console.log(data);
      this.selectedRequest = data;
      selectedRequest.seenByTalent = true;
    });
  }

  refreshSelected(id: number) {
    this.requestService.get(id).subscribe(data => {
      this.selectedRequest = data;
      this.showRefreshBtn = false;
      this.toastService.show('', 'Request has been updated.');
    });
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

  accept() {
    if (!this.selectedRequest) {
      return;
    }
    this.requestService.accept(this.selectedRequest?.id).subscribe(response => {
      this.toastService.show('', 'Request from ' + this.selectedRequest?.company + ' has been accepted.');
      this.findAllActiveRequests();
      this.selectedRequest = undefined;
    });
  }

  reject () {
    const modalRef = this.modalService.open(ConfirmationDialog);
    modalRef.componentInstance.message = 'Please confirm that you want to decline request from '.concat(this.selectedRequest ? this.selectedRequest?.company : '');
    modalRef.result.then(res => {
      if (!this.selectedRequest || !res) {
        return;
      }
      this.requestService.reject(this.selectedRequest?.id).subscribe({
        next: response => {
          this.toastService.show('', 'Request from ' + this.selectedRequest?.company + ' has been rejected.');
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

}