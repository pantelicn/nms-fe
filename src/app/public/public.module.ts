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
import { LoginComponent } from './login/login.component';
import { ActivationComponent } from './activation/activation.component';
import { PublicFeedComponent } from './feed/feed.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { GoogleTalentsComponent } from './google-talents/google-talents.component';
import { RegistrationTalentComponent } from './registration-talent/registration-talent.component';
import { RegistrationCompanyComponent } from './registration-company/registration-company.component';


@NgModule({
  declarations: [
    LandingComponent,
    NavComponent,
    PublicComponent,
    PublicFeedComponent,
    LoginComponent,
    ActivationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    GoogleTalentsComponent,
    RegistrationTalentComponent,
    RegistrationCompanyComponent
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
