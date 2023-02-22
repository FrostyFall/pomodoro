import { Component, OnInit } from '@angular/core';
import { TimerComponent } from '../../components/timer/timer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { MenuService } from 'src/app/shared/services/menu.service';
import { Pages } from 'src/app/shared/constants';

@Component({
  selector: 'app-timer-page',
  templateUrl: './timer-page.component.html',
  styleUrls: ['./timer-page.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, TimerComponent],
})
export class TimerPageComponent implements OnInit {
  constructor(private readonly menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.togglePage(Pages.Timer);
  }
}
