import { NgModule } from '@angular/core';
import { NgbNavModule, NgbCollapseModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule
  ],
  exports: [
    NgbNavModule,
    NgbCollapseModule,
    NgbToastModule
  ]
})
export class BootstrapModule { }
