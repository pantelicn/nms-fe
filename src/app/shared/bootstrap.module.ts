import { NgModule } from '@angular/core';
import {
  NgbNavModule,
  NgbCollapseModule,
  NgbToastModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbTypeaheadModule,
  NgbPopoverModule,
  NgbProgressbarModule
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
    NgbPopoverModule,
    NgbProgressbarModule
  ],
  exports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbPopoverModule,
    NgbProgressbarModule
  ]
})
export class BootstrapModule { }
