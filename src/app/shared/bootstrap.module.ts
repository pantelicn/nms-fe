import { NgModule } from '@angular/core';
import {
  NgbNavModule,
  NgbCollapseModule,
  NgbToastModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbTypeaheadModule,
  NgbPopoverModule
} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbPopoverModule
  ],
  exports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbPopoverModule
  ]
})
export class BootstrapModule { }
