import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { Type } from 'src/app/models/type.model';
import { User } from 'src/app/models/user.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  user: User;
  type: Type;
  token: string;
  types: Type[] = [];

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

  loadTypes() {
    const url = URL_SERVICES + 'type/user/' + this.user._id;

    return this.http.get(url);
  }

  create( name: string ) {
    const url = URL_SERVICES + 'type?token=' + this.token;

    return this.http.post( url, { name: name, user: this.user._id } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Type: ' + response.type.name + ' successfully created!');
      return response.type;
    });
  }

  update( id: string, name: string) {
    const url = URL_SERVICES + 'type?token=' + this.token;

    return this.http.put( url, { id: id, name: name } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Type: successfully updated!');
      return response.type;
    });
  }

  delete(id: string) {
    const url = URL_SERVICES + 'type/' + id + '?token=' + this.token;

    return this.http.delete(url).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Type successfully deleted!');
      return response;
    });
  }

}
