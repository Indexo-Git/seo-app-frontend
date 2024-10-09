import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

// Models
import { Website } from '../../models/website.model';
import { Page } from '../../models/page.model';
import { Keyword } from '../../models/keyword.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { WebsiteService, KeywordService, PageService, SemanticTaskService } from 'src/app/services/service.index';

declare var $: any;

@Component({
  selector: 'app-basic-seo',
  templateUrl: './basic-seo.component.html',
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
    '#editor-modal .modal-dialog { max-width: 90%; }',
    ':host ::ng-deep .ck-editor__editable {min-height: 400px;}',
    '.table th, .table td {padding: 4px;}'
  ]
})

export class BasicSeoComponent implements OnInit {

  public loading: boolean;
  public website: Website;
  public keywords: Keyword[] = [];
  public totalKeywords: number;
  public total: number;

  public pageForm: FormGroup;
  public page: Page;
  public pagesForm: Page[] = [];
  public pages: any[] = [];
  public rawPages: Page[] = [];

  public allSemanticDone: boolean;
  public pageTasks: any[] = [];
  public pageToEditContent: string;

  public Editor = ClassicEditor;
  public editorData = '';

  updateMenu: Subject<void> = new Subject<void>();

  constructor( public _websiteService: WebsiteService,
               public activatedRoute: ActivatedRoute,
               public _keywordService: KeywordService,
               public _pageService: PageService,
               public _semanticService: SemanticTaskService,
               public _toasterService: ToasterService) {
  }

  ngOnInit() {
    this.loading = true;
    this.pageForm = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false }, [ Validators.required, Validators.minLength(2) ]),
      'website' : new FormControl({ value: this.website }),
      'mother' : new FormControl(),
      'keywords' : new FormControl(),
    });

    this.activatedRoute.params.subscribe( params => {
      this._websiteService.getWebsite(params['id']).subscribe( ( websiteResponse: any) => {
        this.website = websiteResponse.website[0];
        this.loadPages();
      });
    });
  }

  loadKeywords() {
    this._keywordService.loadKeywords(this.website._id).subscribe( ( keywordsResponse: any) => {
      this.keywords = keywordsResponse.keywords;
      this.totalKeywords = keywordsResponse.count;
    });
  }

  loadPages() {
    this._pageService.loadPagesForTable(this.website._id).subscribe( (response: any) => {
      this.pages = response;
      setTimeout(() => {
        $('[data-toggle=popover]').popover();
      }, 500);
      this._pageService.loadPages(this.website._id).subscribe( (pagesRawResponse: any) => {
        this.rawPages = pagesRawResponse.pages;
        this.total = pagesRawResponse.count;
        this.loading = false;
      });
    });
  }

  // Drops
  /*------------------------------------------------*/

  dropPage(array: any, event: CdkDragDrop<string[]>) {
    if ( event.previousIndex !== event.currentIndex) {
      moveItemInArray(array, event.previousIndex, event.currentIndex);
      this._pageService.updateOrder(array);
    }
  }


  // Pages processes
  /*------------------------------------------------*/

  newPage() {
    this.loading = true;
    this._pageService.create( this.setPage() ).subscribe( (page: any) => {
      $('#new-page-modal').modal('hide');
      this.pageForm.reset();
      this._semanticService.loadTasks( this.website._id ).subscribe( (tasks: any) => {
        if (tasks.tasks.length > 0) {
          tasks.tasks.forEach( (task: any) => {
            this._semanticService.createRelationForPage( task._id, page._id);
          });
        }
        this.loadPages();
        this.updateMenu.next();
        this.getSemanticProgress();
      });
    });
  }

  statusPageOnline(page: Page) {
    this._pageService.updateOnline(page._id, !page.online).subscribe((response: any) => {
      this.loadPages();
      this.updateMenu.next();
      this.getSemanticProgress();
    });
  }

  getText( id: string, content: string) {
    this.pageToEditContent = id;
    if (content) {
      this.editorData = content;
    } else {
      this.editorData = '';
    }
  }

  onTextChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    this.editorData = data;
  }

  updateContent() {
    this._pageService.updateContent(this.pageToEditContent, this.editorData).subscribe();
    if (this.editorData !== '') {
      this._pageService.updateCreated(this.pageToEditContent, true).subscribe( () => {
        this.loadPages();
        this.updateMenu.next();
      });
    } else {
      this._pageService.updateCreated(this.pageToEditContent, false).subscribe( () => {
        this.loadPages();
        this.updateMenu.next();
      });
    }
    $('#editor-modal').modal('hide');
  }

  getPagesForm() {
    this._pageService.loadPages(this.website._id).subscribe( (response: any) => {
      this.pagesForm = response.pages;
      this.pageForm.setValue({ 'name': this.page.name, 'mother' : this.page.mother ? this.page.mother : null, 'keywords' : this.page.keywords, 'website' : this.website });
    });
  }

  setPageForm( page: Page) {
    this.page = page;
    this.getPagesForm();
  }

  updatePage() {
    if ( this.pageForm.valid ) {
      if (this.page._id === this.pageForm.value.mother) {
        this._toasterService.pop('error', 'Oops!', 'You can\'t assign a page as a daughter of herself!');
        return;
      }
      this._pageService.updatePage(this.setPage()).subscribe( () => {
        this.loadPages();
        this.updateMenu.next();
        $('#edit-page-modal').modal('hide');
        this.pageForm.reset();
      });
    } else {
      console.log('Hackerman...');
    }
  }

  setPage() {
    let order = this.total + 1;
    let priority = 'low';
    let id = null;
    if (this.page) {
      order = this.page.order;
      priority = this.page.priority;
      id = this.page._id;
    }
    return new Page(
      this.pageForm.value.name,
      this.website._id,
      order,
      this.pageForm.value.keywords,
      true,
      true,
      false,
      this.pageForm.value.mother,
      priority,
      null,
      null,
      null,
      id,
      null,
      null,
      new Date());
  }

  bulkPages() {
    this.loading = true;
    if ($('#bulk-pages').val() !== '') {
      this.loading = true;
      const bulk = $('#bulk-pages').val().split('\n');
      let createdPages = 0;
      if ($('#radio-xml')[0].checked) {
        let counter = 0;
        for (let i = 0; i < bulk.length; i++) {
          if (bulk[i] !== '') {
            if (bulk[i].indexOf('loc') > -1) {
              counter++;
            }
          }
        }
        for (let i = 0; i < bulk.length; i++) {
          let name = '';
          if (bulk[i] !== '') {
            if (bulk[i].indexOf('loc') > -1) {
              name = bulk[i].split('<loc>').pop().split('</loc>')[0];
              this._pageService.create( { name: name, website: this.website._id, order: 0, keywords: null, created: true, online: true, optimized: false, dateOnline: new Date()} ).subscribe( (page: any) => {
                createdPages++;
                // this._pageService.loadPages(this.website._id).subscribe( (response: any) => {
                  this._semanticService.loadTasks( this.website._id ).subscribe( (tasks: any) => {
                    if (tasks.tasks.length > 0) {
                      tasks.tasks.forEach( (task: any, index: any) => {
                        this._semanticService.createRelationForPage( task._id, page._id);
                      });
                    }
                  });
                // });
                if (createdPages === counter) {
                  $('#bulk-page-modal').modal('hide');
                  $('#bulk-pages').val('');
                  this.loadPages();
                  this.getSemanticProgress();
                  this.updateMenu.next();
                }
              });
            }
          }
        }
      } else {
        let counter = bulk.length;
        for (let i = 0; i < bulk.length; i++) {
          let name = '';
          if (bulk[i] !== '') {
            name = bulk[i];
            this._pageService.create( { name: name, website: this.website._id, order: 0, keywords: null, created: true, online: true, optimized: false, dateOnline: new Date()} ).subscribe( (page: any) => {
              createdPages++;
              // this._pageService.loadPages(this.website._id).subscribe( (response: any) => {
                this._semanticService.loadTasks( this.website._id ).subscribe( (tasks: any) => {
                  if (tasks.tasks.length > 0) {
                    tasks.tasks.forEach( (task: any, index: any) => {
                      this._semanticService.createRelationForPage( task._id, page._id);
                    });
                  }
                });
              // });
              if (createdPages === counter) {
                $('#bulk-page-modal').modal('hide');
                $('#bulk-pages').val('');
                this.loadPages();
                this.getSemanticProgress();
                this.updateMenu.next();
              }
            });
          } else {
            counter--;
          }
        }
      }

      /*for (let i = 0; i < bulk.length; i++) {
        let name = '';
        if (bulk[i] !== '') {
          if ($('#radio-xml')[0].checked) {
            if (bulk[i].indexOf('http') > -1) {
              if (bulk[i].indexOf('urlset') < 0) {
                name = bulk[i];
                if (bulk[i].indexOf('loc') > -1) {
                  name = bulk[i].split('<loc>').pop().split('</loc>')[0];
                }
              }
            }
          } else {
            name = bulk[i];
          }
          this._pageService.create( { name: name, website: this.website._id, order: 0, keywords: null, created: true, online: true, optimized: false, dateOnline: new Date()} ).subscribe( (page: any) => {
            createdPages++;
            // this._pageService.loadPages(this.website._id).subscribe( (response: any) => {
              this._semanticService.loadTasks( this.website._id ).subscribe( (tasks: any) => {
                if (tasks.tasks.length > 0) {
                  tasks.tasks.forEach( (task: any, index: any) => {
                    this._semanticService.createRelationForPage( task._id, page._id);
                  });
                }

              });
            // });
            if (createdPages === counter) {
              $('#bulk-page-modal').modal('hide');
              $('#bulk-pages').val('');
              this.loadPages();
              this.updateMenu.next();
            }
          });
        } else {
          counter--;
        }
      }*/
    }
  }

  deletePage(page: any) {
    this.loading = true;
    this._pageService.getTasks( page._id ).subscribe( (response: any) => {
      response.tasks.forEach((task: any) => {
        this._semanticService.deleteRelationForPage(task._id).subscribe();
      });
      this._pageService.delete(page._id).subscribe( () => {
        this.loadPages();
        this.updateMenu.next();
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
