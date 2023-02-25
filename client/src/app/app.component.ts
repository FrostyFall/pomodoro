import { Component, OnDestroy, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';

import { NotificationsService } from './shared/services/notifications.service';
import { GraphService } from './core/services/graph.service';
import { environment } from 'src/environments/environment.development';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isNotificationShown: boolean = true;
  destroy$ = new Subject<void>();

  readonly vapidPublicKey = environment.vapidPublicKey;

  constructor(
    private notificationsService: NotificationsService,
    private swPush: SwPush,
    private graphService: GraphService
  ) {}

  ngOnInit(): void {
    this.initializeSubscription();
    this.subscribeToNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSubscription(): void {
    this.notificationsService.isShown$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value) => {
          this.isNotificationShown = value;
        },
      });
  }

  public subscribeToNotifications(): void {
    if (!this.swPush.isEnabled) {
      console.warn('Notifications are not enabled');
      return;
    }

    this.swPush
      .requestSubscription({ serverPublicKey: this.vapidPublicKey })
      .then((sub: PushSubscription) => {
        this.graphService
          .storeNotificationsSub(JSON.stringify(sub))
          .subscribe();
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }
}
