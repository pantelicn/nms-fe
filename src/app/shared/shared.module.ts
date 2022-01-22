import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './components/post/post.component';
import { IconsModule } from './icons.module';
import { TalentComponent } from './components/talent/talent.component';
import { BootstrapModule } from './bootstrap.module';



@NgModule({
  declarations: [
    PostComponent,
    TalentComponent
  ],
  imports: [
    CommonModule,
    IconsModule,
    BootstrapModule
  ],
  exports: [
    PostComponent,
    TalentComponent
  ]
})
export class SharedModule { }
