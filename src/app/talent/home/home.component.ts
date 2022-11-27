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

  constructor(private talentService: TalentService,
              private postService: PostService,
              private locationService: LocationService) {}

  ngOnInit(): void {
    this.initTalent();
    this.getGlobalPosts(0);
    this.getCountries();
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

  selectCountry(event: any) {
    if (event.target.value) {
      this.getCountryPosts(0, event.target.value)
    }
  }

  getCountryPosts(page: number, countryId?: number) {
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

  getFollowingCompaniesPosts(page: number) {
    this.postService.findFollowingCompaniesPosts(page).subscribe({
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

  private initTalent():void {
    this.talentService.getTalent().subscribe({
      next: response => {
        this.talent = response;
      },
      error: error => {

      }
    });
  }

}