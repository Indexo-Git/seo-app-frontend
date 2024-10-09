import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { Analyze } from '../../models/analyze.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  analyze: Analyze;
  analyzes: Analyze[] = [];
  id: string;
  token: string;

  constructor( public http: HttpClient,
               public router: Router,
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

  loadAnalyzes(id: string) {
    const url = URL_SERVICES + 'analyze/' + id;

    return this.http.get(url).map( (response: any) => {
      return response;
    });
  }

  create( analyze: Analyze ) {
    const url = URL_SERVICES + 'analyze?token=' + this.token;

    return this.http.post( url, analyze ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Analyze successfully created!');
      return response;
    });
  }

  update( analyze: Analyze) {
    const url = URL_SERVICES + 'analyze?token=' + this.token;

    return this.http.put(url, analyze).map( ( response: any) => {
      this._toasterService.pop('success', 'Success!', 'Analyze successfully updated');

      return response;
    });
  }

  delete( id: string ) {
    const url = URL_SERVICES + 'analyze/' + id + '?token=' + this.token;

    return this.http.delete(url).map( (response: any) => {
      return response;
    });
  }

}
