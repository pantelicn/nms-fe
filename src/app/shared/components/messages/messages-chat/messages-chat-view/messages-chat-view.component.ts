import { DatePipe, formatDate } from '@angular/common';
import { Component, Input, LOCALE_ID } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Message } from 'src/app/shared/model';
import { ChatService } from 'src/app/shared/services/chat.service';

interface ChatMessageView {
  content: string;
  name: string;
  date: string;
  byCurrentUser: boolean
}

@Component({
  selector: 'nms-messages-chat-view',
  templateUrl: './messages-chat-view.component.html',
  styleUrls: ['./messages-chat-view.component.scss']
})
export class MessagesChatViewComponent {

  constructor(private authService: AuthService, private chatService: ChatService) { }

  get chatMessages(): ChatMessageView[] {
    return this.chatService.messages.map(message => (
      {
        content: message.content,
        name: this.currentRole === message.createdBy 
          ? 'You' 
          : (this.currentRole === 'COMPANY' ? message.talentName : message.companyName) ?? '',
        date: message.createdOn,
        byCurrentUser: this.currentRole === message.createdBy
      }
    )).reverse();
  }

  get currentRole(): 'COMPANY' | 'TALENT' | undefined {
    return this.authService.currentUser?.role;
  }

  formatDate(date: string): string | null {
    return formatDate(Date.parse(date), 'dd-MM-yyyy HH:mm', 'en-US');
  }

}
