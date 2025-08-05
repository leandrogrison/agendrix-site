import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeInline'
})
export class TimeInlinePipe implements PipeTransform {

  transform(valor: string): string {
    const [horas, minutos, segundos] = valor.split(':').map(Number);
    if (horas === 0 && minutos === 0) {
      return 'Tempo não informado';
    }
    const hour = horas > 0 ? `${horas} hora${horas > 1 ? 's' : ''}` : '';
    const minute = minutos > 0 ? `${minutos} minuto${minutos > 1 ? 's' : ''}` : '';

    return `${hour} ${minute}`;
  }

}
