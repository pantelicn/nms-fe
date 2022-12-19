import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, tap, switchMap, catchError, of } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { NotificationResponse, NotificationService, NotificationType } from "src/app/shared/services/notification.service";
import { PublicCompanyService, PublicCompanyView } from "src/app/shared/services/public-company.service";

@Component({
    selector: 'company-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent {
    
    private readonly TIME_INTERVAL_IN_SECONDS: number = 60000; // 60 seconds

    intervalId: any;
    numberOfunseenNotifications = 0;
    notificationStatus?: NotificationResponse;
    searching: boolean = false;
    searchFailed: boolean = false;
    companyStartsWith: any;

    constructor(private authService: AuthService, 
                private notificationService: NotificationService, 
                public router: Router,
                private publicCompanyService: PublicCompanyService) { }

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
      this.router.navigate(['company/' + id]));
    }

    onLogout(): void {
        this.authService.logout();
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

}