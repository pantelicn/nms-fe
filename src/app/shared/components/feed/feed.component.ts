import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/shared/model';
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
  @Input()
  likedPosts: number[] = [];
  @Input()
  loggedCompanyId?: number;
  @Input()
  isLastPage: boolean = false;
  @Output()
  scrollChange = new EventEmitter<void>();

  constructor(private followerService: FollowerService, 
              private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.followerService.following().subscribe({
        next: response => {
          this.followCompanies = response;
        },
        error: error => {
  
        }
      })
    }
  }

  followCompany(companyId: number) {
    this.followCompanies.push(companyId);
  }

  unfollowCompany(unfollowCompanyId: number) {
    this.followCompanies = this.followCompanies.filter(companyId => companyId !== unfollowCompanyId);
  }

  addLikedPost(postId: number) {
    this.likedPosts.push(postId);
  }

  removeLikedPost(unlikedPostId: number) {
    this.likedPosts = this.likedPosts.filter(postId => postId !== unlikedPostId);
  }

  onScroll() {
    if (!this.isLastPage) {
      this.scrollChange.emit();
    }
  }

}
