import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/model';
import { FeedService } from 'src/app/shared/services/feed.service';

@Component({
  selector: 'nms-company-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  @Input()
  posts: Post[] = [];

  constructor() { }

  ngOnInit(): void {
    
  }

}
