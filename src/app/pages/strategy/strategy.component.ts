import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';

// Models
import { Onsite } from '../../models/onsite.model';
import { Offsite } from '../../models/offsite.model';
import { Page } from '../../models/page.model';
import { Analyze } from '../../models/analyze.model';
import { Concurrent } from '../../models/concurrent.model';
import { Website } from '../../models/website.model';
import { BackLink } from '../../models/backLink.model';

// Services
import { OnsiteService, OffsiteService, PageService, SemanticTaskService, WebsiteService, AnalyzeService, ConcurrentService, NetworkService, BackLinkService } from 'src/app/services/service.index';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

declare var $: any;

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styles: [
    'textarea.form-control{height: 200px;font-size: 12px;font-weight: 600;color: #000;}',
    '.month{;padding: 10px 0;margin-bottom: 10px;}',
    '.month-header{margin-bottom: 15px;}',
    '.month-title{padding-top: 5px;text-transform: uppercase;letter-spacing: .02rem;}',
    '.task-board{padding: 10px;}',
    '.no-task{padding: 10px;border: 1px dashed #c4c4c4;}',
    '#editor-modal .modal-dialog { max-width: 90%; }',
    ':host ::ng-deep .ck-editor__editable {min-height: 400px;}',
    '#table-tasks th, #table-tasks td {padding: 4px;}',
    '.label {padding: 3px 5px;font-weight: lighter;font-size: 65%;}',
    '#interlinking-table td, #interlinking-table th{padding: 5px; vertical-align: middle;}',
    '.concurrent .card{border: 1px solid #c6c6c6;margin-bottom: 0;}',
    '.concurrent .card-body{padding: .8rem;}',
    '.concurrent-title{font-size: 12px;font-weight: 600;color: #000;}'
  ]
})
export class StrategyComponent implements OnInit {

  public website: string;
  public currentWebsite: Website;
  public analyze: Analyze;
  public concurrent: Concurrent;
  public concurrence: Concurrent[] = [];
  public timer: any  = 0;
  public months: any[] = [
    { index : 1, month : 'January'},
    { index : 2, month : 'February'},
    { index : 3, month : 'March'},
    { index : 4, month : 'April'},
    { index : 5, month : 'May'},
    { index : 6, month : 'June'},
    { index : 7, month : 'July'},
    { index : 8, month : 'August'},
    { index : 9, month : 'September'},
    { index : 10, month : 'October'},
    { index : 11, month : 'November'},
    { index : 12, month : 'December'}
  ];
  public years: any[] = [];
  public items: any[] = [];

  public formAnalyze: FormGroup;
  public formConcurrent: FormGroup;
  public formPage: FormGroup;
  public formOnsite: FormGroup;
  public formOffsite: FormGroup;

  public month: any;
  public currentMonth: any;

  public onsiteTasks: Onsite[] = [];
  public onsiteLoaded: boolean;
  public offsiteTasks: Offsite[] = [];
  public offsiteLoaded: boolean;
  public pages: Page[] = [];
  public pagesLoaded: boolean;

  public onsite: Onsite;
  public offsite: Offsite;
  public page: Page;

  public Editor = ClassicEditor;
  public editorData = '';
  pageToEditContent: string;
  public textToShow = '';

  pageTasks: any[] = [];

  public showOnsite = true;
  public showOffsite = true;
  public showSitemap = true;
  public showLow = true;
  public showMedium = true;
  public showHigh = true;
  public showDone = true;
  public showUndone = true;
  public showAll = false;
  public hideAll = false;

  public oldItems: any[] = [];
  public old: any[] = [];

  public date = new Date();
  public date2 = new Date();

  public selectedPage: any;
  public allSemanticDone: boolean;
  public columns = 1;

  public interlinkingWebsites: any[] = [];
  public selectedBackLink: Website;
  public selectedTask: Offsite;
  public backLinks: BackLink[];
  public createdBackLink: any;
  public existBackLink: boolean;

  updateMenuContent: Subject<void> = new Subject<void>();
  updateMenuOnPage: Subject<void> = new Subject<void>();
  updateMenuOffsite: Subject<void> = new Subject<void>();
  updateMenuOther: Subject<void> = new Subject<void>();

  constructor( public activatedRoute: ActivatedRoute,
               public _onsiteService: OnsiteService,
               public _offsiteService: OffsiteService,
               public _pageService: PageService,
               public _toasterService: ToasterService,
               public _semanticService: SemanticTaskService,
               public _websiteService: WebsiteService,
               public _analyzeService: AnalyzeService,
               public _concurrentService: ConcurrentService,
               public _networkService: NetworkService,
               public _backLinkService: BackLinkService) {
                this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
                this.date2 = new Date(this.date2.getFullYear(), this.date2.getMonth() + 6 , 1);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe( params => {
      this.website = params['id'];
      this._websiteService.getWebsite(params['id']).subscribe( ( websiteResponse: any) => {
        this.currentWebsite = websiteResponse.website[0];
      });
      this.loadAnalyze();
      this.loadConcurrence();
      this.loadOnsite();
      this.loadOffsite();
      this.loadPages();
      this.verifyIfDataLoaded().then( result => {
        this.getProgress();
        this.makeItems();
      });
      this.loadInterlinking();
    });
    this.formAnalyze = new FormGroup({
      'serp' : new FormControl({ value : '', disabled: false }, [ Validators.minLength(2) ]),
      'recommendation' : new FormControl({ value : '', disabled: false }, [ Validators.minLength(2) ])
    });
    this.formConcurrent = new FormGroup({
      'title' : new FormControl({ value : '', disabled: false }, [ Validators.required, Validators.minLength(2) ]),
    });
    this.formOnsite = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false }, [ Validators.required, Validators.minLength(2) ]),
      'priority': new FormControl()
    });
    this.formOffsite = new FormGroup({
      'type' : new FormControl({ value : '', disabled: false }, [ Validators.required, Validators.minLength(2) ]),
      'url' : new FormControl({ value : '', disabled: false }, [ Validators.minLength(2) ]),
      'target' : new FormControl({ value : '', disabled: false }, [ Validators.minLength(2) ]),
      'anchor' : new FormControl({ value : '', disabled: false }, [ Validators.minLength(2) ]),
      'price' : new FormControl({ value : 0, disabled: false }, [Validators.pattern('^[0-9]*$')]),
      'priority': new FormControl()
    });
    this.formPage = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false }, [ Validators.required, Validators.minLength(2) ]),
      'website' : new FormControl({ value: this.website }),
      'mother' : new FormControl(),
      'keywords' : new FormControl(),
      'priority': new FormControl()
    });
    setTimeout(() => {
      $('[data-toggle=popover]').popover();
    }, 2000);
  }

  loadAnalyze() {
    this._analyzeService.loadAnalyzes(this.website).subscribe( (response: any) => {
      this.analyze = response.analyze[0];
      if (this.analyze) {
        this.formAnalyze.setValue({
          serp: this.analyze.serp,
          recommendation: this.analyze.recommendation
        });
      }
    });
  }

  loadConcurrence() {
    this._concurrentService.loadConcurrence(this.website).subscribe( (response: any) => {
      this.concurrence = response.concurrence;
    });
  }

  loadOnsite() {
    this.onsiteLoaded = false;
    this._onsiteService.loadOnsite(this.website).subscribe( (response: any) => {
      this.onsiteTasks = response.tasks;
      this.onsiteLoaded = true;
    });
  }

  loadOffsite() {
    this.offsiteLoaded = false;
    this._offsiteService.loadOffsite( this.website ).subscribe( (response: any) => {
      this.offsiteTasks = response.tasks;
      this.offsiteLoaded = true;
    });
  }

  loadPages() {
    this.pagesLoaded = false;
    this._pageService.loadPages(this.website).subscribe( (response: any) => {
      this.pages = response.pages;
      this.pagesLoaded = true;
    });
  }

  makeItems() {
    this.items = [];
    this.old = [];
    this.oldItems = [];
    let tempDate = new Date();
    tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);
    tempDate.setMonth(tempDate.getMonth() - 6);

    const date = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);
    let month = date.getMonth();
    let year = date.getFullYear();

    for (let i = 0; i < 18; i++) {
      this.items.push({ index: this.months[month].index, month: this.months[month].month, year: year, onsite: [], offsite : [], pages: [], done: false, date: new Date(year, this.months[month].index - 1) });
      month++;
      if (month === 12) {
        month = 0;
        year++;
      }
    }

    this.items.forEach( (item) => {
      let flag = true;
      if (this.showOnsite) {
        this.onsiteTasks.forEach( (onsite) => {
          if (new Date(onsite.year, onsite.month - 1) >= date) {
            if ( !item.onsite.includes( onsite)) {
              if (onsite.year === item.year && onsite.month === item.index) {
                if (this.showLow && onsite.priority === 'low') {
                  if (this.showDone && onsite.status === true) {
                    item.onsite.push( onsite );
                  }
                  if (this.showUndone && onsite.status === false) {
                    item.onsite.push( onsite );
                  }
                }
                if (this.showMedium && onsite.priority === 'medium') {
                  if (this.showDone && onsite.status === true) {
                    item.onsite.push( onsite );
                  }
                  if (this.showUndone && onsite.status === false) {
                    item.onsite.push( onsite );
                  }
                }
                if (this.showHigh && onsite.priority === 'high') {
                  if (this.showDone && onsite.status === true) {
                    item.onsite.push( onsite );
                  }
                  if (this.showUndone && onsite.status === false) {
                    item.onsite.push( onsite );
                  }
                }
                if (!onsite.status) {
                  flag = false;
                }
              }
            }
          } else {
            if ( !this.oldItems.includes( onsite)) {
              this.oldItems.push(onsite);
            }
          }
        });
      }

      if (this.showOffsite) {
        this.offsiteTasks.forEach( (offsite) => {
          if (new Date(offsite.year, offsite.month - 1) >= date) {
            if ( !item.offsite.includes( offsite)) {
              if ( offsite.month === item.index && offsite.year === item.year) {
                if (this.showLow && offsite.priority === 'low') {
                  if (this.showDone && offsite.status === true) {
                    item.offsite.push( offsite );
                  }
                  if (this.showUndone && offsite.status === false) {
                    item.offsite.push( offsite );
                  }
                }
                if (this.showMedium && offsite.priority === 'medium') {
                  if (this.showDone && offsite.status === true) {
                    item.offsite.push( offsite );
                  }
                  if (this.showUndone && offsite.status === false) {
                    item.offsite.push( offsite );
                  }
                }
                if (this.showHigh && offsite.priority === 'high') {
                  if (this.showDone && offsite.status === true) {
                    item.offsite.push( offsite );
                  }
                  if (this.showUndone && offsite.status === false) {
                    item.offsite.push( offsite );
                  }
                }
                if (!offsite.status) {
                  flag = false;
                }
              }
            }
          } else {
            if ( !this.oldItems.includes( offsite)) {
              this.oldItems.push(offsite);
            }
          }
        });
      }

      if (this.showSitemap) {
        this.pages.forEach( (page) => {
          if (page.year !== undefined || page.month !== undefined) {
            if (new Date(page.year, page.month - 1) >= date) {
              if ( !item.pages.includes( page)) {
                if ( page.month === item.index && page.year === item.year) {
                  if (this.showLow && page.priority === 'low') {
                    if (this.showDone && page.status === true) {
                      item.pages.push( page );
                    }
                    if (this.showUndone && page.status === false) {
                      item.pages.push( page );
                    }
                  }
                  if (this.showMedium && page.priority === 'medium') {
                    if (this.showDone && page.status === true) {
                      item.pages.push( page );
                    }
                    if (this.showUndone && page.status === false) {
                      item.pages.push( page );
                    }
                  }
                  if (this.showHigh && page.priority === 'high') {
                    if (this.showDone && page.status === true) {
                      item.pages.push( page );
                    }
                    if (this.showUndone && page.status === false) {
                      item.pages.push( page );
                    }
                  }
                  if (!page.status) {
                    flag = false;
                  }
                }
              }
            } else {
              if ( !this.oldItems.includes( page)) {
                this.oldItems.push(page);
              }
            }
          }
        });
      }
      item.done = flag;
    });
    this.makeOld();
  }

  makeOld() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 7);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    this._websiteService.getWebsite(this.website).subscribe( (response: any) => {
      const creation = new Date(response.website[0].date);
      let month = creation.getMonth();
      let year = creation.getFullYear();
      let difMonth = 0 ;
      const difYear = currentYear - year;

      difMonth = ( currentYear - year ) * 12 + currentMonth -  month;

      for (let i = 0; i < difMonth; i++) {
        this.old.push({ index: this.months[month].index, month: this.months[month].month, year: year, onsite: [], offsite : [], pages: [], done: false });
        month++;
        if (!this.years.includes(year)) {
          this.years.push( year );
        }
        if (month === 12) {
          month = 0;
          year++;
        }
      }

      this.old.forEach( (current) => {
        let flag = true;
        this.oldItems.forEach( (old) => {
          if ( old.month) {
            if ( old.month === current.index && old.year === current.year) {
              if ( old.type ) {
                if (this.showOffsite) {
                  if (this.showLow && current.priority === 'low') {
                    if (this.showDone && old.status === true) {
                      current.offsite.push(old);
                    }
                    if (this.showUndone && old.status === false) {
                      current.offsite.push(old);
                    }
                  }
                  if (this.showMedium && old.priority === 'medium') {
                    if (this.showDone && old.status === true) {
                      current.offsite.push(old);
                    }
                    if (this.showUndone && old.status === false) {
                      current.offsite.push(old);
                    }
                  }
                  if (this.showHigh && old.priority === 'high') {
                    if (this.showDone && old.status === true) {
                      current.offsite.push(old);
                    }
                    if (this.showUndone && old.status === false) {
                      current.offsite.push(old);
                    }
                  }
                  if (!old.status) {
                    flag = false;
                  }
                }
              } else {
                if ( old.keywords) {
                  if (this.showSitemap) {
                    if (this.showLow && current.priority === 'low') {
                      if (this.showDone && old.status === true && current.page) {
                        current.page.push(old);
                      }
                      if (this.showUndone && old.status === false && current.page) {
                        current.page.push(old);
                      }
                    }
                    if (this.showMedium && old.priority === 'medium') {
                      if (this.showDone && old.status === true && current.page) {
                        current.page.push(old);
                      }
                      if (this.showUndone && old.status === false && current.page) {
                        current.page.push(old);
                      }
                    }
                    if (this.showHigh && old.priority === 'high') {
                      if (this.showDone && old.status === true && current.page) {
                        current.page.push(old);
                      }
                      if (this.showUndone && old.status === false && current.page) {
                        current.page.push(old);
                      }
                    }
                    if (!old.status) {
                      flag = false;
                    }
                  }
                } else {
                  if (this.showOnsite) {
                    if (this.showLow && current.priority === 'low') {
                      if (this.showDone && old.status === true) {
                        current.onsite.push(old);
                      }
                      if (this.showUndone && old.status === false) {
                        current.onsite.push(old);
                      }
                    }
                    if (this.showMedium && old.priority === 'medium') {
                      if (this.showDone && old.status === true) {
                        current.onsite.push(old);
                      }
                      if (this.showUndone && old.status === false) {
                        current.onsite.push(old);
                      }
                    }
                    if (this.showHigh && old.priority === 'high') {
                      if (this.showDone && old.status === true) {
                        current.onsite.push(old);
                      }
                      if (this.showUndone && old.status === false) {
                        current.onsite.push(old);
                      }
                    }
                    if (!old.status) {
                      flag = false;
                    }
                  }
                }
              }
            }
          }
        });
        current.done = flag;
      });
    });
  }

  verifyIfDataLoaded() {
    return new Promise( (resolve, reject) => {
      const interval = setInterval( () => {
        if ( this.onsiteLoaded && this.offsiteLoaded && this.pagesLoaded ) {
          resolve(true);
          clearInterval(interval);
        }
      }, 10);
    });
  }

  setMonth( item: any) {
    this.formOnsite.reset();
    this.formOffsite.reset();
    this.formPage.reset();
    this.month = item;
  }

  typeAnalyze() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.analyze) {
        this.updateAnalyze();
      } else {
        this.newAnalyze();
      }
    }, 5000);
  }

  resetCounter() {
    clearTimeout(this.timer);
  }

  reloadAll() {
    this.loadOnsite();
    this.loadOffsite();
    this.loadPages();
    this.verifyIfDataLoaded().then( result => {
      this.makeItems();
    });
  }


  // Analyze

  newAnalyze() {
    this._analyzeService.create(this.setAnalyze()).subscribe((response: any) => {
      this.analyze = response.analyze;
    });
  }

  updateAnalyze() {
    this._analyzeService.update(this.setAnalyze(this.analyze._id)).subscribe();
  }

  setAnalyze(id = null) {
    if (id === null) {
      return new Analyze(this.formAnalyze.value.serp, this.formAnalyze.value.recommendation, this.website);
    } else {
      return new Analyze(this.formAnalyze.value.serp, this.formAnalyze.value.recommendation, this.website, null, this.analyze._id);
    }
  }

  // Concurrence

  saveConcurrent() {
    if ( this.formConcurrent.valid) {
      if (this.concurrent) {
        this._concurrentService.update(this.setConcurrent(this.concurrent._id)).subscribe( () => {
          this.formConcurrent.reset();
          this.editorData = '';
          this.concurrent = undefined;
          this.loadConcurrence();
        });
      } else {
        this._concurrentService.create(this.setConcurrent()).subscribe( () => {
          this.formConcurrent.reset();
          this.editorData = '';
          this.loadConcurrence();
        });
      }
      $('#concurrent-modal').modal('hide');
    } else {
      console.log('Hackerman...');
    }
  }

  getConcurrent( concurrent: Concurrent ) {
    this.concurrent = concurrent;
    this.formConcurrent.controls['title'].setValue(this.concurrent.title);
    if (this.concurrent.content !== '') {
      this.editorData = this.concurrent.content;
    }
  }

  setConcurrent(id= null) {
    if (id === null) {
      return new Concurrent(this.formConcurrent.value.title, this.editorData.toString() , this.website);
    } else {
      return new Concurrent(this.formConcurrent.value.title, this.editorData.toString() , this.website, this.concurrent._id);
    }
  }

  deleteConcurrent( concurrent: string) {
    this._concurrentService.delete(concurrent).subscribe( () => {
      this.loadConcurrence();
    });
  }

  // Onsite

  saveOnsite(close = false) {
    if ( this.formOnsite.valid) {
      this._onsiteService.create(this.setOnsite()).subscribe( () => {
        this.formOnsite.reset();
        if (close) {
          $('#task-modal').modal('hide');
        }
        this.loadOnsite();
        this.updateMenuOther.next();
        this.verifyIfDataLoaded().then( () => {
          this.makeItems();
        });
        this.getProgress();
      });
    } else {
      console.log('Hackerman...');
    }
  }

  setOnsite( id: any = null ) {
    let priority: any;
    if (this.formOnsite.value.priority === null) {
      priority = 'low';
    } else {
      priority = this.formOnsite.value.priority;
    }
    return new Onsite( this.formOnsite.value.name, this.month.index, this.month.year, this.website, this.month.index + '/' + this.month.year , this.onsiteTasks.length, priority, null, null, id);
  }

  statusOnsite( task: Onsite) {
    this._onsiteService.updateStatus( task._id, !task.status).subscribe( () => {
      this.loadOnsite();
      this.updateMenuOther.next();
      this.verifyIfDataLoaded().then( () => {
        this.makeItems();
      });
      this.getProgress();
    });
  }

  setUpdateOnsite( onsite: Onsite, item: any) {
    this.month = item;
    this.onsite = onsite;
    this.formOnsite.controls['name'].setValue(this.onsite.name);
    this.formOnsite.controls['priority'].setValue(this.onsite.priority);
  }

  updateOnsite() {
    if ( this.formOnsite.valid ) {
      this._onsiteService.updateOnsite(this.setOnsite(this.onsite._id)).subscribe( () => {
        this.formOnsite.reset();
        this.onsite = null;
        $('#onsite-modal').modal('hide');
        this.loadOnsite();
        this.verifyIfDataLoaded().then( () => {
          this.makeItems();
        });
      });
    } else {
      console.log('Hackerman...');
    }
  }

  deleteOnsite( onsite: any) {
    this._onsiteService.delete(onsite._id).subscribe( () => {
      this.loadOnsite();
      this.updateMenuOther.next();
      this.verifyIfDataLoaded().then( () => {
        this.makeItems();
      });
      this.getProgress();
    });
  }

  duplicateOnsite( onsite: Onsite) {
    this._onsiteService.create({
      name: onsite.name + '(D)',
      month: onsite.month,
      year: onsite.year,
      website: onsite.website,
      programed: onsite.programed,
      order: onsite.order,
      priority: onsite.priority
    }).subscribe( () => {
      this.loadOnsite();
      this.updateMenuOther.next();
      this.verifyIfDataLoaded().then( () => {
        this.makeItems();
      });
      this.getProgress();
    });
  }

  // Offsite

  saveOffsite(close = false) {
    if ( this.formOffsite.valid ) {
      this._offsiteService.create(this.setOffsite()).subscribe( () => {
        this.formOffsite.reset();
        if (close) {
          $('#task-modal').modal('hide');
        }
        this.loadOffsite();
        this.updateMenuOffsite.next();
        this.verifyIfDataLoaded().then( () => {
          this.makeItems();
        });
        this.getProgress();
        this.getBackLinks();
      });
    } else {
      console.log('Hackerman...');
    }
  }

  setOffsite( id: any = null) {
    let priority: any;
    if (this.formOffsite.value.priority === null) {
      priority = 'low';
    } else {
      priority = this.formOffsite.value.priority;
    }
    return new Offsite( this.formOffsite.value.type, this.month.index, this.month.year, this.website, this.month.index + '/' + this.month.year, this.formOffsite.getRawValue().url, this.formOffsite.value.target, this.formOffsite.value.anchor, this.formOffsite.value.price, priority, this.onsiteTasks.length, false, id);
  }

  statusOffsite( offsite: Offsite ) {
    let status: boolean;
    if (offsite.status) {
      status = false;
    } else {
      if (!offsite.url || offsite.url === '') {
        this._toasterService.pop('error', 'Error!', 'Offsite task can\'t be validated without URL!');
        return;
      } else {
        status = true;
      }
    }

    this._offsiteService.updateStatus( offsite._id, status).subscribe( () => {
      this.loadOffsite();
      this.updateMenuOffsite.next();
      this.verifyIfDataLoaded().then( () => {
        this.makeItems();
      });
      this.getProgress();
      this.getBackLinks();
    });
  }

  setUpdateOffsite( offsite: Offsite , item: any) {
    this.checkForBackLink(offsite._id);
    this.month = item;
    this.offsite = offsite;
    this.formOffsite.controls['url'].setValue(this.offsite.url);
    this.formOffsite.controls['type'].setValue(this.offsite.type);
    this.formOffsite.controls['target'].setValue(this.offsite.target);
    this.formOffsite.controls['anchor'].setValue(this.offsite.anchor);
    this.formOffsite.controls['price'].setValue(this.offsite.price);
    this.formOffsite.controls['priority'].setValue(this.offsite.priority);
  }

  updateOffsite() {
    if ( this.formOffsite.valid ) {
      if (this.existBackLink) {
        if (!this.formOffsite.getRawValue().url.includes(this.createdBackLink.sender.domain)) {
          this._toasterService.pop('error', 'Error!', 'You can\'t change URL when you\'ve already created a backlink!');
          return;
        }
      }
      this._offsiteService.updateOffsite(this.setOffsite(this.offsite._id)).subscribe( () => {
        this.formOffsite.reset();
        this.offsite = null;
        $('#offsite-modal').modal('hide');
        this.loadOffsite();
        this.verifyIfDataLoaded().then( () => {
          this.makeItems();
        });
      });
      if (!this.existBackLink && this.selectedBackLink && this.formOffsite.getRawValue().url.includes(this.selectedBackLink.domain)) {
        this._backLinkService.create(this.setBackLink()).subscribe( () => {
          this.selectedBackLink = undefined;
          this.loadInterlinking();
        });
      }
    } else {
      console.log('Hackerman...');
    }
  }

  deleteOffsite( offsite: any) {
    this._backLinkService.getByTask(offsite._id).subscribe( (response: any) => {
      if (response.backLinks.length > 0) {
        this._backLinkService.delete(response.backLinks[0]._id).subscribe((res: any) => {
          this._offsiteService.delete(offsite._id).subscribe( () => {
            this.loadOffsite();
            this.updateMenuOffsite.next();
            this.verifyIfDataLoaded().then( () => {
              this.makeItems();
            });
            this.getProgress();
            this.getBackLinks();
            this.loadInterlinking();
          });
        });
      } else {
        this._offsiteService.delete(offsite._id).subscribe( () => {
          this.loadOffsite();
          this.updateMenuOffsite.next();
          this.verifyIfDataLoaded().then( () => {
            this.makeItems();
          });
          this.getProgress();
        });
      }
    });
  }

  duplicateOffsite( offsite: Offsite) {
    this._offsiteService.create({
      type: offsite.type + '(D)',
      month: offsite.month,
      year: offsite.year,
      website: offsite.website,
      programed: offsite.programed,
      target: offsite.target,
      anchor: offsite.anchor,
      price: offsite.price,
      priority: offsite.priority,
      order: offsite.order
    }).subscribe( () => {
      this.loadOffsite();
      this.updateMenuOffsite.next();
      this.verifyIfDataLoaded().then( () => {
        this.makeItems();
      });
      this.getProgress();
      this.getBackLinks();
    });
  }

  // Sitemap

  newPage(close = false) {
    if ( this.formPage.valid ) {
      this._pageService.create( this.setPage()).subscribe( (response: any) => {
        if (close) {
          $('#task-modal').modal('hide');
        }
        this._semanticService.loadTasks( this.website ).subscribe( (tasks: any) => {
          this.loadPages();
          this.updateMenuContent.next();
          this.verifyIfDataLoaded().then( () => {
            this.makeItems();
          });
          if (tasks.tasks.length > 0) {
            tasks.tasks.forEach( (task: any) => {
              this._semanticService.createRelationForPage( task._id, response._id).subscribe();
            });
            this.getProgress();
          }
        });
      });
    } else {
      console.log('Hackerman...');
    }
  }

  setPage( id: any = null) {
    let priority: any;
    if (this.formPage.value.priority === null) {
      priority = 'low';
    } else {
      priority = this.formPage.value.priority;
    }
    return new Page(this.formPage.value.name, this.website, this.pages.length, this.formPage.value.keywords, false, false, false, this.formPage.value.mother, priority, this.month.index, this.month.year, null, id, null, this.month.index + '/' + this.month.year );
  }

  setUpdatePage( page: Page, item: any) {
    this.month = item;
    this.page = page;
    this.formPage.controls['name'].setValue(this.page.name);
    this.formPage.controls['mother'].setValue(this.page.mother, {onlySelf: true});
    this.formPage.controls['keywords'].setValue(this.page.keywords);
    this.formPage.controls['priority'].setValue(this.page.priority);
  }

  updatePage() {
    if ( this.formPage.valid ) {
      this._pageService.updatePage(this.setPage(this.page._id)).subscribe( () => {
        this.formPage.reset();
        this.page = null;
        $('#sitemap-modal').modal('hide');
        this.loadPages();
        this.verifyIfDataLoaded().then( () => {
          this.makeItems();
        });
      });
    } else {
      console.log('Hackerman...');
    }
  }

  deleteSitemap( page: any) {
    this._pageService.delete(page._id).subscribe( () => {
      this.loadPages();
      this.updateMenuContent.next();
      this.verifyIfDataLoaded().then( () => {
        this.makeItems();
      });
      this._pageService.getTasks( page._id ).subscribe( (response: any) => {
        response.tasks.forEach((task: any) => {
          this._semanticService.deleteRelationForPage(task._id).subscribe();
        });
        this.getProgress();
      });
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

  showText(content: string) {
    this.textToShow = content;
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
        this.verifyIfDataLoaded().then( () => {
          this.makeItems();
        });
      });
    } else {
      this._pageService.updateCreated(this.pageToEditContent, false).subscribe( () => {
        this.loadPages();
        this.verifyIfDataLoaded().then( () => {
          this.makeItems();
        });
      });
    }
    $('#editor-modal').modal('hide');
  }

  statusPageOnline(page: Page) {
    this._pageService.updateOnline(page._id, !page.online).subscribe(() => {
      this.loadPages();
      this.updateMenuContent.next();
      this.updateMenuOnPage.next();
      this.verifyIfDataLoaded().then( () => {
        this.makeItems();
      });
    });
  }

  duplicateSitemap(page: Page) {
    this._pageService.create({
      name: page.name + ' (D)',
      website: page.website,
      order: page.order,
      keywords: page.keywords,
      created: false,
      online: false,
      optimized: false,
      month: page.month,
      year: page.year,
      programed: page.programed,
      priority: page.priority,
    }).subscribe( (response: any) => {
      this._pageService.loadPages(this.website).subscribe( () => {
        this._semanticService.loadTasks( this.website ).subscribe( (tasks: any) => {

          this.loadPages();
          this.updateMenuContent.next();
          this.updateMenuOnPage.next();
          this.verifyIfDataLoaded().then( () => {
            this.makeItems();
          });
          if (tasks.tasks.length > 0) {
            tasks.tasks.forEach( (task: any) => {
              this._semanticService.createRelationForPage( task._id, response._id);
            });
            this.getProgress();
          }
        });
      });

    });
  }

  // Semantic tasks

  getTasks( id: string) {
    this.selectedPage = id;
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
            this.getTasks(this.selectedPage);
            this._pageService.updateOptimized(this.selectedPage, status).subscribe( () => {
              this.loadPages();
              this.verifyIfDataLoaded().then( () => {
                this.makeItems();
              });
              this.getProgress();
            });
          }
        });
      }
    });
  }

  statusSemanticTask( task: any) {
    this._semanticService.updateStatus(task._id, !task.status).subscribe( () => {
      this._pageService.getTasks( task.page ).subscribe( (tasks: any) => {
        this.updateMenuOnPage.next();
        this.getTasks(this.selectedPage);
        let flag = true;
        tasks.tasks.forEach( (t: any) => {
          if (!t.status) {
            flag = false;
          }
        });
        this._pageService.updateOptimized(task.page, flag).subscribe( () => {
          this.loadPages();
          this.verifyIfDataLoaded().then( () => {
            this.makeItems();
          });
          this.getProgress();
        });
      });
    });
  }

  // Drag and drop

  drop( event: CdkDragDrop<any> ) {
    if (event.previousContainer !== event.container) {
      const type = event.item.element.nativeElement.classList[1];
      transferArrayItem(event.previousContainer.data[type], event.container.data[type], event.previousIndex, event.currentIndex);
      if (type === 'onsite') {
        this._onsiteService.updateMonth( event.item.data._id, event.container.data.index, event.container.data.year ).subscribe( () => {
        });
      }
      if (type === 'offsite') {
        this._offsiteService.updateMonth( event.item.data._id, event.container.data.index, event.container.data.year ).subscribe( () => {
        });
      }
      if (type === 'pages') {
        this._pageService.updateMonth( event.item.data._id, event.container.data.index, event.container.data.year ).subscribe( () => {
        });
      }
    }
  }

  // Filters

  filterCategory( event: any) {
    switch (event.path[0].value) {
      case 'Other': {
         this.showOnsite = true;
         this.showOffsite = false;
         this.showSitemap = false;
         break;
      }
      case 'Backlink': {
        this.showOnsite = false;
        this.showOffsite = true;
        this.showSitemap = false;
         break;
      }
      case 'Content': {
        this.showOnsite = false;
        this.showOffsite = false;
        this.showSitemap = true;
        break;
     }
      default: {
        this.showOnsite = true;
        this.showOffsite = true;
        this.showSitemap = true;
         break;
      }
   }
   this.makeItems();
  }

  filterPriority( event: any) {
    switch (event.path[0].value) {
      case 'Low': {
        this.showLow = true;
        this.showMedium = false;
        this.showHigh = false;
        break;
      }
      case 'Medium': {
        this.showLow = false;
        this.showMedium = true;
        this.showHigh = false;
        break;
      }
      case 'High': {
        this.showLow = false;
        this.showMedium = false;
        this.showHigh = true;
        break;
     }
      default: {
        this.showLow = true;
        this.showMedium = true;
        this.showHigh = true;
        break;
      }
    }
    this.makeItems();
  }

  filterStatus( event: any) {
    if (event.path[0].value === 'Done' ) {
      this.showDone = true;
      this.showUndone = false;
    }
    if (event.path[0].value === 'Unfinished') {
      this.showDone = false;
      this.showUndone = true;
    }
    if (event.path[0].value === 'Status') {
      this.showDone = true;
      this.showUndone = true;
    }
    this.makeItems();
  }

  changeColumns( event: any) {
    if (event.path[0].value === '1' ) {
      this.columns = 1;
    }
    if (event.path[0].value === '2') {
      this.columns = 2;
    }
    if (event.path[0].value === '3') {
      this.columns = 3;
    }
  }

  showHide(event: any) {
    if ( event.path[0].value === 'Auto') {
      this.showAll = false;
      this.hideAll = false;
      this.makeItems();
    }
    if ( event.path[0].value === 'Show all') {
      this.showAll = true;
      $('.month-collapse').collapse('show');
    }

    if ( event.path[0].value === 'Hide all') {
      this.hideAll = true;
      $('.month-collapse').collapse('hide');
    }
  }

  resetFilters() {
    this.showOnsite = true;
    this.showOffsite = true;
    this.showSitemap = true;
    this.showLow = true;
    this.showMedium = true;
    this.showHigh = true;
    this.showDone = true;
    this.showUndone = true;
    $('#category').prop('selectedIndex', 0);
    $('#priority').prop('selectedIndex', 0);
    $('#status').prop('selectedIndex', 0);

    this.makeItems();
  }

  // Interlink

  loadInterlinking() {
    this.interlinkingWebsites = [];
    this._backLinkService.getBackLinksFromWebsite(this.website).subscribe( (response: any) => {
      this.backLinks = response.backLinks;
      this._networkService.loadNetworks().subscribe( (userNetworks: any) => {
        let networkCounter = 0;
        userNetworks.networks.forEach( (network: any) => {
          this._networkService.loadWebsiteFromNetwork( network.network._id).subscribe( (websitesNetwork: any) => {
            networkCounter++;
            websitesNetwork.websites.forEach( (websiteNetwork: any) => {
              if (this.interlinkingWebsites.filter(website => (website.data._id === websiteNetwork.website._id)).length === 0 && websiteNetwork.website._id !== this.website ) {
                this.interlinkingWebsites.push({
                  sender: this.backLinks.filter(backLink => (backLink.sender === websiteNetwork.website._id)).length > 0,
                  receiver: this.backLinks.filter(backLink => (backLink.receiver === websiteNetwork.website._id)).length > 0,
                  both: this.backLinks.filter(backLink => (backLink.sender === websiteNetwork.website._id)).length > 0 && this.backLinks.filter(backLink => (backLink.receiver === websiteNetwork.website._id)).length > 0,
                  data: websiteNetwork.website,
                  networks: null
                });
              }
            });
            if (userNetworks.count === networkCounter) {
              this.interlinkingWebsites.forEach( (interlink: any) => {
                this.getNetworkFromWebsite(interlink.data._id).subscribe( networks => interlink.networks = networks );
              });
            }
          });
        });
      });
    });
  }

  getNetworkFromWebsite(id: string) {
    return new Observable( observer => {
      const networks: any[] = [];
      this._networkService.loadNetworksFromWebsite(id).subscribe( (response: any) => {
        if (response.count > 0) {
          response.networks.forEach((element: any) => {
            networks.push(element.network);
          });
        }
        observer.next(networks);
      });
    });
  }

  initTable(task: Offsite, item: any ) {
    this.checkForBackLink(task._id);
    this.month = item;
    this.selectedTask = task;
    if ( !$.fn.dataTable.isDataTable( '#interlinking-table' ) ) {
      $('#interlinking-table').DataTable({pageLength: 25});
    }
  }

  checkForBackLink(id: string) {
    this.existBackLink = false;
    this._backLinkService.getByTask(id).subscribe( (response: any) => {
      if (response.backLinks.length > 0) {
        this.existBackLink = true;
        this.createdBackLink = response.backLinks[0];
      }
    });
  }

  selectBackLink( website: Website ) {
    if ($('#checkbox-' + website._id).is(':checked')) {
      this.selectedBackLink = website;
      $('input:checkbox[name=check-back-link]').each(function() {
        $(this).prop('checked', false);
      });
      $('#checkbox-' + website._id).prop('checked', true);
    } else {
      this.selectedBackLink = undefined;
    }
  }

  createLink() {
    this.selectedTask.url = this.selectedBackLink.domain;
    this.selectedTask.target = this.currentWebsite.domain;
    this.setUpdateOffsite( this.selectedTask, this.month);
    $('#interlink-modal').modal('hide');
    $('#offsite-modal').modal('show');
  }

  setBackLink() {
    return new BackLink(this.selectedBackLink._id, this.currentWebsite._id, this.offsite._id);
  }

  getProgress (flag = false) {
    const date = new Date();
    let total = 0;
    let done = 0;
    let progress: any;
    let chart = 0;
    let percent = 0;
    this._onsiteService.loadOnsiteOfMonth(this.website, date.getMonth() + 1).subscribe( (onsite: any) => {
      total += onsite.total;
      done += onsite.done;
      if (onsite.total !== 0) {
        percent = Math.round((done * 100) / total);
        chart = Math.ceil(percent / 5) * 5;
      }
      const onsiteProgress = { total: total, done: done, chart: chart, pending: total - done };
      this._offsiteService.loadOffsiteOfMonth(this.website, date.getMonth() + 1 ).subscribe( (offsite: any) => {
        total += offsite.total;
        done += offsite.done;
        this._pageService.loadPagesOfMonth(this.website, date.getMonth() + 1).subscribe( (sitemap: any) => {
          total += sitemap.total;
          done += sitemap.done;
          if (total === 0) {
            progress = { percent: 0, chart: 0, total: 0, pendingContent: 0, pendingBacklink: 0, pendingOther : 0};
          } else {
            progress = { percent: Math.round((done * 100) / total), chart: Math.ceil(Math.round((done * 100) / total) / 5) * 5, total : total, pendingContent: sitemap.total - sitemap.done, pendingBacklink: offsite.total - offsite.done, pendingOther: onsite.total - onsite.done};
          }
          this._websiteService.updateOnsite(this.website, onsiteProgress).subscribe();
          this._websiteService.updateProgress(this.website, progress).subscribe();
        });
      });
    });
  }

  getBackLinks() {
    let total = 0;
    let done = 0;
    let percent = 0;
    let chart = 0;
    this._offsiteService.loadOffsite(this.website).subscribe( (responseOffsite: any) => {
      if (responseOffsite.count > 0) {
        total = responseOffsite.count;
        responseOffsite.tasks.forEach( (task: Offsite) => {
          if (task.status) {
            done++;
          }
        });
        percent = Math.round((done * 100) / total);
        chart = Math.ceil(percent / 5) * 5;
      }
      this._websiteService.updateOffsite(this.website, { total, done, chart}).subscribe();
    });
  }

  bulkPages() {
    if ($('#bulk-pages').val() !== '') {
      let createdPages = 0;
      const bulk = $('#bulk-pages').val().split('\n');
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
              this._pageService.create( new Page(name, this.website, this.pages.length, null, false, false, false, null, 'low', this.month.index, this.month.year, null, null, null, this.month.index + '/' + this.month.year ) ).subscribe( (page: any) => {
                createdPages++;
              this._semanticService.loadTasks( this.website ).subscribe( (tasks: any) => {
                if (tasks.tasks.length > 0) {
                  tasks.tasks.forEach( (task: any, index: any) => {
                    this._semanticService.createRelationForPage( task._id, page._id);
                  });
                }
              });
              if (createdPages === counter) {
                $('#task-modal').modal('hide');
                $('#bulk-pages').val('');
                this.loadPages();
                this.updateMenuContent.next();
                this.verifyIfDataLoaded().then( () => {
                  this.makeItems();
                });
                this.getProgress();
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
            this._pageService.create( new Page(name, this.website, this.pages.length, null, false, false, false, null, 'low', this.month.index, this.month.year, null, null, null, this.month.index + '/' + this.month.year ) ).subscribe( (page: any) => {
              createdPages++;
              this._semanticService.loadTasks( this.website ).subscribe( (tasks: any) => {
                if (tasks.tasks.length > 0) {
                  tasks.tasks.forEach( (task: any, index: any) => {
                    this._semanticService.createRelationForPage( task._id, page._id);
                  });
                }
              });
              if (createdPages === counter) {
                $('#task-modal').modal('hide');
                $('#bulk-pages').val('');
                this.loadPages();
                this.updateMenuContent.next();
                this.verifyIfDataLoaded().then( () => {
                  this.makeItems();
                });
                this.getProgress();
              }
            });
          } else {
            counter--;
          }
        }
      }
    }
  }
}
