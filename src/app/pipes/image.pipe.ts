import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICES } from '../config/config';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, type: string = 'user'): any {

    let url = URL_SERVICES + 'img';

    if (!img) {
      return url + '/users/no-img';
    }

    if ( img.indexOf('https') >= 0) {
      return img;
    }

    switch (type) {
      case 'user':
        url += '/users/' + img;
      break;

      default:
      console.log('Type of file doesn\'t not exist');
    }

    return url;
  }

}
