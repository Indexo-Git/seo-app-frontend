import { Injectable } from '@angular/core';
import { URL_SERVICES } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  upload ( file: File, type: string, id: string ) {

    return new Promise ( (resole, reject ) => {
      // Vanilla Javascript
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('image', file, file.name );

      xhr.onreadystatechange = function() {
        if ( xhr.readyState === 4) {

          if (xhr.status === 200) {
            console.log('uploaded image');
            resole( JSON.parse(xhr.response) );
          } else {
            console.log('upload fail');
            reject( xhr.response );
          }
        }
      };

      const url = URL_SERVICES + 'upload/' + type + '/' + id;

      xhr.open('PUT', url, true);
      xhr.send( formData );

    });
  }
}
