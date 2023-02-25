import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { TasksService } from '../../services/tasks.service';
import { MenuService } from '../../services/menu.service';
import { TimerService } from 'src/app/core/services/timer.service';
import { ITask } from '../../interfaces/task.interface';
import { Pages, Timers } from '../../constants';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  isClosed: boolean = false;
  isHidden: boolean = false;
  tasks$!: Observable<ITask[]>;
  tasks: ITask[] = [];
  currentTaskId: number | undefined = undefined;
  link: string = '/graph';
  ticksDone: number = 0;
  ticksTotal: number = 0;
  destroy$ = new Subject<void>();

  constructor(
    private readonly tasksService: TasksService,
    private readonly menuService: MenuService,
    private readonly timerService: TimerService
  ) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSubscriptions(): void {
    this.menuService.currentPage$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        switch (value) {
          case Pages.Graph:
            this.link = '/timer';
            break;
          case Pages.Timer:
            this.link = '/graph';
            break;
          default:
            this.link = '/timer';
            break;
        }
      },
    });
    this.tasksService.tasks$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        this.tasks = value;
        this.ticksDone = 0;
        this.ticksTotal = 0;
        this.tasks.forEach((task: ITask) => {
          this.ticksDone += task.ticksDone;
          this.ticksTotal += task.ticksTotal;
        });
      },
    });
    this.timerService.currentTask$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        if (value?.id) {
          this.currentTaskId = value.id;
        } else {
          this.currentTaskId = -1;
        }
      },
    });
    this.menuService.isOpen$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        if (!value) {
          this.isClosed = true;
          setTimeout(() => (this.isHidden = true), 300);
        } else {
          this.isHidden = false;
          setTimeout(() => (this.isClosed = false), 0);
        }
      },
    });
  }

  public closeMenu(): void {
    this.menuService.toggle();
  }

  public isWorkMode(): boolean {
    return this.timerService.isWorkMode();
  }

  public isShortBreak(): boolean {
    return this.timerService.isShortBreakMode();
  }

  public isLongBreak(): boolean {
    return this.timerService.isLongBreakMode();
  }

  public onWorkReset(): void {
    if (this.timerService.timeLeft$.value === Timers.Work) {
      console.log('Already reset, dumbass');
      return;
    }

    this.onWork();
  }

  public onShortBreakReset(): void {
    if (this.timerService.timeLeft$.value === Timers.ShortBreak) {
      console.log('Already reset, dumbass');
      return;
    }

    this.onShortBreak();
  }

  public onLongBreakReset(): void {
    if (this.timerService.timeLeft$.value === Timers.LongBreak) {
      console.log('Already reset, dumbass');
      return;
    }

    this.onLongBreak();
  }

  public onWork(): void {
    this.timerService.switchToWork();
  }

  public onShortBreak(): void {
    this.timerService.switchToShortBreak();
  }

  public onLongBreak(): void {
    this.timerService.switchToLongBreak();
  }

  public identify(_: number, item: ITask): number {
    return item.id;
  }
}
