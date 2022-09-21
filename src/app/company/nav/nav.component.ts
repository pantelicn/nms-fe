import { Component } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { NotificationResponse, NotificationService, NotificationType } from "src/app/shared/services/notification.service";

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

    constructor(private authService: AuthService, 
                private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.findAll(0);
        this.intervalId = setInterval(()=> { this.findAll(0) }, this.TIME_INTERVAL_IN_SECONDS);
      }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
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

}