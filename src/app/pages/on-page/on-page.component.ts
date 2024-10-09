import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';

// Models
import { Website } from '../../models/website.model';
import { SemanticTask } from '../../models/semanticTask.model';
import { Page } from '../../models/page.model';

// Services
import { WebsiteService, PageService, SemanticTaskService } from 'src/app/services/service.index';

declare var $: any;

@Component({
  selector: 'app-on-page',
  templateUrl: './on-page.component.html',
  styles: [
    '.drag-list-child {margin: 5px 0px 0px 23px;}',
    '.drag-item-child {padding: 6px 0px 8px 10px!important;}',
    '.drag-item {padding: 6px 10px;border-bottom: solid 1px #f0f0f0;color: rgba(0, 0, 0, 0.87);}',
    '.drag-item > i, .task-container .fa-bars{cursor: move;}',
    '.cdk-drag-preview {border-radius: 4px;box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),0 8px 10px 1px rgba(0, 0, 0, 0.14),0 3px 14px 2px rgba(0, 0, 0, 0.12);}',
    '.cdk-drag-placeholder {opacity: 0;}',
    '.cdk-drag-animating {transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);}',
    '.drag-item:last-child {border: none;}',
    '.drag-list.cdk-drop-list-dragging .drag-item:not(.cdk-drag-placeholder) {transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);}',
    '.nav-tabs {border-bottom: none;}',
    '.nav-tabs .nav-link {border-radius: 20px;}'
  ]
})
export class OnPageComponent implements OnInit {

  public loading: boolean;

  public website: Website;

  public semanticForm: FormGroup;
  public updateSemanticForm: FormGroup;
  public semanticTasks: SemanticTask[] = [];

  public semanticToUpdate: SemanticTask;

  public pages: any[] = [];
  public allSemanticDone: boolean;
  public pageTasks: any[] = [];
  public selectedPage: Page;

  updateMenu: Subject<void> = new Subject<void>();

  constructor(public activatedRoute: ActivatedRoute,
              public _websiteService: WebsiteService,
              public _pageService: PageService,
              public _semanticService: SemanticTaskService) {
  }

  ngOnInit() {
    this.loading = true;
    this.semanticForm = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false } , [ Validators.required, Validators.minLength(2) ]),
    });

    this.updateSemanticForm = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false } , [ Validators.required, Validators.minLength(2) ]),
    });

    this.activatedRoute.params.subscribe( params => {
      this._websiteService.getWebsite(params['id']).subscribe( ( websiteResponse: any) => {
        this.website = websiteResponse.website[0];
        this.loadSemantic();
        this.loadPages();
        this.loading = false;
      });
    });
  }

  loadSemantic() {
    this._semanticService.loadTasks( this.website._id ).subscribe( (response: any) => {
      this.semanticTasks = response.tasks;
    });
  }

  loadPages() {
    this._pageService.loadPagesForTableOnline(this.website._id).subscribe( (response: any) => {
      console.log(response);
      this.pages = response;
      setTimeout(() => {
        $('[data-toggle=popover]').popover();
      }, 500);
    });
  }

  loadAll() {
    this.loadSemantic();
    this.loadPages();
    this.updateMenu.next();
    this.loading = false;
  }

  // Drops

  dropPage(array: any, event: CdkDragDrop<string[]>) {
    if ( event.previousIndex !== event.currentIndex) {
      moveItemInArray(array, event.previousIndex, event.currentIndex);
      this._pageService.updateOrder(array);
    }
  }

  dropSemanticTask( event: CdkDragDrop<string[]> ) {
    if ( event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.semanticTasks, event.previousIndex, event.currentIndex);
      this._semanticService.updateOrder(this.semanticTasks);
    }
  }

  // Semantic processes

  newSemantic() {
    this.loading = true;
    if (this.semanticForm.valid) {
      this._semanticService.create(this.setSemanticTask( this.semanticForm.value.name)).subscribe( (task: any) => {
        this.semanticForm.reset();
        this._pageService.loadPages(this.website._id).subscribe( (response: any) => {
          if (response.pages.length > 0) {
            this._semanticService.createRelationForTask( task._id, response.pages);
            let counter = 0;
            response.pages.forEach((page: any) => {
              this._pageService.updateOptimized(page, false).subscribe( () => {
                counter++;
                if (counter === response.pages.length) {
                  this.loadAll();
                  this.getSemanticProgress();
                }
              });
            });
          }
        });
      });
    }
  }

  getSemantic( task: SemanticTask) {
    this.semanticToUpdate = task;
    this.updateSemanticForm.setValue({ 'name': task.name});
  }

  updateSemantic() {
    if (this.updateSemanticForm.valid) {
      this._semanticService.update(this.setSemanticTask(this.updateSemanticForm.value.name, this.semanticToUpdate.order, this.semanticToUpdate._id )).subscribe( () => {
        this.loadSemantic();
        this.updateMenu.next();
        $('#edit-semantic-modal').modal('hide');
        this.updateSemanticForm.reset();
      });
    }
  }

  deleteSemantic(task: SemanticTask) {
    this.loading = true;
    this._semanticService.delete(task._id).subscribe( () => {
      this._semanticService.getRelations(task._id).subscribe( (responseRelations: any) => {
        const relations = responseRelations.relations.length;
        let deleted = 0;
        responseRelations.relations.forEach( (relation: any, index: any) => {
          this._semanticService.deleteRelationForPage(relation._id).subscribe( () => {
            deleted ++;
            if (relations === deleted) {
              this.loadAll();
              this.updateMenu.next();
              this.getSemanticProgress();
            }
          });
        });
      });
    });
  }

  setSemanticTask( name: string, order: any = this.semanticTasks.length , id: string = null ) {
    return new SemanticTask( name, this.website._id, order , false, id );
  }

  bulkSemantic() {
    this.loading = true;
    if ($('#bulk-semantic').val() !== '') {
      const bulk = $('#bulk-semantic').val().split('\n');
      const total = bulk.length;
      let counter = 0;
      let totalCounter = 0;
      let taskTotal = 0;
      let bulkTotal = 0;
      for (let i = 0; i < bulk.length; i++) {
        if (bulk[i] !== '') {
          bulkTotal++;
        }
      }
      $('#bulk-semantic-modal').modal('hide');
      this._pageService.loadPages(this.website._id).subscribe( (response: any) => {
        for (let i = 0; i < bulk.length; i++) {
          if (bulk[i] !== '') {
            this._semanticService.create(this.setSemanticTask(bulk[i])).subscribe( (semantic: SemanticTask) => {
              counter++;
              if (response.pages.length > 0) {
                const totalPages = response.pages.length;
                taskTotal = totalPages * bulkTotal;
                response.pages.forEach( (page: Page) => {
                  this._pageService.updateOptimized(page._id, false).subscribe(( responseOptimized: any) => {
                    this._semanticService.createRelationForPage( semantic._id, page._id).subscribe(() => {
                      totalCounter++;
                      if (taskTotal === totalCounter) {
                        this.loadAll();
                        this.updateMenu.next();
                        this.loading = false;
                        this.getSemanticProgress();
                      }
                    });
                  });
                });
              }
            });
          }
        }
      });
    }
  }

  clickOnTab(){
    this.loadAll();
  }

  // Pages

  setPageToUpdate(page: Page) {
    this.selectedPage = page;
    this.getTasks(this.selectedPage._id);
  }

  getTasks(id: string ) {
    this.allSemanticDone = true;
    this._pageService.getTasks( id ).subscribe( (response: any) => {
      this.pageTasks = response.tasks;
      this.pageTasks.forEach( (task: any) => {
        if (!task.status) {
          this.allSemanticDone = false;
        }
      });
    });
  }

  updateAll() {
    const status = !this.allSemanticDone;
    this.pageTasks.forEach( (task: any, index) => {
      if (task.status !== status) {
        this._semanticService.updateStatus(task, status).subscribe(() => {
          if (index === ( this.pageTasks.length - 1)) {
            this.getTasks(this.selectedPage._id);
            this._pageService.updateOptimized(this.selectedPage._id, status).subscribe( () => {
              this.loadAll();
              this.getSemanticProgress();
            });
          }
        });
      }
    });
  }

  statusSemanticTask( task: any) {
    this._semanticService.updateStatus(task._id, !task.status).subscribe( () => {
      this._pageService.getTasks( task.page ).subscribe( (tasks: any) => {
        this.getTasks(this.selectedPage._id);
        let flag = true;
        tasks.tasks.forEach( (t: any) => {
          if (!t.status) {
            flag = false;
          }
        });

        this._pageService.updateOptimized(task.page, flag).subscribe( () => {
          this.loadAll();
          this.getSemanticProgress();
        });
      });
    });
  }

  getSemanticProgress() {
    let semantic: any;
    let done = 0;
    let total = 0;
    let percent = 0;
    let chart = 0;
    let pages = 0;
    let online = 0;
    let sitemap = 0;
    let percentSitemap = 0;
    let counter = 0;
    this._semanticService.loadTasks( this.website._id ).subscribe( (responseSemantic: any) => {
      this._pageService.loadPages( this.website._id ).subscribe( (responsePages: any) => {
        if ( responsePages.count === 0 ) {
          semantic = { percent: percent, chart: chart, pages: pages, online: online, sitemap: sitemap, total: total, done: done };
          this._websiteService.updateSemantic(this.website._id, semantic).subscribe();
        } else {
          pages = responsePages.count;
          responsePages.pages.forEach((page: Page) => {
            if (page.online) {
              online++;
            }
            percentSitemap = Math.round((online * 100) / pages);
            sitemap = Math.ceil(percentSitemap / 5) * 5;
            this._pageService.getTasks(page._id).subscribe( (responseTasks: any) => {
              counter++;
              responseTasks.tasks.forEach( (task: any) => {
                if (task.status) {
                  done++;
                }
              });
              if (responseSemantic.count !== 0) {
                total = responseSemantic.count * responsePages.count;
                percent = Math.round((done * 100) / total);
                chart = Math.ceil(percent / 5) * 5;
              }
              semantic = {percent: percent, chart: chart, pages: pages, online: online, sitemap: sitemap, total: total, done: done};
              if (responsePages.count === counter) {
                this._websiteService.updateSemantic(this.website._id, semantic).subscribe();
              }
            });
          });
        }
      });
    });
  }

}
