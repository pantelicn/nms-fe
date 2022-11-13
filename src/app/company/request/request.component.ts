import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/shared/toast/toast.service";
import { TalentTermRequestViewDto } from "src/app/talent/request/request.service";
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

  get note() {
    return this.editRequestForm.get('note');
  }

  get newNote() {
    return this.editNoteForm.get('newNote');
  }

}