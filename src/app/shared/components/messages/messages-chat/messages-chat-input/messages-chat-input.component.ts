import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ChatService, MessageSend } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'nms-messages-chat-input',
  templateUrl: './messages-chat-input.component.html',
  styleUrls: ['./messages-chat-input.component.scss']
})
export class MessagesChatInputComponent {

  constructor(private chatService: ChatService) { }

  chatInput = '';

  get maxRows(): number {
    return this.chatInput.split('\n').length;
  }

  @HostListener('window:keydown.enter', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    event.preventDefault();
    this.onSubmit();
  }

  onSubmit(): void {
    if (this.chatInput.trim().length === 0) {
      return;
    }
    const message: MessageSend = {
      to: this.to,
      content: this.chatInput,
    }
    this.chatService.sendMessage(message);
    this.chatInput = '';
  }

  get to(): string {
    return this.chatService.to;
  }

}
