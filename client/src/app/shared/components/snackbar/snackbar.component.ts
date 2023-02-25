import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationTypes } from '../../constants/notification-types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit, OnDestroy {
  message: string = '';
  notificationType!: number;
  notificationTypes = NotificationTypes;
  destroy$ = new Subject<void>();

  constructor(private readonly notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSubscriptions(): void {
    this.notificationsService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value) => (this.message = value),
      });
    this.notificationsService.type$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => (this.notificationType = value),
    });
  }

  public onHide(): void {
    this.notificationsService.hideNotification();
  }
}
