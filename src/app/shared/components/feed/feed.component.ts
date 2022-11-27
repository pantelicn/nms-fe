import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/model';
import { FeedService } from 'src/app/shared/services/feed.service';
import { FollowerService } from '../../services/follower.service';

@Component({
  selector: 'nms-company-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  @Input()
  posts: Post[] = [];
  followCompanies: number[] = [];

  constructor(private followerService: FollowerService) { }

  ngOnInit(): void {
    this.followerService.following().subscribe({
      next: response => {
        this.followCompanies = response;
        console.log(response);
      },
      error: error => {

      }
    })
  }

  followCompany(companyId: number) {
    this.followCompanies.push(companyId);
  }

  unfollowCompany(unfollowCompanyId: number) {
    this.followCompanies = this.followCompanies.filter(companyId => companyId !== unfollowCompanyId);
  }

}
