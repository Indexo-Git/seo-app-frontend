import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import 'rxjs/add/operator/map';

// Service
import { ToasterService } from 'angular2-toaster';

// Model
import { Cost } from '../../models/cost.model';

@Injectable({
  providedIn: 'root'
})
export class CostService {

  private token: string;

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
  }

  loadCosts (id: string) {
    const url = URL_SERVICES + 'cost/' + id;

    return this.http.get(url).map( (response: any) => {
      return response.costs;
    });
  }

  create( cost: Cost ) {
    const url = URL_SERVICES + 'cost?token=' + this.token;

    return this.http.post( url, cost ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Cost successfully created!');
      return response;
    });
  }

  delete(id: string) {
    const url = URL_SERVICES + 'cost/' + id + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Cost successfully deleted!');
      return response;
    });
  }
}
