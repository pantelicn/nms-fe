import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService, NotificationView } from 'src/app/shared/services/notification.service';

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

  constructor(private authService: AuthService,
              private notificationService: NotificationService) { }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.findAllNotifications(0);
    this.intervalId = setInterval(()=> { this.findAllNotifications(0) }, this.TIME_INTERVAL_IN_SECONDS);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  findAllNotifications(page: number) {
    this.notificationService.findAll(page).subscribe({
      next: response => {
        this.notifications = response.content;
        this.notifications.forEach(notification => {
          if (!notification.sean) {
            this.numberOfunseenNotifications++;
          }
        })
      },
      error: error => {

      }
    })
  }

}
