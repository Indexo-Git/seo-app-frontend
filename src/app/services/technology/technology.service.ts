import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { Technology } from 'src/app/models/technology.model';
import { User } from 'src/app/models/user.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  user: User;
  technology: Technology;
  token: string;
  technologies: Technology[] = [];

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

  loadTechnologies( ) {
    const url = URL_SERVICES + 'technology/user/' + this.user._id;

    return this.http.get(url);
  }

  create( name: string ) {
    const url = URL_SERVICES + 'technology?token=' + this.token;

    return this.http.post( url, { name: name, user : this.user._id} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Technology: ' + response.technology.name + ' successfully created!');
      return response.technology;
    });
  }

  update( id: string, name: string) {
    const url = URL_SERVICES + 'technology?token=' + this.token;

    return this.http.put( url, { id: id, name: name } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Technology: successfully updated!');
      return response.technology;
    });
  }

  delete (id: string) {
    const url = URL_SERVICES + 'technology/' + id + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Technology successfully deleted!');
      return response;
    });
  }
}
