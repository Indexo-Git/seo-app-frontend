import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { Client } from 'src/app/models/client.model';
import { User } from 'src/app/models/user.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  user: User;
  client: Client;
  token: string;
  clients: Client[] = [];

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
    if ( localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    } else {
      this.user = undefined;
    }
  }

  loadClients() {
    const url = URL_SERVICES + 'client/user/' + this.user._id;

    return this.http.get(url);
  }

  create( name: string ) {
    const url = URL_SERVICES + 'client?token=' + this.token;

    return this.http.post( url, { name: name, user: this.user._id } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Client: ' + response.client.name + ' successfully created!');
      return response.client;
    });
  }

  update( id: string, name: string) {
    const url = URL_SERVICES + 'client?token=' + this.token;

    return this.http.put( url, { id: id, name: name } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Client: successfully updated!');
      return response.client;
    });
  }

  delete (id: string) {
    const url = URL_SERVICES + 'client/' + id + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Client successfully deleted!');
      return response;
    });
  }

}
