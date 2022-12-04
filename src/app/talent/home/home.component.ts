import { Component, OnInit } from "@angular/core";
import { Country, Post, Talent } from "src/app/shared/model";
import { PostsType } from "src/app/shared/model/posts-type.enum";
import { LocationService } from "src/app/shared/services/location.service";
import { PostService } from "src/app/shared/services/post.service";
import { TalentService } from "../talent.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  talent?: Talent;
  posts: Post[] = [];
  selectedPostsType: PostsType = PostsType.GLOBAL;
  postsType = PostsType;
  countries: Country[] = [];
  currentPage: number = 0;
  isLastPage: boolean = false;
  selectedCountry?: number;
  retrievingInProcess: boolean = false;

  constructor(private talentService: TalentService,
              private postService: PostService,
              private locationService: LocationService) {}

  ngOnInit(): void {
    this.initTalent();
    this.getGlobalPosts(0);
    this.getCountries();
  }

  setPostsType(newPostsType: PostsType) {
    this.posts = [];
    this.selectedPostsType = newPostsType;
    if (newPostsType === PostsType.COUNTRY) {
      this.getCountries();
    }
  }

  getGlobalPosts(page: number) {
    this.postService.findGlobal(page).subscribe({
      next: response => {
        this.posts.push(...response.content);
        this.currentPage = response.number;
        this.isLastPage = response.last;
        this.retrievingInProcess = false;
      },
      error: error => {

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
    this.postService.findByCountry(page, countryId).subscribe({
      next: response => {
        this.posts.push(...response.content);
        this.currentPage = response.number;
        this.isLastPage = response.last;
        this.retrievingInProcess = false;
      },
      error: error => {

      }
    })
  }

  getFollowingCompaniesPosts(page: number) {
    this.postService.findFollowingCompaniesPosts(page).subscribe({
      next: response => {
        this.posts.push(...response.content);
        this.currentPage = response.number;
        this.isLastPage = response.last;
        this.retrievingInProcess = false;
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

  private initTalent():void {
    this.talentService.getTalent().subscribe({
      next: response => {
        this.talent = response;
      },
      error: error => {

      }
    });
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

}