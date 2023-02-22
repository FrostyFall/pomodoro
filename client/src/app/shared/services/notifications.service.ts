import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NotificationTypes } from '../constants/notification-types';
import { GraphService } from 'src/app/core/services/graph.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  isShownSource$ = new BehaviorSubject<boolean>(false);
  isShown$ = this.isShownSource$.asObservable();
  message$ = new BehaviorSubject<string>('Notification');
  type$ = new BehaviorSubject<number>(NotificationTypes.Info);

  timeout: any | null = null;

  constructor(private readonly graphService: GraphService) {}

  public showHideNotification(message: string, type: NotificationTypes): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.setMessage(message);
    this.isShownSource$.next(true);
    this.type$.next(type);

    this.graphService.sendNotification(message).subscribe();

    this.timeout = setTimeout(() => {
      this.isShownSource$.next(false);
      this.timeout = null;
    }, 5000);
  }

  public hideNotification(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.isShownSource$.next(false);
  }

  private setMessage(newMessage: string) {
    this.message$.next(newMessage);
  }
}
