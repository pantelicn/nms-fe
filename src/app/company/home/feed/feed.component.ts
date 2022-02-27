import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/model';
import { FeedService } from 'src/app/shared/services/feed.service';

@Component({
  selector: 'nms-company-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  posts: Post[] = [];

  constructor(private service: FeedService) { }

  ngOnInit(): void {
    this.service.getLatest10ByCountry('Serbia').subscribe(
      posts => this.posts = posts
    );
  }

}
