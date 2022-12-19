import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyViewComponent } from "../shared/components/company-view/company-view.component";
import { MessagesComponent } from "../shared/components/messages/messages.component";
import { CompanyComponent } from "./company.component";
import { HomeComponent } from "./home/home.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { ProfileComponent } from "./profile/profile.component";
import { RequestComponent } from "./request/request.component";
import { TalentsComponent } from "./talents/talents.component";
import { TemplatesComponent } from "./templates/templates.component";

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'requests', component: RequestComponent },
      { path: 'templates', component: TemplatesComponent },
      { path: 'talents', component: TalentsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: ':id', component: CompanyViewComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {}