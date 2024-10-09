import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { BackLink } from '../../models/backLink.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class BackLinkService {

  backLink: BackLink;
  backLinks: BackLink[] = [];
  id: string;
  token: string;

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
  }

  getBackLinksFromWebsite(id: string) {
    const url = URL_SERVICES + 'backlink/website/' + id;

    return this.http.get(url).map( (response: any) => {
      return response;
    });
  }

  getSendersFromWebsite(id: string) {
    const url = URL_SERVICES + 'backlink/sender/' + id;

    return this.http.get(url).map( (response: any) => {
      return response;
    });
  }

  getReceiversFromWebsite(id: string) {
    const url = URL_SERVICES + 'backlink/receiver/' + id;

    return this.http.get(url).map( (response: any) => {
      return response;
    });
  }

  getBackLink(id: string) {
    const url = URL_SERVICES + 'backlink/' + id;

    return this.http.get(url).map( (response: any) => {
      return response;
    });
  }

  getByTask( id: string) {
    const url = URL_SERVICES + 'backlink/task/' + id;

    return this.http.get(url).map( (response: any) => {
      return response;
    });
  }


  create( backLink: BackLink ) {
    const url = URL_SERVICES + 'backlink?token=' + this.token;

    return this.http.post( url, backLink ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'BackLink successfully created!');
      return response;
    });
  }

  update( backLink: BackLink) {
    const url = URL_SERVICES + 'backlink?token=' + this.token;

    return this.http.put(url, backLink).map( ( response: any) => {
      this._toasterService.pop('success', 'Success!', 'BackLink successfully updated');

      return response;
    });
  }

  delete( id: string ) {
    const url = URL_SERVICES + 'backlink/' + id + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'BackLink successfully deleted!');
      return response;
    });
  }

}
