import { Component, Input } from '@angular/core';
import { TimerService } from 'src/app/core/services/timer.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input('index') index: number = 1;
  @Input('id') id: number = 0;
  @Input('name') name: string = '';
  @Input('ticksDone') ticksDone: number = 0;
  @Input('ticksTotal') ticksTotal: number = 1;
  @Input('isSelected') isSelected: boolean = false;

  constructor(private readonly timerService: TimerService) {}

  public onSelect(): void {
    const currentTaskId = this.timerService.currentTask$.value?.id;

    if (currentTaskId && this.id === currentTaskId) {
      this.timerService.deselectTask();
    } else {
      this.timerService.selectTask(this.id);
    }
  }
}
