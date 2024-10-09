import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { Network } from 'src/app/models/network.model';
import { Website } from '../../models/website.model';
import { WebsiteNetwork } from '../../models/websiteNetwork.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  network: Network;
  token: string;
  id: string;

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

  loadNetwork( id: string) {
    const url = URL_SERVICES + 'network/' + id;

    return this.http.get(url);
  }

  loadNetworks() {

    const url = URL_SERVICES + 'network/user/' + this.id;

    return this.http.get(url);
  }

  loadNetworksUsers( id: string) {

    const url = URL_SERVICES + 'network/users/' + id;

    return this.http.get(url);
  }

  loadNetworksFromWebsite(id: string) {
    const url = URL_SERVICES + 'network/website/' + id;

    return this.http.get(url);
  }

  loadWebsiteFromNetwork(id: string) {
    const url = URL_SERVICES + 'network/' + id + '/websites';

    return this.http.get(url);
  }

  create( network: Network) {
    const url = URL_SERVICES + 'network?token=' + this.token;

    return this.http.post( url, network).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Network: ' + network.name + ' successfully created!');
      return response.network;
    });
  }

  createRel( websiteNetwork: WebsiteNetwork ) {
    const url = URL_SERVICES + 'network/rel?token=' + this.token;

    return this.http.post( url, websiteNetwork ).map( (response) => {
      this._toasterService.pop('success', 'Success!', 'Network: successfully associated!');
      return response;
    });
  }

  shareNetwork( relation: any ) {
    const url = URL_SERVICES + 'network/share?token=' + this.token;

    return this.http.post( url , relation ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Network successfully shared!');
      return response;
    });
  }

  update( network: Network) {
    const url = URL_SERVICES + 'network?token=' + this.token;

    return this.http.put( url, network ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Network: successfully updated!');
      return response.network;
    });
  }

  delete( id: string) {
    let url = URL_SERVICES + 'network/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Network: ' + response.network.name + ' successfully deleted!');
    });
  }

  deleteRel( rel: any[], website: string) {
    const url = URL_SERVICES + 'website-network?token=' + this.token;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: {  ids: rel, website: website }
    };

    return this.http.delete(url, httpOptions);
  }

  deleteShare( id: string) {
    let url = URL_SERVICES + 'network/share/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url).map( () => {
      this._toasterService.pop('success', 'Success!', 'Relation User Network: successfully deleted!');
    });
  }

  search( query: string ) {
    const url = URL_SERVICES + 'search/network/' + query;

    return this.http.get(url);
  }
}
