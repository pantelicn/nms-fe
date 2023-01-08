import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/model/post.model';
import { Talent } from 'src/app/shared/model/talent.model';
import { FeedService } from '../../shared/services/feed.service';

@Component({
  selector: 'nms-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class PublicFeedComponent implements OnInit {

  posts: Post[] = [];
  talents: Talent[] = [];

  constructor(private service: FeedService) { }

  ngOnInit(): void {
    this.service.getLatest10ByCountry('Serbia').subscribe(posts => this.posts = posts);
    this.service.getLatest10Talents().subscribe(talents => this.talents = talents);
  }

}
