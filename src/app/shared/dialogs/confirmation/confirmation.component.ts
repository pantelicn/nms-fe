import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationDialog {

  @Input()
  confirmBtnText: string = 'Confirm';
  @Input()
  cancelBtnText: string = 'Cancel';
  @Input()
  message: string = 'Please confirm your request.'

  constructor(public activeModal: NgbActiveModal) { }

  confirm() {
    this.activeModal.close(true);
  }

  cancel() {
    this.activeModal.dismiss();
  }

}