import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { Page } from 'src/app/models/page.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  page: Page;
  token: string;
  pages: any[] = [];

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

  loadPagesForTable(id: string) {
    const pages = [];
    const url = URL_SERVICES + 'page/' + id;

    return this.http.get(url).map( (response: any) => {
      response.pages.forEach( (page: any) => {
        if (!page.mother || page.mother === null) {
          const obj = { order: page.order, page: page, daughters: []};
          pages.push(obj);
        }
      });
      pages.forEach( (page: any) => {
        this.getItsDaughters(response.pages, page);
      });

      pages.sort(function(obj1, obj2) {
        return obj1.order - obj2.order;
      });

      return pages;
    });
  }

  loadPagesForTableOnline(id: string) {
    const pages = [];
    const url = URL_SERVICES + 'page/' + id;

    return this.http.get(url).map( (response: any) => {
      response.pages.forEach( (page: any) => {
        if (page.online) {
          if (!page.mother || page.mother === null) {
            const obj = { order: page.order, page: page, daughters: []};
            pages.push(obj);
          }
        }
      });
      pages.forEach( (page: any) => {
        this.getItsDaughtersOnline(response.pages, page);
      });

      pages.sort(function(obj1, obj2) {
        return obj1.order - obj2.order;
      });

      return pages;
    });
  }

  getItsDaughters( array: any, page: any) {
    array.forEach((element: any) => {
      if (element.mother === page.page._id) {
        page.daughters.push(element);

        page.daughters.sort(function(obj1, obj2) {
          return obj1.order - obj2.order;
        });

      }
    });
  }

  getItsDaughtersOnline( array: any, page: any) {
    array.forEach((element: any) => {
      if (element.online) {
        if (element.mother === page.page._id) {
          page.daughters.push(element);
          page.daughters.sort(function(obj1, obj2) {
            return obj1.order - obj2.order;
          });
        }
      }
    });
  }

  loadAll() {
    const url = URL_SERVICES + 'page/all';

    return this.http.get(url);
  }

  loadPages(id: string) {
    const url = URL_SERVICES + 'page/' + id;

    return this.http.get(url);
  }

  loadPagesOfMonth(id: string, month: number) {
    const url = URL_SERVICES + 'page/' + id + '/month/' + month;

    return this.http.get(url);
  }

  create( page: Page ) {
    const url = URL_SERVICES + 'page?token=' + this.token;

    return this.http.post( url, page ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Page: ' + page.name + ' successfully created!');
      return response.page;
    });
  }

  updateOrder( pages: any) {
    const url = URL_SERVICES + 'page/order?token=' + this.token;
    let obj: any;
    pages.forEach((item: any, index: any) => {
      if (item.page) {
        obj = { id: item.page._id, order: index };
      } else {
        obj = { id: item._id, order: index };
      }
      this.http.put( url, obj ).subscribe( (response: any) => {
        console.log(response);
      });
    });
  }

  getTasks( page: string ) {
    const url = URL_SERVICES + 'page/' + page + '/tasks';

    return this.http.get(url);
  }

  updateCreated ( page: string, status: boolean ) {
    const url = URL_SERVICES + 'page/created?token=' + this.token;

    return this.http.put( url, { id: page, status: status } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Page content successfully changed!');
      return response;
    });
  }

  updateOnline ( page: string, status: boolean ) {
    const url = URL_SERVICES + 'page/online?token=' + this.token;

    return this.http.put( url, { id: page, status: status } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Page status online successfully changed!');
      return response;
    });
  }

  updateOptimized ( page: string, status: boolean ) {
    const url = URL_SERVICES + 'page/optimized?token=' + this.token;

    return this.http.put( url, { id: page, status: status } ).map( (response: any) => {
      return response;
    });
  }

  updateContent ( page: string, content: string ) {
    const url = URL_SERVICES + 'page/content?token=' + this.token;

    return this.http.put( url, { id: page, content: content } ).map( (response: any) => {
      return response;
    });
  }

  updateMonth ( page: string, month: number, year: number ) {
    const url = URL_SERVICES + 'page/month?token=' + this.token;

    return this.http.put( url, { id: page, month: month, year: year } ).map( (response: any) => {
      return response;
    });
  }

  updatePage( page: Page) {
    const url = URL_SERVICES + 'page?token=' + this.token;
    return this.http.put( url, page ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Page task successfully updated!');
      return response.page;
    });
  }

  delete( page: string ) {
    const url = URL_SERVICES + 'page/' + page + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Sitemap task successfully deleted!');
      return response;
    });
  }

}
