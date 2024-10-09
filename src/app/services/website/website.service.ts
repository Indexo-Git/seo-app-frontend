import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/map';

// Models
import { Website } from 'src/app/models/website.model';
import { User } from 'src/app/models/user.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  website: Website;
  token: string;
  user: User;
  websites: string[] = [];

  constructor( public http: HttpClient,
               public router: Router,
               public _toasterService: ToasterService,
               public _userService: UserService) {
    this.user = this._userService.user;
    this.token = this._userService.token;
  }

  create( website: Website ) {
    const url = URL_SERVICES + 'website?token=' + this.token;

    return this.http.post( url, website ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Website: ' + website.domain + ' successfully created!');
      return response.website;
    });
  }

  getAll() {
    const url = URL_SERVICES + 'website';

    return this.http.get(url);
  }

  loadWebsitesByUser(id: string) {
    const url = URL_SERVICES + 'website/user/' + id;

    return this.http.get(url);
  }

  loadWebsites() {
    const url = URL_SERVICES + 'website/user/' + this.user._id;

    return this.http.get(url);
  }

  loadUsers(id: string) {
    const url = URL_SERVICES + 'website/users/' + id;

    return this.http.get(url);
  }

  searchBy(field: string, value: string) {
    const url = URL_SERVICES + 'search/website/' + field + '/' + value;

    return this.http.get(url);
  }

  websiteBy(field: string, value: string) {
    const url = URL_SERVICES + 'website/by/' + field + '/' + value;
    return this.http.get(url);
  }

  getWebsite( id: string) {
    const url = URL_SERVICES + 'website/' + id;

    return this.http.get(url);
  }

  updateClient( id: string, client: string ) {
    const url = URL_SERVICES + 'website/client/' + id + '?token=' + this.token;

    return this.http.put( url, { client: client} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Website client successfully updated!');
      return response.website;
    });
  }

  updateCity( id: string, city: string ) {
    const url = URL_SERVICES + 'website/city/' + id + '?token=' + this.token;

    return this.http.put( url, { city: city} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Website city successfully updated!');
      return response.website;
    });
  }

  updateTechnology( id: string, technology: string ) {
    const url = URL_SERVICES + 'website/technology/' + id + '?token=' + this.token;

    return this.http.put( url, { technology: technology} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Technology city successfully updated!');
      return response.website;
    });
  }

  updateType( id: string, type: string ) {
    const url = URL_SERVICES + 'website/type/' + id + '?token=' + this.token;

    return this.http.put( url, { type: type} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Type city successfully updated!');
      return response.website;
    });
  }

  updateCategory( id: string, category: string ) {
    const url = URL_SERVICES + 'website/category/' + id + '?token=' + this.token;

    return this.http.put( url, { category: category} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Category city successfully updated!');
      return response.website;
    });
  }

  updateFavorite(id: string, favorite: boolean) {
    const url = URL_SERVICES + 'website/favorite/' + id + '?token=' + this.token;

    return this.http.put( url, { favorite: favorite} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Favorite successfully updated!');
      return response.website;
    });
  }

  updateSold(id: string, sold: boolean) {
    const url = URL_SERVICES + 'website/sold/' + id + '?token=' + this.token;

    return this.http.put( url, { sold: sold} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Favorite successfully updated!');
      return response.website;
    });
  }

  updateCheckIndex(id: string, favorite: boolean) {
    const url = URL_SERVICES + 'website/index/' + id + '?token=' + this.token;

    return this.http.put( url, { favorite: favorite} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Check Index successfully updated!');
      return response.website;
    });
  }

  updateComment(id: string, comment: string) {
    const url = URL_SERVICES + 'website/comment/' + id + '?token=' + this.token;

    return this.http.put( url, { comment: comment} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Comment successfully updated!');
      return response.website;
    });
  }

  updateConnection(id: string, connection: string) {
    const url = URL_SERVICES + 'website/connection/' + id + '?token=' + this.token;

    return this.http.put( url, { connection: connection} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Connection for admin successfully updated!');
      return response.website;
    });
  }

  updateInfo(id: string, info: string) {
    const url = URL_SERVICES + 'website/info/' + id + '?token=' + this.token;

    return this.http.put( url, { info: info } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Connection for user successfully updated!');
      return response.website;
    });
  }

  updateProgress(id: string, progress: Object) {
    const url = URL_SERVICES + 'website/progress/' + id + '?token=' + this.token;

    return this.http.put( url, { progress } ).map( (response: any) => {
      return response;
    });
  }

  updateSemantic(id: string, semantic: Object) {
    const url = URL_SERVICES + 'website/semantic/' + id + '?token=' + this.token;

    return this.http.put( url, { semantic } ).map( (response: any) => {
      return response;
    });
  }

  updateTechnical(id: string, technical: Object) {
    const url = URL_SERVICES + 'website/technical/' + id + '?token=' + this.token;

    return this.http.put( url, { technical } ).map( (response: any) => {
      return response;
    });
  }

  updatePrimary(id: string, primary: Object) {
    const url = URL_SERVICES + 'website/primary/' + id + '?token=' + this.token;

    return this.http.put( url, { primary } ).map( (response: any) => {
      return response;
    });
  }

  updateOnsite(id: string, onsite: Object) {
    const url = URL_SERVICES + 'website/onsite/' + id + '?token=' + this.token;

    return this.http.put( url, { onsite } ).map( (response: any) => {
      return response;
    });
  }

  updateOffsite(id: string, offsite: Object) {
    const url = URL_SERVICES + 'website/offsite/' + id + '?token=' + this.token;

    return this.http.put( url, { offsite } ).map( (response: any) => {
      return response;
    });
  }

  updateCityName(id: string, city: string) {
    const url = URL_SERVICES + 'website/city-name/' + id + '?token=' + this.token;

    return this.http.put( url, { city : { name: city } } ).map( (response: any) => {
      return response;
    });
  }

  updatePriority(id: string, priority: Number) {
    const url = URL_SERVICES + 'website/priority/' + id + '?token=' + this.token;

    return this.http.put( url, { priority }).map( (response: any) => {
      return response;
    });
  }

  createRel( user: string, website: string ) {
    const url = URL_SERVICES + 'website/rel?token=' + this.token;

    return this.http.post( url, { user: user, website: website} ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'User and website were successfully linked!');
      return response.rel;
    });
  }

  deleteRel( id: string ) {
    const url = URL_SERVICES + 'website/rel/' + id + '?token=' + this.token;

    return this.http.delete(url).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Relation successfully deleted!');
      return response;
    });
  }

  delete (id: string) {
    const url = URL_SERVICES + 'website/' + id + '?token=' + this.token;

    return this.http.delete(url).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Website successfully deleted!');
      return response;
    });
  }


}
