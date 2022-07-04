import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { LastMessage } from 'src/app/shared/model/last-message.model';

@Component({
  selector: 'nms-messages-user',
  templateUrl: './messages-user.component.html',
  styleUrls: ['./messages-user.component.scss']
})
export class MessagesUserComponent {

  @Input()
  lastMessage!: LastMessage;

  constructor(private authService: AuthService) { }

  get username(): string {
    return this.lastMessage.message.companyUsername ?? this.lastMessage.message.talentUsername ?? '';
  }

  get name(): string {
    return this.lastMessage.companyName ?? this.lastMessage.talentName ?? '';
  }

  get content(): string {
    return this.lastMessage.message.content;
  }

  get seen(): boolean {
    return this.lastMessage.message.seen;
  }

  get from(): string {
    return this.lastMessage.message.createdBy === this.authService.currentUser?.role ? 'You' : this.name;
  }

}
