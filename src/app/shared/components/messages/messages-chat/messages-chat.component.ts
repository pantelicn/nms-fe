import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { Message } from 'src/app/shared/model';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'nms-messages-chat',
  templateUrl: './messages-chat.component.html',
  styleUrls: ['./messages-chat.component.scss']
})
export class MessagesChatComponent implements OnInit, OnDestroy {

  search = new FormControl('');
  private subscription!: Subscription;

  @Input()
  to!: string;

  @Input()
  searchingUser = false;

  @Input()
  newChatOpened!: Subject<Message[]>;

  @Output()
  onSearch = new EventEmitter<string>();

  @Output()
  onStartSearch = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef, private chatService: ChatService) { }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.subscription = this.search.valueChanges.pipe(debounceTime(500)).subscribe(
      data => this.onSearch.emit(data)
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onScrollUp(): void {
    this.chatService.getNextPage(this.to);
  }

  startSearch(): void {
    this.search.setValue('');
    this.onStartSearch.emit();
  }

  get messages(): Message[] {
    return this.chatService.messages;
  }

}
