import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationTypes } from '../../constants/notification-types';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit {
  message: string = '';
  notificationType!: number;
  notificationTypes = NotificationTypes;

  constructor(private readonly notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  private initializeSubscriptions(): void {
    this.notificationsService.message$.subscribe({
      next: (value) => (this.message = value),
    });
    this.notificationsService.type$.subscribe({
      next: (value) => (this.notificationType = value),
    });
  }

  public onHide(): void {
    this.notificationsService.hideNotification();
  }
}
