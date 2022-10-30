import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AvailableChat, Message } from '../../model';
import { LastMessage } from '../../model/last-message.model';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  selectedMessage!: Message;
  availableChats: AvailableChat[] = [];
  to!: string;
  searchingUser = false;
  searchString = '';

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.chatService.getLastMessages().subscribe(() => 
      this.getAvailableChats()
    );
  }

  get lastMessages(): LastMessage[] {
    return this.chatService.lastMessages;
  }

  get messages(): Message[] {
    return this.chatService.messages;
  }

  onSearch(search: string): void {
    this.searchString = search;
    if (search?.length) {
      this.chatService.getAvailableChats(search).subscribe(data => this.availableChats = data);
    } else {
      this.availableChats = [];
    }
  }

  onStartSearch(): void {
    this.searchString = '';
    this.searchingUser = true;
  }

  onStopSearch(): void {
    this.searchingUser = false;
    this.getAvailableChats();
  }

  startChat(availableChat: AvailableChat): void {
    this.onStopSearch();
    this.to = this.authService.currentUser?.role === 'COMPANY' ? availableChat.talentUsername : availableChat.companyUsername;
    const toName = this.authService.currentUser?.role === 'COMPANY' ? availableChat.talentName : availableChat.companyName;
    this.chatService.getChatMessages(this.to, toName);
    this.init();
  }

  openChat(lastMessage: LastMessage): void {
    this.onStopSearch();
    this.selectedMessage = lastMessage.message;
    this.to = (this.authService.currentUser?.role === 'COMPANY' ? lastMessage.message.talentUsername : lastMessage.message.companyUsername) ?? '';
    const toName = (this.authService.currentUser?.role === 'COMPANY' ? lastMessage.talentName : lastMessage.companyName) ?? '';
    this.chatService.getChatMessages(this.to, toName);
    this.init();
  }

  getAvailableChats(): void {
    const existingUsernames = this.chatService.lastMessages
      .map(lastMessage => this.currentRole === 'COMPANY' ? lastMessage.message.talentUsername : lastMessage.message.companyUsername);
    this.chatService.getAvailableChatsPage(10, 0).subscribe(availableChats => {
      this.availableChats = availableChats.filter(availableChat => 
        !existingUsernames.includes(this.currentRole === 'COMPANY' ? availableChat.talentUsername : availableChat.companyUsername));
    });
  }

  get currentRole(): 'COMPANY' | 'TALENT' {
    return this.authService.currentUser?.role === 'COMPANY' ? 'COMPANY' : 'TALENT';
  }

}