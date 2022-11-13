import { Component, OnInit } from "@angular/core";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.notificationService.findAllInfos(0).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }

}