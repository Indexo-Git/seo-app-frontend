import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'line'
})

export class LinePipe implements PipeTransform {
    transform(value: any): any {
        if (value === null || value === '') {
            return '';
        }
        return value.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
}
