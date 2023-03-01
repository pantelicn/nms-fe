import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/app/shared/model';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'nms-messages-chat',
  templateUrl: './messages-chat.component.html',
  styleUrls: ['./messages-chat.component.scss']
})
export class MessagesChatComponent implements AfterViewChecked {

  @Output()
  openChats = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef, private chatService: ChatService) { }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  onScrollUp(): void {
    this.chatService.getNextPage(this.to);
  }

  get messages(): Message[] {
    return this.chatService.messages;
  }

  onOpenChats(): void {
    this.openChats.emit();
  }

  get to(): string {
    return this.chatService.to;
  }

}
