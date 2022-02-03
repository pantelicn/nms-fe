import { Injectable } from '@angular/core';
import { Toast } from './toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: Toast[] = [];

  constructor() { }

  show(header: string, body: string): void {
    this.toasts.push({header, body});
  }

  remove(toast: Toast): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
