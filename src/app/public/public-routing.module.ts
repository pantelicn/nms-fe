import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent, LandingComponent, RegistrationComponent, CompanyRegistrationComponent, TalentRegistrationComponent } from './';

const routes: Routes = [
  { 
    path: '',
    component: PublicComponent,
    children: [
      { path: '', component: LandingComponent },
      { 
        path: 'register',
        component: RegistrationComponent,
        children: [
          { path: '', redirectTo: 'talent' },
          { path: 'talent', component: TalentRegistrationComponent },
          { path: 'company', component: CompanyRegistrationComponent }
        ]
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }