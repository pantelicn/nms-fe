import { NgModule } from '@angular/core';
import {
  NgbNavModule,
  NgbCollapseModule,
  NgbToastModule,
  NgbDatepickerModule,
  NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule,
    NgbDropdownModule
  ],
  exports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule,
    NgbDropdownModule
  ]
})
export class BootstrapModule { }
