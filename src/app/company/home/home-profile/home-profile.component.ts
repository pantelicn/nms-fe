import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from 'src/app/shared/model';
import { ProductUsageService } from 'src/app/shared/services/product-usage.service';
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

  constructor(private authService: AuthService,
              private productUsageService: ProductUsageService) { }

  ngOnInit(): void {
    this.productUsageService.getRemainingPosts().subscribe(
      remainingPosts => {
        this.remainingPosts = remainingPosts;
        this.remainingPostsChange.emit(remainingPosts);
      }
    )
  }

  get username(): string | undefined {
    return this.authService.currentUser?.username;
  }
  
}
