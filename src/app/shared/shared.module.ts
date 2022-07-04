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
import { MessagesComponent } from './components/messages/messages.component';
import { MessagesUserComponent } from './components/messages/messages-user/messages-user.component';
import { MessagesChatComponent } from './components/messages/messages-chat/messages-chat.component';
import { MessagesChatInputComponent } from './components/messages/messages-chat/messages-chat-input/messages-chat-input.component';
import { FormsModule } from '@angular/forms';
import { MessagesChatViewComponent } from './components/messages/messages-chat/messages-chat-view/messages-chat-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesNewUserComponent } from './components/messages/messages-new-user/messages-new-user.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    PostComponent,
    TalentComponent,
    ToastComponent,
    LinkPreviewComponent,
    MessagesComponent,
    MessagesUserComponent,
    MessagesChatComponent,
    MessagesChatInputComponent,
    MessagesChatViewComponent,
    MessagesNewUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IconsModule,
    BootstrapModule,
    NgxLinkifyjsModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  exports: [
    PostComponent,
    TalentComponent,
    ToastComponent
  ]
})
export class SharedModule { }
