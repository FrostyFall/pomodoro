import { Pipe, PipeTransform } from '@angular/core';
import { ITask } from '../interfaces/task.interface';

@Pipe({ name: 'orderById' })
export class OrderByIdPipe implements PipeTransform {
  transform(value: ITask[]) {
    if (!Array.isArray(value)) {
      return;
    }

    const arr = [...value];

    arr.sort((a: ITask, b: ITask) => {
      if (a.id < b.id) {
        return -1;
      } else if (a.id > b.id) {
        return 1;
      } else {
        return 0;
      }
    });

    return arr;
  }
}
