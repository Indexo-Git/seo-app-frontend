import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { City } from 'src/app/models/city.model';
import { WebsiteCity } from '../../models/websiteCity.model';
import { User } from 'src/app/models/user.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  user: User;
  city: City;
  token: string;
  id: string;
  cities: City[] = [];
  websites: string[] = [];

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
    if ( localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    } else {
      this.user = undefined;
    }
  }

  loadCities( ) {
    const url = URL_SERVICES + 'city/user/' + this.user._id;

    return this.http.get(url);
  }

  getCityFromWebsite(id: string) {
    const url = URL_SERVICES + 'city/website/' + id;

    return this.http.get(url);
  }

  getRelations(id: string) {
    const url = URL_SERVICES + 'city/relations/' + id;

    return this.http.get(url);
  }

  create( website: string, name: string ) {
    const url = URL_SERVICES + 'city?token=' + this.token;

    return this.http.post( url, { name: name, website: website, user: this.user._id } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'City: ' + response.city.name + ' successfully created!');
      return response.city;
    });
  }

  createRel( websiteCity: WebsiteCity ) {
    const url = URL_SERVICES + 'city/rel?token=' + this.token;

    return this.http.post( url, websiteCity ).map( () => {
      this._toasterService.pop('success', 'Success!', 'City: successfully associated!');
    });
  }

  update( id: string, name: string ) {
    const url = URL_SERVICES + 'city?token=' + this.token;

    return this.http.put( url, { id: id, name: name }). map( () => {
      this._toasterService.pop('success', 'Success!', 'City: successfully updated!');
    });
  }

  deleteRel( id: string) {
    const url = URL_SERVICES + 'city/rel/' + id + '?token=' + this.token;

    return this.http.delete( url );
  }

  delete( id: string) {
    const url = URL_SERVICES + 'city/' + id + '?token=' + this.token;

    return this.http.delete( url );
  }
}
