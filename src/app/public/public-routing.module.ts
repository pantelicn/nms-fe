import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyViewComponent } from '../shared/components/company-view/company-view.component';
import { 
  PublicComponent,
  LandingComponent,
  RegistrationComponent,
  LoginComponent
} from './';
import { ActivationComponent } from './activation/activation.component';
import { AuthGuardService } from './auth-guard.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { GoogleTalentsComponent } from './google-talents/google-talents.component';
import { PrivacyNoticeComponent } from './legal/privacy-notice/privacy-notice.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { 
    path: '',
    component: PublicComponent,
    canActivateChild: [AuthGuardService],
    children: [
      { path: '', component: LandingComponent },
      { path: 'register', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
      { path: 'activation', component: ActivationComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'companies/:id', component: CompanyViewComponent },
      { path: 'google-talents', component: GoogleTalentsComponent }
    ] 
  },
  {
    path: 'legal/privacy-notice', component: PrivacyNoticeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }