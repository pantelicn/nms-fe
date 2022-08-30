import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from '../shared/components/messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestComponent } from './request/request.component';
import { TalentComponent } from './talent.component';

const routes: Routes = [
  {
    path: '',
    component: TalentComponent,
    children: [
      { path: 'messages', component: MessagesComponent },
      { path: 'requests', component: RequestComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentRoutingModule {}