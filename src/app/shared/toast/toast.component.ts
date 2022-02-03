import { Component } from '@angular/core';
import { Toast } from './toast';
import { ToastService } from './toast.service';

@Component({
  selector: 'nms-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  constructor(private toastService: ToastService) { }

  get toasts(): Toast[] {
    return this.toastService.toasts;
  }

  removeToast(toast: Toast) {
    this.toastService.remove(toast);
  }

}
