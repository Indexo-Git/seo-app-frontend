import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { Onsite } from 'src/app/models/onsite.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class OnsiteService {

  onsite: Onsite;
  token: string;
  onsiteTasks: Onsite[] = [];

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
    const url = URL_SERVICES + 'onsite/all';

    return this.http.get(url);
  }

  loadOnsite(id: string) {
    const url = URL_SERVICES + 'onsite/' + id;

    return this.http.get(url);
  }

  loadOnsiteOfMonth(id: string, month: number) {
    const url = URL_SERVICES + 'onsite/' + id + '/month/' + month;

    return this.http.get(url);
  }

  create( onsite: Onsite ) {
    const url = URL_SERVICES + 'onsite?token=' + this.token;

    return this.http.post( url, onsite ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Onsite task successfully created!');
      return response.task;
    });
  }

  updateMonth ( onsite: string, month: number, year: number ) {
    const url = URL_SERVICES + 'onsite/month?token=' + this.token;

    return this.http.put( url, { id: onsite, month: month, year: year } ).map( (response: any) => {
      return response;
    });
  }

  updateStatus( onsite: string, status: boolean ) {
    const url = URL_SERVICES + 'onsite/status?token=' + this.token;

    return this.http.put( url, { id: onsite, status: status } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Onsite task successfully changed!');
      return response;
    });
  }

  updateOnsite( onsite: Onsite) {
    const url = URL_SERVICES + 'onsite?token=' + this.token;
    return this.http.put( url, onsite ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Onsite task successfully updated!');
      return response.task;
    });
  }

  updateOrder( tasks: any) {
    const url = URL_SERVICES + 'onsite/order?token=' + this.token;

    tasks.forEach((item: any, index: any) => {

      this.http.put( url, { id: item._id, order: index } ).subscribe( (response: any) => {
        console.log(response);
      });
    });
  }

  delete( onsite: string ) {
    const url = URL_SERVICES + 'onsite/' + onsite + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Onsite task successfully deleted!');
      return response;
    });
  }

}
