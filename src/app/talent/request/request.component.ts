import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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

}