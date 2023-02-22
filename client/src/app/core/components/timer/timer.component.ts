import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { CommonModule } from '@angular/common';
import { SecsToTimeFormatPipe } from '../../pipes/secs-to-time-format.pipe';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  standalone: true,
  imports: [CommonModule, SecsToTimeFormatPipe],
})
export class TimerComponent implements OnInit {
  timeLeft: number = 0;
  timeTotal: number = 0;
  taskName: string = '';
  isTimerRunning: boolean = false;
  overlayCounter: number = 0;
  transitionReset: boolean = false;

  @ViewChild('partOne', { static: true }) partOne!: ElementRef;
  @ViewChild('partTwo', { static: true }) partTwo!: ElementRef;
  @ViewChild('partThree', { static: true }) partThree!: ElementRef;
  @ViewChild('partFour', { static: true }) partFour!: ElementRef;
  @ViewChild('overlay', { static: true }) overlay!: ElementRef;

  constructor(
    private readonly timerService: TimerService,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  private initializeSubscriptions(): void {
    this.timerService.timeTotal$.subscribe({
      next: (value) => (this.timeTotal = value),
    });
    this.timerService.timeLeft$.subscribe({
      next: (value) => {
        this.timeLeft = value;

        if (this.timeTotal !== 0) {
          const percentage = (100 * this.timeLeft) / this.timeTotal;
          if (percentage >= 0) {
            this.animateTimer(percentage);
          } else {
            this.resetTimerStyles();
          }
        }
      },
    });
    this.timerService.currentTask$.subscribe({
      next: (value) => {
        if (value) {
          this.taskName = value.name;
        } else {
          this.taskName = 'Select a Task';
        }
        this.resetTimerStyles();
      },
    });
    this.timerService.isTimerRunning$.subscribe({
      next: (value) => (this.isTimerRunning = value),
    });
    this.timerService.currentMode$.subscribe({
      next: () => this.resetTimerStyles(),
    });
  }

  private animateTimer(percentage: number): void {
    let step = 360 - (360 * percentage) / 100;

    if (percentage <= 100) {
      this.renderer.setStyle(
        this.partOne.nativeElement,
        'transform',
        `rotate(${180 - step}deg)`
      );
    }

    if (this.overlayCounter === 90) {
      this.renderer.addClass(this.overlay.nativeElement, 'in-front');
    }

    if (percentage < 75 && this.overlayCounter !== 90) {
      if (90 - this.overlayCounter < step) {
        this.overlayCounter = 90;
        this.renderer.setStyle(
          this.overlay.nativeElement,
          'transform',
          `rotate(-${180}deg)`
        );
      } else {
        this.renderer.setStyle(
          this.overlay.nativeElement,
          'transform',
          `rotate(-${90 + step}deg)`
        );
        this.overlayCounter += step;
      }
    }

    if (percentage <= 75) {
      this.renderer.setStyle(
        this.partTwo.nativeElement,
        'transform',
        `rotate(${180 - step}deg)`
      );
    }

    if (percentage <= 50) {
      this.renderer.setStyle(
        this.partThree.nativeElement,
        'transform',
        `rotate(${180 - step}deg)`
      );
    }

    if (percentage <= 25) {
      this.renderer.setStyle(
        this.partFour.nativeElement,
        'transform',
        `rotate(${180 - step}deg)`
      );
    }
  }

  private resetTimerStyles(): void {
    this.renderer.removeAttribute(this.partOne.nativeElement, 'style');
    this.renderer.removeAttribute(this.partTwo.nativeElement, 'style');
    this.renderer.removeAttribute(this.partThree.nativeElement, 'style');
    this.renderer.removeAttribute(this.partFour.nativeElement, 'style');
    this.renderer.removeClass(this.overlay.nativeElement, 'in-front');
    this.renderer.removeAttribute(this.overlay.nativeElement, 'style');
    this.overlayCounter = 0;
  }

  public onToggleTimer(): void {
    this.timerService.toggleTimer();
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
