import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../../model/post.model';
import { ReactionService } from '../../services/reaction.service';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'nms-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {

  @Input() post!: Post;

  constructor(
    private router: Router,
    private authService: AuthService,
    private reactionService: ReactionService,
    private toastService: ToastService
  ) { }

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

  get showReactions(): boolean {
    return this.authService.currentUser?.role !== 'COMPANY';
  }

  onLike(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/register']);
      return;
    }
    this.reactionService.like(this.post.id).subscribe(() => {
      this.post.likes++;
    }, (err: HttpErrorResponse) => {
      this.toastService.error('Error', err.error.message);
    });
  }

}
