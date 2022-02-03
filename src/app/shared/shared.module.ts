import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostComponent } from './components/post/post.component';
import { IconsModule } from './icons.module';
import { TalentComponent } from './components/talent/talent.component';
import { BootstrapModule } from './bootstrap.module';
import { ToastComponent } from './toast/toast.component';



@NgModule({
  declarations: [
    PostComponent,
    TalentComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IconsModule,
    BootstrapModule
  ],
  exports: [
    PostComponent,
    TalentComponent,
    ToastComponent
  ]
})
export class SharedModule { }
