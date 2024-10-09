import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { SemanticTask } from 'src/app/models/semanticTask.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class SemanticTaskService {

  semanticTask: SemanticTask;
  semanticTasks: SemanticTask[] = [];
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

  loadTasks(id: string) {
    const url = URL_SERVICES + 'semantic/' + id;

    return this.http.get(url);
  }

  getRelations(id: string) {
    const url = URL_SERVICES + 'semantic/relations/' + id;

    return this.http.get(url);
  }

  create( task: SemanticTask ) {
    const url = URL_SERVICES + 'semantic?token=' + this.token;

    return this.http.post( url, task ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Semantic task: ' + task.name + ' successfully created!');
      return response.task;
    });
  }

  createRelationForTask( id: string, pages: any ) {
    const url = URL_SERVICES + 'semantic/page?token=' + this.token;
    pages.forEach( (page: any) => {
      this.http.post( url, { page: page._id, task: id } ).subscribe( (response: any) => {
      });
    });
  }

  createRelationForPage( task: string, page: string ) {
    const url = URL_SERVICES + 'semantic/page?token=' + this.token;
    return this.http.post( url, { page: page, task: task } );
  }

  updateOrder( tasks: any) {
    const url = URL_SERVICES + 'semantic/order?token=' + this.token;
    tasks.forEach((item: any, index: any) => {
      this.http.put( url, { id: item._id, order: index } ).subscribe( (response: any) => {
      });
    });
  }

  updateStatus ( task: string , status: boolean ) {
    const url = URL_SERVICES + 'semantic/status?token=' + this.token;

    return this.http.put( url, { id: task, status: status } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Semantic task marked as done!');
      return response.task;
    });

  }

  update( task: SemanticTask) {
    const url = URL_SERVICES + 'semantic?token=' + this.token;
    return this.http.put( url, task ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Semantic task successfully updated!');
      return response.task;
    });
  }


  deleteRelationForPage( relation: string ) {
    const url = URL_SERVICES + 'semantic/relation/' + relation + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      // this._toasterService.pop('success', 'Success!', 'Sitemap task successfully deleted!');
      return response;
    });
  }

  delete( id: string ) {
    const url = URL_SERVICES + 'semantic/' + id + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Semantic task successfully deleted!');
      return response;
    });
  }


}
