import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../model/post.model';

@Component({
  selector: 'nms-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {

  @Input() post!: Post;

  constructor(private router: Router) { }

  get isLoggedIn(): boolean {
    // TODO: Check if the user is logged in
    return false;
  }

  get createdOn(): string {
    return new Date(this.post.createdOn).toDateString();
  }

  get liked(): boolean {
    return false;
  }

  get likes(): number {
    return 1000;
  }

  onLike(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/register/talent']);
    }
  }

}
