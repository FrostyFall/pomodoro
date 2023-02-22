import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Pages } from '../constants';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private isOpenSource$ = new BehaviorSubject<boolean>(false);
  private currentPageSource$ = new BehaviorSubject(Pages.Timer);
  isOpen$ = this.isOpenSource$.asObservable();
  currentPage$ = this.currentPageSource$.asObservable();

  public toggle(): void {
    this.isOpenSource$.next(!this.isOpenSource$.value);
  }

  public togglePage(page: number): void {
    this.currentPageSource$.next(page);
  }
}
