import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import 'rxjs/add/operator/map';

// Models
import { Concurrent } from '../../models/concurrent.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';
@Injectable({
  providedIn: 'root'
})
export class ConcurrentService {

  concurrent: Concurrent;
  concurrence: Concurrent[] = [];
  id: string;
  token: string;

  constructor(public http: HttpClient,
              public _toasterService: ToasterService) {
      this.loadStorage();
  }

  loadStorage() {
    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    } else {
      this.token = '';
    }
    if ( localStorage.getItem('id')) {
      this.id = localStorage.getItem('id');
    } else {
      this.id = '';
    }
  }

  loadConcurrence(id: string) {
    const url = URL_SERVICES + 'concurrent/' + id;

    return this.http.get(url).map( (response: any) => {
      return response;
    });
  }

  create( concurrent: Concurrent ) {
    const url = URL_SERVICES + 'concurrent?token=' + this.token;

    return this.http.post( url, concurrent ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Concurrent successfully created!');
      return response;
    });
  }

  update( concurrent: Concurrent) {
    const url = URL_SERVICES + 'concurrent?token=' + this.token;

    return this.http.put(url, concurrent).map( ( response: any) => {
      this._toasterService.pop('success', 'Success!', 'Concurrent successfully updated');

      return response;
    });
  }

  delete( concurrent: string ) {
    const url = URL_SERVICES + 'concurrent/' + concurrent + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Concurrent successfully deleted!');
      return response;
    });
  }
}
