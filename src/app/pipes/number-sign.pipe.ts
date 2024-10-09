import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSign'
})
export class NumberSignPipe implements PipeTransform {

  transform(value: any): any {
    if (value > 0) {
      return '+' + value;
    }
    return value;
  }

}
