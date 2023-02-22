import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TimerService } from 'src/app/core/services/timer.service';

@Injectable({ providedIn: 'root' })
export class NavigateRouteGuard implements CanActivate {
  constructor(private timerService: TimerService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return !this.timerService.isTimerRunning$.getValue();
  }
}
