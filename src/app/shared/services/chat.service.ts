import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { AvailableChat, Message, Page } from '../model';
import { LastMessage } from '../model/last-message.model';

export interface MessageSend {
  to: string;
  content: string;
}

declare var SockJS: new (url: string) => any;
declare var Stomp: any;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly availableChatsApi = environment.api.backend + 'available-chats';
  private readonly chatUrl = environment.api.backend + 'messaging';
  private readonly talentsApi = environment.api.backend + 'talents/';
  private readonly companiesApi = environment.api.backend + 'companies/';
  private readonly chatsApi: string;
  private readonly chatsSuffix = '/chats';
  private page = 1;
  private timestamp = new Date();

  public lastMessages: LastMessage[] = []
  public msg: MessageSend[] = [];
  public stompClient: any;
  public messagesSubject = new Subject<MessageSend>();
  public messages: Message[] = [];

  constructor(private authService: AuthService, private http: HttpClient) {
    this.connect();
    this.messagesSubject.subscribe(message => this.handleSentMessage(message))
    this.chatsApi = (this.role === 'TALENT' ? this.talentsApi : this.companiesApi)
      + this.username
      + this.chatsSuffix;
  }

  private connect() {
    const webSocket = new SockJS(this.chatUrl);
    this.stompClient = Stomp.over(webSocket);
    // TODO: Uncomment line bellow to remove websocket logs
    // this.stompClient.debug = null;
    this.stompClient.connect({token: this.authService.currentUser?.idToken}, () => {
      this.stompClient.subscribe('/user/queue/messages', (message: MessageSend) => {
        if (message) {
          this.msg.push(message);
        }
      });
    });
  }

  sendMessage(message: MessageSend): void {
    this.stompClient.send('/chat', {}, JSON.stringify(message));
    this.messagesSubject.next(message);
  }

  getAvailableChats(search: string): Observable<AvailableChat[]> {
    let params = new HttpParams();
    params = params.append('search', search);
    return this.http.get<Page<AvailableChat>>(this.availableChatsApi + '/' + this.authService.currentUser?.username, {params}).pipe(map(data => data.content));
  }

  getAvailableChatsPage(pageSize: number, pageNumber: number): Observable<AvailableChat[]> {
    const params = new HttpParams()
      .append('pageSize', pageSize)
      .append('pageNumber', pageNumber);
    return this.http.get<Page<AvailableChat>>(this.availableChatsApi + '/' + this.authService.currentUser?.username, {params}).pipe(map(data => data.content));
  }

  getLastMessages(): Observable<LastMessage[]> {
    return this.http.get<LastMessage[]>(this.chatsApi).pipe(tap(data => this.lastMessages = data));
  }

  getChatMessages(to: string): void {
    this.http.get<Page<Message>>(this.chatsApi + '/' + to).subscribe(data => {
      this.messages = data.content;
      this.resetPage();
    });;
  }

  getNextPage(to: string): void {
    const params = new HttpParams()
      .set('page', this.page)
      .set('timestamp', this.timestamp.toUTCString());
    this.http.get<Page<Message>>(this.chatsApi + '/' + to, {params}).pipe(tap(() => this.page++)).subscribe(data => this.messages = this.messages.concat(data.content));
  }

  resetPage(): void {
    this.timestamp = new Date();
    this.page = 1;
  }

  private get username() {
    return this.authService.currentUser?.username;
  }

  private get role() {
    return this.authService.currentUser?.role;
  }

  handleSentMessage(message: MessageSend) {
    let talentUsername;
    let companyUsername;
    if (this.authService.currentUser?.role === 'COMPANY') {
      talentUsername = message.to;
    } else {
      companyUsername = message.to
    };
    const sentMessage = {
      id: 0,
      content: message.content,
      createdBy: message.to === this.authService.currentUser?.username ? this.targetUserRole : this.currentUserRole,
      createdOn: new Date().toUTCString(),
      companyUsername,
      talentUsername,
      seen: false
    }
    this.messages.unshift(sentMessage);
    const removeIndex = this.lastMessages.findIndex(lastMessage => 
      lastMessage.message.companyUsername === message.to || lastMessage.message.talentUsername === message.to
    );
    if (removeIndex >= 0) {
      const companyName = this.lastMessages[removeIndex].companyName;
      const talentName = this.lastMessages[removeIndex].talentName;
      this.lastMessages.splice(removeIndex, 1);
      this.lastMessages.unshift({companyName, talentName, message: sentMessage});
    }
  }

  get currentUserRole(): 'COMPANY' | 'TALENT' {
    return this.authService.currentUser?.role === 'COMPANY' ? 'COMPANY' : 'TALENT';
  }

  get targetUserRole(): 'COMPANY' | 'TALENT' {
    return this.currentUserRole === 'COMPANY' ? 'TALENT' : 'COMPANY';
  }

}
