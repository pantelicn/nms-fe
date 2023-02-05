import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, OperatorFunction, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationResponse, NotificationService, NotificationType, NotificationView } from 'src/app/shared/services/notification.service';
import { PublicCompanyService, PublicCompanyView } from 'src/app/shared/services/public-company.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'nms-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  private readonly TIME_INTERVAL_IN_SECONDS: number = 60000; // 60 seconds

  intervalId: any;
  notifications: NotificationView[] = [];
  numberOfunseenNotifications = 0;
  notificationStatus?: NotificationResponse;
  requestNotifications: NotificationView[] = [];
  searching: boolean = false;
  searchFailed: boolean = false;
  companyStartsWith: any;

  constructor(private authService: AuthService,
              private notificationService: NotificationService,
              private publicCompanyService: PublicCompanyService, 
              private router: Router) { }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.findAll(0);
    this.intervalId = setInterval(()=> { this.findAll(0) }, this.TIME_INTERVAL_IN_SECONDS);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  search: OperatorFunction<string, readonly PublicCompanyView[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.publicCompanyService.findByNameStartsWith(term, 0).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }),
        ),
      ),
      tap(() => (this.searching = false)),
    );

  formatter = (x: { name: string }) => x.name;

  openCompanyProfile(id: number) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['talent/companies/' + id]));
  }

  findAll(page: number) {
    this.notificationService.findAll(page).subscribe({
      next: response => {
        this.notificationStatus = response;
      },
      error: error => {

      }
    })
  }

  setRequestsToSeen() {
    if (!this.notificationStatus || this.notificationStatus.unseenRequests === 0 || !this.notificationStatus.lastRequestId) {
      return;
    }
    this.notificationService.setNotificationToSeen(this.notificationStatus.lastRequestId, NotificationType.REQUEST).subscribe({
      next: response => {
        this.findAll(0);
      },
      error: error => {

      }
    })
  }

  setMessagesToSeen() {
    if (!this.notificationStatus || this.notificationStatus.unseenMessages === 0 || !this.notificationStatus.lastMessageId) {
      return;
    }
    this.notificationService.setNotificationToSeen(this.notificationStatus.lastMessageId, NotificationType.MESSAGE).subscribe({
      next: response => {
        this.findAll(0);
      },
      error: error => {

      }
    })
  }

  setInfoNotificationsToSeen() {
    if (!this.notificationStatus || this.notificationStatus.unseenInfoNotifications === 0 || !this.notificationStatus.lastInfoNotificationId) {
      return;
    }
    this.notificationService.setNotificationToSeen(this.notificationStatus.lastInfoNotificationId, NotificationType.INFO).subscribe({
      next: response => {
        this.findAll(0);
      },
      error: error => {

      }
    })
  }

  getImageUrl(profileImage: string): string {
    return environment.api.images + profileImage;
  }

}
