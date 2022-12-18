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
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { 
    path: '',
    component: PublicComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'register', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
      { path: 'activation', component: ActivationComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'companies/:id', component: CompanyViewComponent }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }