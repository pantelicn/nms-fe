import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BootstrapModule } from '../shared/bootstrap.module';
import { IconsModule } from '../shared/icons.module';
import { SharedModule } from '../shared/shared.module';
import { NavComponent } from './nav/nav.component';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';



@NgModule({
  declarations: [
    CompanyComponent, 
    NavComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CompanyRoutingModule,
    BootstrapModule,
    IconsModule,
    SharedModule
  ]
})
export class CompanyModule { }
