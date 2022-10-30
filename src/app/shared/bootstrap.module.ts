import { NgModule } from '@angular/core';
import {
  NgbNavModule,
  NgbCollapseModule,
  NgbToastModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbTypeaheadModule
  ],
  exports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbTypeaheadModule
  ]
})
export class BootstrapModule { }
