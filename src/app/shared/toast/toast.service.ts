import { Injectable } from '@angular/core';
import { Toast } from './toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: Toast[] = [];

  constructor() { }

  show(header: string, body: string): void {
    this.toasts.push({header, body, color: 'primary'});
  }

  error(header: string, body: string): void {
    this.toasts.push({header, body, color: 'error'});
  }

  warning(header: string, body: string): void {
    this.toasts.push({header, body, color: 'warning'});
  }

  remove(toast: Toast): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

}
