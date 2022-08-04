import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from '../shared/components/messages/messages.component';
import { TalentComponent } from './talent.component';

const routes: Routes = [
  {
    path: '',
    component: TalentComponent,
    children: [
      { path: 'messages', component: MessagesComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentRoutingModule {}