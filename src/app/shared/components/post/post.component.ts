import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../../model/post.model';
import { FollowerService } from '../../services/follower.service';
import { ReactionService } from '../../services/reaction.service';
import { ToastService } from '../../toast/toast.service';
import { LinkPreviewService } from '../link-preview/link-preview.service';

@Component({
  selector: 'nms-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post!: Post;
  contentUrls!: string[];
  @Input()
  isFollowing: boolean = false;
  @Input()
  isLiked: boolean = false;
  @Output()
  followChange = new EventEmitter<number>();
  @Output()
  unfollowChange = new EventEmitter<number>();
  @Output()
  likeChange = new EventEmitter<number>();
  @Output()
  unlikeChange = new EventEmitter<number>();
  @Input()
  loggedCompanyId?: number;

  constructor(
    private router: Router,
    private authService: AuthService,
    private reactionService: ReactionService,
    private toastService: ToastService,
    private linkPreviewService: LinkPreviewService,
    private followerService: FollowerService
  ) { }

  ngOnInit(): void {
    this.contentUrls = this.linkPreviewService.parseUrls(this.post.content);
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  get createdOn(): string {
    return new Date(this.post.createdOn).toDateString();
  }

  get liked(): boolean {
    return false;
  }

  get likes(): number {
    return this.post.likes;
  }

  onLike(): void {
    if (!this.authService.currentUser) {
      this.router.navigate(['/register']);
      return;
    }
    this.reactionService.like(this.post.id).subscribe(() => {
      this.post.likes++;
      this.likeChange.emit(this.post.id);
    }, (err: HttpErrorResponse) => {
      this.toastService.error('Error', err.error.message);
    });
  }

  onUnlike(): void {
    if (!this.authService.currentUser) {
      this.router.navigate(['/register']);
      return;
    }
    this.reactionService.unlike(this.post.id).subscribe({
      next: response => {
        this.post.likes--;
        this.unlikeChange.emit(this.post.id);
      },
      error: error => {
        this.toastService.error('Error', error.error.message);
      }
    })
  }

  follow(companyId: number) {
    this.followerService.follow(companyId).subscribe({
      next: response => {
        this.followChange.emit(companyId);
      },
      error: error => {

      }
    })
  }

  unfollow(companyId: number) {
    this.followerService.unfollow(companyId).subscribe({
      next: response => {
        this.unfollowChange.emit(companyId);
      },
      error: error => {

      }
    });
  }

}
