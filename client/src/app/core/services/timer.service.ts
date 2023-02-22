import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, first, interval, takeUntil } from 'rxjs';
import { Modes, Timers } from 'src/app/shared/constants';
import { ITask } from 'src/app/shared/interfaces/task.interface';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { GraphService } from './graph.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { NotificationTypes } from 'src/app/shared/constants/notification-types';

@Injectable({ providedIn: 'root' })
export class TimerService {
  currentMode$ = new BehaviorSubject<number>(Modes.Work);
  currentTask$ = new BehaviorSubject<ITask | null>(null);

  timeTotal$ = new BehaviorSubject<number>(Timers.Work);
  timeLeft$ = new BehaviorSubject<number>(Timers.Work);

  stopTimer$ = new Subject<void>();
  isTimerRunning$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly tasksService: TasksService,
    private readonly graphService: GraphService,
    private readonly notificationsService: NotificationsService
  ) {}

  public selectTask(id: number): void {
    if (this.isTimerRunning$.value) {
      this.notificationsService.showHideNotification(
        'Timer is running',
        NotificationTypes.Error
      );
      return;
    }

    if (this.currentMode$.value === Modes.Work) {
      this.resetTimer(Timers.Work);
    }

    this.tasksService.tasks$.pipe(first()).subscribe((value) => {
      const task = value.find((task) => task.id === id);
      if (task) {
        this.currentTask$.next(task);
      }
    });
  }

  public deselectTask(): void {
    if (this.isTimerRunning$.value) {
      this.notificationsService.showHideNotification(
        'Timer is running',
        NotificationTypes.Error
      );
      return;
    }

    if (this.currentMode$.value === Modes.Work) {
      this.resetTimer(Timers.Work);
    }

    this.currentTask$.next(null);
  }

  public switchToWork(): void {
    this.currentMode$.next(Modes.Work);
    this.resetTimer(Timers.Work);
  }

  public switchToShortBreak(): void {
    this.currentMode$.next(Modes.ShortBreak);
    this.resetTimer(Timers.ShortBreak);
  }

  public switchToLongBreak(): void {
    this.currentMode$.next(Modes.LongBreak);
    this.resetTimer(Timers.LongBreak);
  }

  public toggleTimer(): void {
    if (
      this.currentMode$.value === Modes.Work &&
      this.currentTask$.value === null
    ) {
      this.notificationsService.showHideNotification(
        'No task selected',
        NotificationTypes.Error
      );
      return;
    }

    if (
      this.currentTask$.value !== null &&
      this.currentTask$.value.ticksDone === this.currentTask$.value.ticksTotal
    ) {
      this.notificationsService.showHideNotification(
        'Task is already been done',
        NotificationTypes.Error
      );
      return;
    }

    if (!this.isTimerRunning$.value) {
      this.isTimerRunning$.next(true);

      interval(1000)
        .pipe(takeUntil(this.stopTimer$))
        .subscribe((_) => {
          this.timeLeft$.next(this.timeLeft$.value - 1);

          if (this.timeLeft$.value === -1) {
            switch (this.currentMode$.value) {
              case Modes.Work:
                if (this.currentTask$.value) {
                  const { ticksDone, ...rest } = this.currentTask$.value;
                  const newTask = { ...rest, ticksDone: ticksDone + 1 };
                  this.tasksService.updateTask(newTask).subscribe({
                    next: (value) => this.currentTask$.next(value),
                  });
                  this.graphService
                    .createWorkLog()
                    .subscribe({ next: () => console.log('Work log created') });

                  if (newTask.ticksDone !== 0 && newTask.ticksDone % 4 === 0) {
                    this.switchToLongBreak();
                  } else {
                    this.switchToShortBreak();
                  }

                  this.notificationsService.showHideNotification(
                    'Work timer completed',
                    NotificationTypes.Success
                  );
                }
                break;
              case Modes.ShortBreak:
                this.graphService.createShortBreakLog().subscribe({
                  next: () => console.log('Short break log created'),
                });
                this.notificationsService.showHideNotification(
                  'Short break is over',
                  NotificationTypes.Info
                );
                this.switchToWork();
                break;
              case Modes.LongBreak:
                this.graphService.createLongBreakLog().subscribe({
                  next: () => console.log('Long break log created'),
                });
                this.notificationsService.showHideNotification(
                  'Long break is over',
                  NotificationTypes.Info
                );
                this.switchToWork();
                break;
              default:
                this.isTimerRunning$.next(false);
                this.stopTimer$.next();
                break;
            }
          }
        });

      return;
    }

    this.isTimerRunning$.next(false);
    this.stopTimer$.next();
  }

  public isWorkMode(): boolean {
    return this.currentMode$.value === Modes.Work;
  }

  public isShortBreakMode(): boolean {
    return this.currentMode$.value === Modes.ShortBreak;
  }

  public isLongBreakMode(): boolean {
    return this.currentMode$.value === Modes.LongBreak;
  }

  private resetTimer(value: number): void {
    this.isTimerRunning$.next(false);
    this.stopTimer$.next();
    this.timeTotal$.next(value);
    this.timeLeft$.next(value);
  }
}
