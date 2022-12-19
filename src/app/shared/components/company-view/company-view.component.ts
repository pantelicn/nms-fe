import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { CompanyService } from "src/app/company/company.service";
import { PublicCompanyService, PublicCompanyView } from "src/app/shared/services/public-company.service";
import { Post } from "../../model/post.model";
import { PostService } from "../../services/post.service";

@Component({
  selector: 'company-view',
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.scss']
})
export class CompanyViewComponent implements OnInit {

  company?: PublicCompanyView;
  posts: Post[] = [];
  isLastPage: boolean = false;
  retrievingInProcess: boolean = false;
  currentPage: number = 0;
  showSpinnerPosts: boolean = true;
  isCompanyLogged: boolean = false;
  loggedCompanyId?: number;

  constructor(private publicCompanyService: PublicCompanyService, 
              private companyService: CompanyService,
              private route: ActivatedRoute,
              private postService: PostService, 
              private authService: AuthService) {}
  
  ngOnInit(): void {
    if (this.authService.currentUser?.role === 'COMPANY') {
      this.companyService.getCompany(this.authService.currentUser.username).subscribe({
        next: response => {
          this.loggedCompanyId = response.id;
        },
        error: error => {

        }
      })
    }
    this.getCompanyData();
    this.getCompanyPosts(0);
  }

  getNextPosts() {
    if (this.isLastPage || this.retrievingInProcess) {
      return;
    }
    this.retrievingInProcess = true;
    this.currentPage++;
    this.getCompanyPosts(this.currentPage);
  }

  getCompanyPosts(page: number) {
    const companyId = Number(this.route.snapshot.paramMap.get('id'));
    if (!companyId) {
      return;
    }
    this.showSpinnerPosts = true;
    this.postService.findByCompany(page, companyId).subscribe({
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

  private getCompanyData() {
    const companyId = Number(this.route.snapshot.paramMap.get('id'));
    if (!companyId) {
      return;
    }
    this.publicCompanyService.getById(companyId).subscribe({
      next: response => {
        this.company = response;
      },
      error: error => {

      }
    })
  }

}