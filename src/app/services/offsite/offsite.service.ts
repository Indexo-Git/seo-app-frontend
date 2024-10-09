import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { Offsite } from 'src/app/models/offsite.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class OffsiteService {

  offsite: Offsite;
  token: string;
  offsiteTasks: Offsite[] = [];

  constructor( public http: HttpClient,
               public router: Router,
               public _toasterService: ToasterService) {
    this.loadToken();
  }

  loadToken() {
    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    } else {
      this.token = '';
    }
  }

  loadAll(){
    const url = URL_SERVICES + 'offsite/all';

    return this.http.get(url);
  }

  loadOffsite(id: string) {
    const url = URL_SERVICES + 'offsite/' + id;

    return this.http.get(url);
  }

  loadSingleOffsite(id: string) {
    const url = URL_SERVICES + 'offsite/single/' + id;

    return this.http.get(url);
  }

  loadOffsiteOfMonth(id: string, month: number) {
    const url = URL_SERVICES + 'offsite/' + id + '/month/' + month;

    return this.http.get(url);
  }

  create( offsite: Offsite ) {
    const url = URL_SERVICES + 'offsite?token=' + this.token;

    return this.http.post( url, offsite ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Offsite task successfully created!');
      return response.task;
    });
  }

  updateMonth ( offsite: string, month: number, year: number ) {
    const url = URL_SERVICES + 'offsite/month?token=' + this.token;

    return this.http.put( url, { id: offsite, month: month, year: year } ).map( (response: any) => {
      return response;
    });
  }

  updateStatus( offsite: string, status: boolean ) {
    const url = URL_SERVICES + 'offsite/status?token=' + this.token;

    console.log(offsite);
    return this.http.put( url, { id: offsite, status: status } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Offsite task successfully changed!');
      return response;
    });
  }

  updateOffsite( offsite: Offsite) {
    const url = URL_SERVICES + 'offsite?token=' + this.token;
    return this.http.put( url, offsite ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Offsite task successfully updated!');
      return response.task;
    });
  }

  delete( offsite: string ) {
    const url = URL_SERVICES + 'offsite/' + offsite + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Offsite task successfully deleted!');
      return response;
    });
  }
}
