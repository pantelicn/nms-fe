import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { 
  PublicComponent,
  LandingComponent,
  RegistrationComponent,
  LoginComponent
} from './';
import { ActivationComponent } from './activation/activation.component';

const routes: Routes = [
  { 
    path: '',
    component: PublicComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'register', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
      { path: 'activation', component: ActivationComponent }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }