import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/shared/toast/toast.service";
import { RequestDetailView, RequestService, RequestView, TalentTermRequestViewDto } from "./request.service";
import { TalentTermRequestService } from "./talent-term-request.service";

@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

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

  constructor(private fb:FormBuilder, 
              private requestService: RequestService,
              private modalService: NgbModal,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.findAllActiveRequests();
    setInterval(()=> { this.findAllActiveRequests() }, this.TIME_INTERVAL_IN_SECONDS);
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

  get note() {
    return this.editRequestForm.get('note');
  }

  get newNote() {
    return this.editNoteForm.get('newNote');
  }

}