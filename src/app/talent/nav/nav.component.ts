import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationResponse, NotificationService, NotificationView } from 'src/app/shared/services/notification.service';

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
  requestNotifications: NotificationView[] = []

  constructor(private authService: AuthService,
              private notificationService: NotificationService) { }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.findAllUnseenNotifications(0);
    this.intervalId = setInterval(()=> { this.findAllUnseenNotifications(0) }, this.TIME_INTERVAL_IN_SECONDS);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  findAllUnseenNotifications(page: number) {
    this.notificationService.findAllUnseen(page).subscribe({
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
    this.notificationService.setRequestsToSeen(this.notificationStatus.lastRequestId).subscribe({
      next: response => {
        this.findAllUnseenNotifications(0);
      },
      error: error => {

      }
    })
  }

}
