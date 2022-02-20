import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { TalentComponent } from './talent.component';
import { SharedModule } from '../shared/shared.module';
import { BootstrapModule } from '../shared/bootstrap.module';
import { IconsModule } from '../shared/icons.module';
import { TalentRoutingModule } from './talent-routing.module';



@NgModule({
  declarations: [
    NavComponent,
    TalentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BootstrapModule,
    IconsModule,
    TalentRoutingModule
  ]
})
export class TalentModule { }
