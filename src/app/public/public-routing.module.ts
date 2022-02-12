import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { 
  PublicComponent,
  LandingComponent,
  RegistrationComponent,
  LoginComponent
} from './';

const routes: Routes = [
  { 
    path: '',
    component: PublicComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'register', component: RegistrationComponent },
      { path: 'login', component: LoginComponent }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }