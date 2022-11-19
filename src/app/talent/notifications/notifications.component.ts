import { Component, OnInit } from "@angular/core";
import { NotificationInfoView, NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications: NotificationInfoView[] = [];

  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.notificationService.findAllInfos(0).subscribe({
      next: response => {
        this.notifications = response.content;
      },
      error: error => {
      }
    })
  }

}