import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { NavComponent } from './nav/nav.component';
import { PublicRoutingModule } from './public-routing.module';
import { BootstrapModule } from '../shared/bootstrap.module';
import { PublicComponent } from './public.component';
import { IconsModule } from '../shared/icons.module';
import { FeedComponent } from './feed/feed.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LandingComponent,
    NavComponent,
    PublicComponent,
    FeedComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    BootstrapModule,
    IconsModule,
    SharedModule
  ]
})
export class PublicModule { }
