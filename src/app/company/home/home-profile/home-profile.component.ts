import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from 'src/app/shared/model';
import { ProductUsageService } from 'src/app/shared/services/product-usage.service';
import { environment } from 'src/environments/environment';
import { CompanyService } from '../../company.service';

@Component({
  selector: 'nms-home-profile',
  templateUrl: './home-profile.component.html',
  styleUrls: ['./home-profile.component.scss']
})
export class HomeProfileComponent implements OnInit {

  @Input()
  company?: Company;
  @Input() remainingPosts: number = 0;
  @Output() remainingPostsChange = new EventEmitter<number>();
  @Output() remainingPostsLoadingChange = new EventEmitter<boolean>();

  constructor(private authService: AuthService,
              private productUsageService: ProductUsageService) { }

  ngOnInit(): void {
    this.productUsageService.getRemainingPosts().subscribe(
      remainingPosts => {
        
      }
    )
    this.productUsageService.getRemainingPosts().subscribe({
      next: remainingPosts => {
        this.remainingPosts = remainingPosts;
        this.remainingPostsChange.emit(remainingPosts);
        this.remainingPostsLoadingChange.emit(false);
      },
      error: error => {
        this.remainingPostsLoadingChange.emit(false);
      }
    })
  }

  get username(): string | undefined {
    return this.authService.currentUser?.username;
  }

  getImageUrl(profileImage: string): string {
    return environment.api.images + profileImage;
  }
  
}
