import { Component, Input } from '@angular/core';
import { Post } from '../../model/post.model';

@Component({
  selector: 'nms-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {

  @Input() post!: Post;

  constructor() { }

  get createdOn(): string {
    return new Date(this.post.createdOn).toDateString();
  }

  get liked(): boolean {
    return false;
  }

  get likes(): number {
    return 1000;
  }

}
