import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keywordURL'
})
export class KeywordURLPipe implements PipeTransform {

  transform(value: any): any {
    return value.replace(/ /g, '%20');
  }

}
