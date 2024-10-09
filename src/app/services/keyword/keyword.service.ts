import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { Keyword } from 'src/app/models/keyword.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {

  keyword: Keyword;
  token: string;

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

  loadKeywords(id: string) {
    const url = URL_SERVICES + 'keyword/' + id;
    return this.http.get(url);
  }

  getPrimary(id: string) {
    const url = URL_SERVICES + 'keyword/primary/' + id;
    return this.http.get(url);
  }

  create( keyword: Keyword ) {
    const url = URL_SERVICES + 'keyword?token=' + this.token;

    return this.http.post( url, keyword ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Keyword: ' + keyword.name + ' successfully created!');
      return response.keyword;
    });
  }

  update( keyword: Keyword) {
    const url = URL_SERVICES + 'keyword?token=' + this.token;

    return this.http.put( url, keyword ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Keyword successfully updated!');
      return response;
    });
  }

  delete( id: string) {
    const url = URL_SERVICES + 'keyword/' + id + '?token=' + this.token;

    return this.http.delete(url).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Keyword successfully deleted!');
      return response;
    });

  }
}
