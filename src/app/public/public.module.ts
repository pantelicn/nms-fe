import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './landing/landing.component';
import { NavComponent } from './nav/nav.component';
import { PublicRoutingModule } from './public-routing.module';
import { BootstrapModule } from '../shared/bootstrap.module';
import { PublicComponent } from './public.component';
import { IconsModule } from '../shared/icons.module';
import { SharedModule } from '../shared/shared.module';
import { CompanyRegistrationComponent } from './company-registration/company-registration.component';
import { RegistrationComponent } from './registration/registration.component';
import { TalentRegistrationComponent } from './talent-registration/talent-registration.component';
import { LoginComponent } from './login/login.component';
import { ActivationComponent } from './activation/activation.component';
import { PublicFeedComponent } from './feed/feed.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { GoogleTalentsComponent } from './google-talents/google-talents.component';


@NgModule({
  declarations: [
    LandingComponent,
    NavComponent,
    PublicComponent,
    PublicFeedComponent,
    CompanyRegistrationComponent,
    RegistrationComponent,
    TalentRegistrationComponent,
    LoginComponent,
    ActivationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    GoogleTalentsComponent
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
