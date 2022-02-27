import { NgModule } from '@angular/core';
import {
  NgbNavModule,
  NgbCollapseModule,
  NgbToastModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule
  ],
  exports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule
  ]
})
export class BootstrapModule { }
