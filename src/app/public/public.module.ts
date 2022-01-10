import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { NavComponent } from './nav/nav.component';
import { PublicRoutingModule } from './public-routing.module';
import { BootstrapModule } from '../shared/bootstrap.module';
import { PublicComponent } from './public.component';
import { IconsModule } from '../shared/icons.module';


@NgModule({
  declarations: [
    LandingComponent,
    NavComponent,
    PublicComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    BootstrapModule,
    IconsModule
  ]
})
export class PublicModule { }
