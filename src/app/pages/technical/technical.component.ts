import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

// Models
import { Website } from '../../models/website.model';
import { TechnicalTask } from '../../models/technicalTask.model';

// Services
import { WebsiteService, TechnicalTaskService } from 'src/app/services/service.index';

declare var $: any;

@Component({
  selector: 'app-technical',
  templateUrl: './technical.component.html',
  styles: []
})
export class TechnicalComponent implements OnInit {

  public loading: boolean;
  public website: Website;
  public technicalForm: FormGroup;
  public updateTechnicalForm: FormGroup;
  public technicalTasks: TechnicalTask[] = [];
  public totalTechnicalTasks: number;
  public totalTechnicalTasksDone: number;
  public percentTechnical: number;
  public technicalToUpdate: TechnicalTask;

  updateMenu: Subject<void> = new Subject<void>();

  constructor(public activatedRoute: ActivatedRoute,
              public _websiteService: WebsiteService,
              public _technicalService: TechnicalTaskService) {
  }

  ngOnInit() {
    this.loading = true;
    this.technicalForm = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false } , [ Validators.required, Validators.minLength(2) ]),
    });

    this.updateTechnicalForm = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false } , [ Validators.required, Validators.minLength(2) ]),
    });
    this.activatedRoute.params.subscribe( params => {
      this._websiteService.getWebsite(params['id']).subscribe( ( websiteResponse: any) => {
        this.website = websiteResponse.website[0];
        this.loadTechnical();
      });
    });
  }

  loadTechnical() {
    this.totalTechnicalTasks = 0;
    this.totalTechnicalTasksDone = 0;
    this.percentTechnical = 0;
    this._technicalService.loadTasks( this.website._id ).subscribe( (response: any) => {
      this.technicalTasks = response.tasks;
      this.totalTechnicalTasks = response.count;
      this.technicalTasks.forEach((task: any) => {
        if (task.status) {
          this.totalTechnicalTasksDone++;
        }
      });
      if (response.count !== 0) {
        this.totalTechnicalTasks = response.count;
        this.percentTechnical = Math.round((this.totalTechnicalTasksDone * 100) / this.totalTechnicalTasks);
      }
      this.loading = false;
    });
  }

  dropTechnicalTask( event: CdkDragDrop<string[]> ) {
    if ( event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.technicalTasks, event.previousIndex, event.currentIndex);
      this._technicalService.updateOrder(this.technicalTasks);
    }
  }

  newTechnical() {
    this.loading = true;
    if ( this.technicalForm.valid) {
      this._technicalService.create( this.setTechnicalTask( this.technicalForm.value.name)).subscribe( () => {
        this.technicalForm.reset();
        this._technicalService.loadTasks( this.website._id ).subscribe( (response: any) => {
          this.technicalTasks = response.tasks;
          this.totalTechnicalTasks = response.count;
          this.updateMenu.next();
          this.loading = false;
          this.getTechnicalProgress();
        });
      });
    }
  }

  getTechnical( task: TechnicalTask) {
    this.technicalToUpdate = task;
    this.updateTechnicalForm.setValue({ 'name': task.name});
  }

  updateTechnical() {
    if (this.updateTechnicalForm.valid) {
      this._technicalService.update(this.setTechnicalTask(this.updateTechnicalForm.value.name, this.technicalToUpdate.order, this.technicalToUpdate._id )).subscribe( () => {
        this.loadTechnical();
        $('#edit-technical-modal').modal('hide');
        this.updateTechnicalForm.reset();
      });
    }
  }

  deleteTechnical( id: string) {
    this._technicalService.delete(id).subscribe( () => {
      this.loadTechnical();
      this.getTechnicalProgress();
    });
  }

  setTechnicalTask( name: string, order: any = this.totalTechnicalTasks, id: string = null ) {
    return new TechnicalTask( name, this.website._id, order, id );
  }

  statusTechnical( task: TechnicalTask ) {
    this._technicalService.updateStatus( task, !task.status).subscribe( () => {
      this.loadTechnical();
      this.updateMenu.next();
      this.getTechnicalProgress();
    });
  }

  bulkTechnical() {
    if ($('#bulk-technical').val() !== '') {
      this.loading = true;
      const bulk = $('#bulk-technical').val().split('\n');
      const total = bulk.length;
      let counter = 0;
      for (let i = 0; i < bulk.length; i++) {
        if (bulk[i] !== '') {
          this._technicalService.create(this.setTechnicalTask(bulk[i])).subscribe( () => {
            counter++;
            if ( total === counter) {
              this.loadTechnical();
              this.updateMenu.next();
              $('#bulk-technical-modal').modal('hide');
              this.loading = false;
              this.getTechnicalProgress();
            }
          });
        } else {
          counter++;
          if ( total === counter) {
            this.loadTechnical();
            this.updateMenu.next();
            $('#bulk-technical-modal').modal('hide');
            this.loading = false;
            this.getTechnicalProgress();
          }
        }
      }
    }
  }

  getTechnicalProgress() {
      let technical: any;
      let done = 0;
      let total = 0;
      let percent = 0;
      let chart = 0;
      this._technicalService.loadTasks( this.website._id ).subscribe( (responseTechnical: any) => {
        if (responseTechnical.count !== 0) {
          responseTechnical.tasks.forEach((task: TechnicalTask) => {
            if (task.status) {
              done++;
            }
          });
          total = responseTechnical.count;
          percent = Math.round((done * 100) / total);
          chart = Math.ceil(percent / 5) * 5;
        }
        technical = { percent: percent, chart: chart, total: total, done: done };
        this._websiteService.updateTechnical(this.website._id, technical).subscribe();
      });
  }

}
