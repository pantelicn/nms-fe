import { NgModule } from '@angular/core';
import { NgbNavModule, NgbCollapseModule, NgbToastModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule
  ],
  exports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbDatepickerModule
  ]
})
export class BootstrapModule { }
