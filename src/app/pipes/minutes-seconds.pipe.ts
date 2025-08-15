import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesSeconds'
})
export class MinutesSecondsPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value) || value < 0) {
      return '00:00';
    }

    const minutes: number = Math.floor(value / 60);
    const seconds: number = value % 60;

    const formattedMinutes: string = String(minutes).padStart(2, '0');
    const formattedSeconds: string = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }

}
