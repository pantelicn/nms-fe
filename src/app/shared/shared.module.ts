import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostComponent } from './components/post/post.component';
import { IconsModule } from './icons.module';
import { TalentComponent } from './components/talent/talent.component';
import { BootstrapModule } from './bootstrap.module';
import { ToastComponent } from './toast/toast.component';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { LinkPreviewComponent } from './components/link-preview/link-preview.component';


@NgModule({
  declarations: [
    PostComponent,
    TalentComponent,
    ToastComponent,
    LinkPreviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IconsModule,
    BootstrapModule,
    NgxLinkifyjsModule
  ],
  exports: [
    PostComponent,
    TalentComponent,
    ToastComponent
  ]
})
export class SharedModule { }
