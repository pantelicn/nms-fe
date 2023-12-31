import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyViewComponent } from '../shared/components/company-view/company-view.component';
import { MessagesComponent } from '../shared/components/messages/messages.component';
import { AuthGuardService } from './auth-guard.service';
import { HomeComponent } from './home/home.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestComponent } from './request/request.component';
import { TalentComponent } from './talent.component';

const routes: Routes = [
  {
    path: '',
    component: TalentComponent,
    canActivateChild: [AuthGuardService],
    children: [
      { path: '', component: HomeComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'requests', component: RequestComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'companies/:id', component: CompanyViewComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentRoutingModule {}