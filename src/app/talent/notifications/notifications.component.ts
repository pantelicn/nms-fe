import { Component, OnInit } from "@angular/core";
import { NotificationInfoView, NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications: NotificationInfoView[] = [];
  isLastPage: boolean = false;
  retrievingInProcess: boolean = false;
  currentPage: number = 0;
  showSpinnerNotifications: boolean = false;

  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.findNotifications(this.currentPage);
  }

  findNotifications(page: number) {
    if (page === 0) {
      this.notifications = [];
    }
    this.notificationService.findAllInfos(this.currentPage).subscribe({
      next: response => {
        this.notifications.push(...response.content);
        this.currentPage = response.number;
        this.isLastPage = response.last;
        this.retrievingInProcess = false;
        this.showSpinnerNotifications = false;
      },
      error: error => {
        this.retrievingInProcess = false;
        this.showSpinnerNotifications = false;
      }
    });
  }

  getNextNotifications() {
    if (this.isLastPage || this.retrievingInProcess) {
      return;
    }
    this.retrievingInProcess = true;
    this.currentPage++;
    this.findNotifications(this.currentPage);
  }

}