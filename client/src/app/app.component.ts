import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';

import { NotificationsService } from './shared/services/notifications.service';
import { GraphService } from './core/services/graph.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isNotificationShown: boolean = true;

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

  private initializeSubscription(): void {
    this.notificationsService.isShown$.subscribe({
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
