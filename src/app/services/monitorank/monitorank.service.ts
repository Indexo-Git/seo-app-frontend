import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_MONITORANK } from '../../config/config';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class MonitorankService {

  constructor(public http: HttpClient) { }

  getPositionsByDomain(domain: string) {
    const url = URL_MONITORANK + domain;

    return this.http.get(url).map( (response: any) => {
      return response;
    });
  }

  test() {
    const url = URL_MONITORANK + 'sos-serrurier-bordeaux.fr';

    return this.http.get(url).map( (response: any) => {
      return response;
    });
  }
}
