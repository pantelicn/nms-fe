import { NgModule } from '@angular/core';
import { NgbNavModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    NgbNavModule,
    NgbCollapseModule
  ],
  exports: [
    NgbNavModule,
    NgbCollapseModule
  ]
})
export class BootstrapModule { }
