import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { TimerService } from 'src/app/core/services/timer.service';

@Component({
  selector: 'app-menu-trigger',
  templateUrl: './menu-trigger.component.html',
  styleUrls: ['./menu-trigger.component.scss'],
})
export class MenuTriggerComponent {
  constructor(
    private readonly menuService: MenuService,
    private readonly timerService: TimerService
  ) {}

  public toggleMenu(): void {
    this.menuService.toggle();
  }

  public isWorkMode(): boolean {
    return this.timerService.isWorkMode();
  }

  public isShortBreakMode(): boolean {
    return this.timerService.isShortBreakMode();
  }

  public isLongBreakMode(): boolean {
    return this.timerService.isLongBreakMode();
  }
}
