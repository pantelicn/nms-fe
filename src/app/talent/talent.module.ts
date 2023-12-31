import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { TalentComponent } from './talent.component';
import { SharedModule } from '../shared/shared.module';
import { BootstrapModule } from '../shared/bootstrap.module';
import { IconsModule } from '../shared/icons.module';
import { TalentRoutingModule } from './talent-routing.module';
import { RequestComponent } from './request/request.component';
import { ProfileComponent } from './profile/profile.component';
import { EditTalentTermsComponent } from './profile/edit-talent-terms/edit-talent-terms.component';
import { EditTalentSkillsComponent } from './profile/edit-talent-skills/edit-talent-skills.component';
import { EditContactsComponent } from './profile/edit-contacts/edit-contacts.component';
import { EditDetailsComponent } from './profile/edit-details/edit-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from './notifications/notifications.component';
import { HomeComponent } from './home/home.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EditAvailableLocationsComponent } from './profile/edit-available-locations/edit-available-locations.component';
import { AddProjectComponent } from './profile/add-project/add-project.component';
import { EditProjectComponent } from './profile/edit-project/edit-project.component';



@NgModule({
  declarations: [
    NavComponent,
    TalentComponent,
    RequestComponent,
    ProfileComponent,
    EditTalentTermsComponent,
    EditTalentSkillsComponent,
    EditContactsComponent,
    EditDetailsComponent,
    NotificationsComponent,
    HomeComponent,
    EditAvailableLocationsComponent,
    AddProjectComponent,
    EditProjectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BootstrapModule,
    IconsModule,
    TalentRoutingModule,
    InfiniteScrollModule
  ]
})
export class TalentModule { }
