import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  remainingPosts: number = 0;

  constructor() { }

  decreaseRemainingPosts() {
    this.remainingPosts = this.remainingPosts - 1;
  }

  setRemainingPosts(remainingPosts: any) {
    this.remainingPosts = remainingPosts;
  }

}
