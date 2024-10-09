import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

// Models
import { TechnicalTask } from 'src/app/models/technicalTask.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class TechnicalTaskService {

  technicalTask: TechnicalTask;
  technicalTasks: TechnicalTask[] = [];
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
    const url = URL_SERVICES + 'technical/' + id;

    return this.http.get(url);
  }

  create( task: TechnicalTask ) {
    const url = URL_SERVICES + 'technical?token=' + this.token;

    return this.http.post( url, task ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Technical task: ' + task.name + ' successfully created!');
      return response.task;
    });
  }

  update( task: TechnicalTask) {
    const url = URL_SERVICES + 'technical?token=' + this.token;

    return this.http.put( url, task ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Technical task: ' + task.name + ' successfully updated!');
      return response.task;
    });

  }

  updateOrder( tasks: any) {
    const url = URL_SERVICES + 'technical/order?token=' + this.token;

    tasks.forEach((item: any, index: any) => {

      this.http.put( url, { id: item._id, order: index } ).subscribe( (response: any) => {
        console.log(response);
      });
    });
  }

  updateStatus ( task: TechnicalTask , status: boolean ) {
    const url = URL_SERVICES + 'technical/status?token=' + this.token;

    return this.http.put( url, { id: task._id, status: status } ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Technical task: ' + task.name + ' marked as done!');
      return response.task;
    });

  }

  delete( id: string ) {
    const url = URL_SERVICES + 'technical/' + id + '?token=' + this.token;

    return this.http.delete( url ).map( (response: any) => {
      this._toasterService.pop('success', 'Success!', 'Technical task successfully deleted!');
      return response;
    });
  }

}
