import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { Post } from '../../model/post.model';
import { FollowerService } from '../../services/follower.service';
import { PostReactionType, ReactionService } from '../../services/reaction.service';
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
  @Input()
  isAwardGiven: boolean = false;
  @Output()
  followChange = new EventEmitter<number>();
  @Output()
  unfollowChange = new EventEmitter<number>();
  @Output()
  likeChange = new EventEmitter<number>();
  @Output()
  unlikeChange = new EventEmitter<number>();
  @Output()
  giveAwardChange = new EventEmitter<number>();
  @Output()
  removeAwardChange = new EventEmitter<number>();
  @Input()
  loggedCompanyId?: number;
  @Input()
  isLogged: boolean = false;

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

  get awards(): number {
    return this.post.awards;
  }

  onLike(): void {
    if (!this.authService.currentUser) {
      this.router.navigate(['/register']);
      return;
    }
    this.reactionService.react(this.post.id, PostReactionType.LIKE).subscribe(() => {
      this.post.likes++;
      this.likeChange.emit(this.post.id);
    }, (err: HttpErrorResponse) => {
      this.toastService.error('Error', 'Try again later!');
    });
  }

  onGiveAward(): void {
    if (!this.authService.currentUser) {
      this.router.navigate(['/register']);
      return;
    }
    this.reactionService.react(this.post.id, PostReactionType.AWARD).subscribe(() => {
      this.post.awards++;
      this.giveAwardChange.emit(this.post.id);
    }, (err: HttpErrorResponse) => {
      this.toastService.error('Error', 'Try again later!');
    });
  }

  onUndoReward(): void {
    if (!this.authService.currentUser) {
      this.router.navigate(['/register']);
      return;
    }
    this.reactionService.undoReact(this.post.id, PostReactionType.AWARD).subscribe({
      next: response => {
        this.post.awards--;
        this.removeAwardChange.emit(this.post.id);
      },
      error: error => {
        this.toastService.error('Error', 'Try again later!');
      }
    })
  }

  onUnlike(): void {
    if (!this.authService.currentUser) {
      this.router.navigate(['/register']);
      return;
    }
    this.reactionService.undoReact(this.post.id, PostReactionType.LIKE).subscribe({
      next: response => {
        this.post.likes--;
        this.unlikeChange.emit(this.post.id);
      },
      error: error => {
        this.toastService.error('Error', 'Try again later!');
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

  getImageUrl(profileImage: string): string {
    return environment.api.images + profileImage;
  }

}
