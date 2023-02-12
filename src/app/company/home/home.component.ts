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
  isLastPage: boolean = false;
  retrievingInProcess: boolean = false;
  currentPage: number = 0;
  selectedCountry?: number;
  showSpinnerPosts: boolean = true;

  constructor(private postService: PostService,
              private locationService: LocationService,
              private authService: AuthService,
              private companyService: CompanyService) { }
  
  ngOnInit(): void {
    this.postService.findGlobal(0).subscribe({
      next: response => {
        this.posts = response.content;
        this.showSpinnerPosts = false;
      },
      error: error => {
        this.showSpinnerPosts = false;
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
    this.posts = [];
    this.selectedPostsType = newPostsType;
    if (newPostsType === PostsType.COUNTRY) {
      this.getCountries();
    }
  }

  getGlobalPosts(page: number) {
    this.showSpinnerPosts = true;
    this.postService.findGlobal(page).subscribe({
      next: response => {
        this.posts.push(...response.content);
        this.currentPage = response.number;
        this.isLastPage = response.last;
        this.retrievingInProcess = false;
        this.showSpinnerPosts = false;
      },
      error: error => {
        this.showSpinnerPosts = false;
      }
    })
  }

  getMyPosts(page: number) {
    if (!this.company?.id) {
      return;
    }
    this.showSpinnerPosts = true;
    this.postService.findByCompany(page, this.company?.id).subscribe({
      next: response => {
        this.posts.push(...response.content);
        this.currentPage = response.number;
        this.isLastPage = response.last;
        this.retrievingInProcess = false;
        this.showSpinnerPosts = false;
      },
      error: error => {
        this.showSpinnerPosts = false;
      }
    })
  }

  selectCountry(event: any) {
    if (event.target.value) {
      this.posts = [];
      this.selectedCountry = event.target.value;
      this.getCountryPosts(0, event.target.value)
    }
  }

  getCountryPosts(page: number, countryId?: number) {
    if (!countryId) {
      return;
    }
    this.showSpinnerPosts = true;
    this.postService.findByCountry(page, countryId).subscribe({
      next: response => {
        this.posts.push(...response.content);
        this.currentPage = response.number;
        this.isLastPage = response.last;
        this.retrievingInProcess = false;
        this.showSpinnerPosts = false;
      },
      error: error => {
        this.showSpinnerPosts = false;
      }
    })
  }

  getFollowingCompaniesPosts(page: number) {
    this.showSpinnerPosts = true;
    this.postService.findFollowingCompaniesPosts(page).subscribe({
      next: response => {
        this.posts.push(...response.content);
        this.currentPage = response.number;
        this.isLastPage = response.last;
        this.retrievingInProcess = false;
        this.showSpinnerPosts = false;
      },
      error: error => {
        this.showSpinnerPosts = false;
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

  getNextPosts() {
    if (this.isLastPage || this.retrievingInProcess) {
      return;
    }
    this.retrievingInProcess = true;
    this.currentPage++;
    if (this.selectedPostsType === PostsType.GLOBAL) {
      this.getGlobalPosts(this.currentPage);
    } else if (this.selectedPostsType === PostsType.COMPANY) {
      this.getFollowingCompaniesPosts(this.currentPage);
    } else if (this.selectedPostsType === PostsType.COUNTRY && this.selectedCountry) {
      this.getCountryPosts(this.currentPage, this.selectedCountry);
    }
  }

  postAdded(newPost: Post) {
    if (this.selectedPostsType === PostsType.COMPANY || this.selectedPostsType === PostsType.GLOBAL || this.selectedCountry === this.company?.location.country.id) {
      this.posts.unshift(newPost);
    }
  }

}
