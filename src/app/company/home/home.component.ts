import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Company, Country, Post } from 'src/app/shared/model';
import { PostsType } from 'src/app/shared/model/posts-type.enum';
import { LocationService } from 'src/app/shared/services/location.service';
import { PostService } from 'src/app/shared/services/post.service';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  remainingPosts: number = 0;
  posts: Post[] = [];
  selectedPostsType: PostsType = PostsType.GLOBAL;
  postsType = PostsType;
  countries: Country[] = [];
  company?: Company;

  constructor(private postService: PostService,
              private locationService: LocationService,
              private authService: AuthService,
              private companyService: CompanyService) { }
  
  ngOnInit(): void {
    this.postService.findGlobal(0).subscribe({
      next: response => {
        this.posts = response.content;
      },
      error: error => {

      }
    });
    const username = this.authService.currentUser?.username;
    if (username) {
      this.companyService.getCompany(username).subscribe(
        company => this.company = company
      );
    }
  }

  decreaseRemainingPosts() {
    this.remainingPosts = this.remainingPosts - 1;
  }

  setRemainingPosts(remainingPosts: any) {
    this.remainingPosts = remainingPosts;
  }

  setPostsType(newPostsType: PostsType) {
    this.selectedPostsType = newPostsType;
    if (newPostsType === PostsType.COUNTRY) {
      this.getCountries();
    }
  }

  getGlobalPosts(page: number) {
    this.postService.findGlobal(page).subscribe({
      next: response => {
        this.posts = response.content;
      },
      error: error => {

      }
    })
  }

  getMyPosts(page: number) {
    if (!this.company?.id) {
      return;
    }
    this.postService.findByCompany(page, this.company?.id).subscribe({
      next: response => {
        this.posts = response.content;
      },
      error: error => {

      }
    })
  }

  selectCountry(event: any) {
    if (event.target.value) {
      this.getCountryPosts(0, event.target.value)
    }
  }

  getCountryPosts(page: number, countryId?: number) {
    console.log(countryId);
    if (!countryId) {
      return;
    }
    this.postService.findByCountry(page, countryId).subscribe({
      next: response => {
        this.posts = response.content;
      },
      error: error => {

      }
    })
  }

  private getCountries() {
    this.locationService.getCountries().subscribe({
      next: response => {
        this.countries = response;
      },
      error: error => {

      }
    })
  }

}
