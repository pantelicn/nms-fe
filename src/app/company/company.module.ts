import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BootstrapModule } from '../shared/bootstrap.module';
import { IconsModule } from '../shared/icons.module';
import { SharedModule } from '../shared/shared.module';
import { NavComponent } from './nav/nav.component';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { HomeComponent } from './home/home.component';
import { AddPostComponent } from './home/add-post/add-post.component';
import { TemplatesComponent } from './templates/templates.component';
import { HomeProfileComponent } from './home/home-profile/home-profile.component';
import { RequestComponent } from './request/request.component';
import { TalentsComponent } from './talents/talents.component';
import { SendRequestComponent } from './talents/send-request/send-request.component';
import { ProfileComponent } from './profile/profile.component';
import { EditDetailsComponent } from './profile/edit-details/edit-details.component';
import { EditContactsComponent } from './profile/edit-contacts/edit-contacts.component';
import { EditBenefitsComponent } from './profile/benefits/edit-benefits.component';
import { ImageCropperModule } from 'ngx-image-cropper';  
import { UploadProfileImageComponent } from './profile/upload-profile-image/upload-profile-image.component';
import { NotificationsComponent } from './notifications/notifications.component';


@NgModule({
  declarations: [
    CompanyComponent, 
    NavComponent,
    AddPostComponent,
    HomeComponent,
    HomeProfileComponent,
    RequestComponent,
    TemplatesComponent,
    HomeProfileComponent,
    TalentsComponent,
    SendRequestComponent,
    ProfileComponent,
    EditDetailsComponent,
    EditContactsComponent,
    EditBenefitsComponent,
    UploadProfileImageComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CompanyRoutingModule,
    BootstrapModule,
    IconsModule,
    SharedModule,
    ImageCropperModule
  ]
})
export class CompanyModule { }
