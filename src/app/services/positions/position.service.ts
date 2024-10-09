import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import 'rxjs/add/operator/map';

// Models
import { Position } from '../../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  token: string;

  constructor( public http: HttpClient) {
    this.loadToken();
  }

  loadToken() {
    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    } else {
      this.token = '';
    }
  }

  loadPositions(id: string) {
    const url = URL_SERVICES + 'position/' + id;

    return this.http.get(url);
  }

  loadByIdAndDate( id: string, date: Date) {
    const url = URL_SERVICES + 'position/' + id + '/date/' + date;

    return this.http.get(url);
  }

  loadLastPositions( id: string ) {
    const url = URL_SERVICES + 'position/' + id + '/last';

    return this.http.get(url);
  }

  create( position: Position ) {
    const url = URL_SERVICES + 'position?token=' + this.token;

    return this.http.post( url, position ).map( (response: any) => {
      return response;
    });
  }

  delete( id: string ) {
    const url = URL_SERVICES + 'position/' + id + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      return response;
    });
  }
}
