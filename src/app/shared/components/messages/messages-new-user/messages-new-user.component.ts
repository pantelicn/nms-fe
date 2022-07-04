import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AvailableChat } from 'src/app/shared/model';

@Component({
  selector: 'nms-messages-new-user',
  templateUrl: './messages-new-user.component.html',
  styleUrls: ['./messages-new-user.component.scss']
})
export class MessagesNewUserComponent {

  @Input()
  availableChat!: AvailableChat;

  constructor(private authService: AuthService) { }

  get username(): string {
    return this.authService.currentUser?.role === 'COMPANY' ? this.availableChat.talentUsername : this.availableChat.companyUsername;
  }

  get name(): string {
    return this.authService.currentUser?.role === 'COMPANY' ? this.availableChat.talentName : this.availableChat.companyName;
  }

}
