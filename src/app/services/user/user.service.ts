import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Models
import { User } from '../../models/user.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { UploadService } from '../upload/upload.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;
  token: string;

  constructor( public http: HttpClient,
               public router: Router,
               public _toasterService: ToasterService,
               public _uploadService: UploadService) {
    this.loadStorage();
  }

  getUsers() {
    const url = URL_SERVICES + 'user';

    return this.http.get(url);
  }

  isLogged() {
    return ( this.token.length > 1) ? true : false;
  }

  loadStorage() {
    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse( localStorage.getItem('user'));
    } else {
      this.token = '';
      this.user = null;
    }
  }

  saveStorage( id: string, token: string, user: User) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.user = user;
    this.token = token;
  }

  create( user: User ) {
    const url = URL_SERVICES + 'user';

    return this.http.post( url, user ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Welcome: ' + user.email);
      return response.user;
    });
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICES + 'login/google';

    return this.http.post(url, { token }).map((response: any) => {
      this.saveStorage(response.id, response.token, response.user);
      this._toasterService.pop('success', 'Welcome back ' + response.user.name + '!', '' );
      return true;
    });
  }

  login( user: User, remember: boolean = false) {

    if (remember) {
      localStorage.setItem('email', user.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICES + 'login';

    return this.http.post( url, user).map( (response: any) => {
      this.saveStorage(response.id, response.token, response.user);
      this._toasterService.pop('success', 'Welcome back ' + response.user.name + '!', '' );
      return true;
    });
  }

  logout() {
    this.user = null;

    this.token = '';

    localStorage.removeItem('id');
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.router.navigate(['/login']);

    window.location.reload();
  }

  update( user: User) {
    let url = URL_SERVICES + 'user/' + user._id;

    url += '?token=' + this.token;

    return this.http.put(url, user).map( ( response: any) => {
      this._toasterService.pop('success', 'Success!', 'User successfully updated');

      this.saveStorage(response.user._id, this.token, response.user );

      return true;
    });
  }

  updateImage ( file: File, id: string ) {
    this._uploadService.upload( file, 'users', id)
    .then( (response: any) => {
      this.user.img = response.user.img;
      this._toasterService.pop('success', 'Success!', 'User\'s image updated!');
      this.saveStorage( id, this.token, this.user);
    })
    .catch( response => {
    });
  }

  getUserByEmail(email: string) {
    const url = URL_SERVICES + 'user/email/' + email;

    return this.http.get(url);
  }

  renewToken() {
    const url = URL_SERVICES + 'login/renew-token?token=' + this.token;

    return this.http.get(url)
      .map( (response: any) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);
        return true;
      })
      .catch( error => {
        this.router.navigate(['/login']);
        return Observable.throw(error);
      });
  }

}
