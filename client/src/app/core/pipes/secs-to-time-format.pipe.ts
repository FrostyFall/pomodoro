import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secsToTimeFormat',
  standalone: true,
})
export class SecsToTimeFormatPipe implements PipeTransform {
  transform(value: number, ..._: unknown[]): string {
    let mins: number | string = Math.floor(value / 60);
    let secs: number | string = Math.floor(value % 60);

    if (mins < 10) {
      mins = `0${mins}`;
    }
    if (secs < 10) {
      secs = `0${secs}`;
    }

    return `${mins}:${secs}`;
  }
}
