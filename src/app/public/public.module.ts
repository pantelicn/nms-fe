import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './landing/landing.component';
import { NavComponent } from './nav/nav.component';
import { PublicRoutingModule } from './public-routing.module';
import { BootstrapModule } from '../shared/bootstrap.module';
import { PublicComponent } from './public.component';
import { IconsModule } from '../shared/icons.module';
import { FeedComponent } from './feed/feed.component';
import { SharedModule } from '../shared/shared.module';
import { CompanyRegistrationComponent } from './company-registration/company-registration.component';
import { RegistrationComponent } from './registration/registration.component';
import { TalentRegistrationComponent } from './talent-registration/talent-registration.component';
import { LoginComponent } from './login/login.component';
import { ActivationComponent } from './activation/activation.component';


@NgModule({
  declarations: [
    LandingComponent,
    NavComponent,
    PublicComponent,
    FeedComponent,
    CompanyRegistrationComponent,
    RegistrationComponent,
    TalentRegistrationComponent,
    LoginComponent,
    ActivationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PublicRoutingModule,
    BootstrapModule,
    IconsModule,
    SharedModule
  ]
})
export class PublicModule { }
