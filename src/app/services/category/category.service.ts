import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  user: User;
  network: Category;
  token: string;
  categories: Category[] = [];

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

  loadCategories() {
    const url = URL_SERVICES + 'category/user/' + this.user._id;

    return this.http.get(url);
  }

  multiDimensionalUnique( arr: Category[] ) {
    const uniques = [];
    const itemsFound = {};
    for (let i = 0, l = arr.length; i < l; i++) {
        const stringified = JSON.stringify(arr[i]);
        if (itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
  }

  create( category: Category ) {
    const url = URL_SERVICES + 'category?token=' + this.token;

    return this.http.post( url, category ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Category: ' + category.name + ' successfully created!');
      return response.category;
    });
  }

  update( id: string, name: string) {
    const url = URL_SERVICES + 'category?token=' + this.token;

    return this.http.put( url, { id: id, name: name } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Category: successfully updated!');
      return response.category;
    });
  }

  delete (id: string) {
    const url = URL_SERVICES + 'category/' + id + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Category successfully deleted!');
      return response;
    });
  }

}
