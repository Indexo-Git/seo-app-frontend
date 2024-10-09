import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs';

// Services
import { WebsiteService } from '../../services/website/website.service';
import { OnsiteService } from '../../services/onsite/onsite.service';
import { OffsiteService } from '../../services/offsite/offsite.service';
import { PageService } from '../../services/page/page.service';


@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styles: [
    '.month{;padding: 10px 0;margin-bottom: 10px;}',
    '.month-header{margin-bottom: 15px;}',
    '.month-title{padding-top: 5px;text-transform: uppercase;letter-spacing: .02rem;}',
    '.task-board{padding: 10px;}',
    '.no-task{padding: 10px;border: 1px dashed #c4c4c4;}',
    '#table-tasks th, #table-tasks td {padding: 4px;}',
    '.label {padding: 3px 5px;font-weight: lighter;font-size: 65%;}',
    '.badge-website{background: linear-gradient(90deg, rgb(13 19 33) 0%, rgb(58 129 255) 100%);width: 200px;font-size: 10px;}'
  ]
})
export class GlobalComponent implements OnInit {

  public websites: any[] = [];
  public loading = false;
  public totalWebsites = 0;
  public loadedWebsites = 0;
  public creatingItems = false;
  public items: any[] = [];
  public oldItems: any[] = [];
  public old: any[] = [];
  public date = new Date();
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

  constructor(public _websitesService: WebsiteService,
              public _onsiteService: OnsiteService,
              public _offsiteService: OffsiteService,
              public _pageService: PageService) { }

  ngOnInit() {
    this.loading = true;
    this.loadWebsites();
  }

  loadWebsites() {
    this.websites = [];
    this._websitesService.loadWebsites().subscribe( (response: any) => {
      this.totalWebsites = response.count;
      if (this.totalWebsites > 0) {
        this.getTasksFromWebsites(response.websites).subscribe(() => {
          this.makeItems().subscribe(() => {
            this.loading = false;
            this.creatingItems = false;
            console.log(this.items);
          });
        });
      }
    });
  }

  getTasksFromWebsites(websites: any[]) {
    return new Observable( observer => {
      websites.forEach( (website: any, index: any) => {
        const onsiteObservable = this.loadOnsite(website.website._id);
        const offsiteObservable = this.loadOffsite(website.website._id);
        const pageObservable = this.loadPages(website.website._id);

        forkJoin(onsiteObservable, offsiteObservable, pageObservable).subscribe( (response: any) => {
          this.websites.push({
            domain: website.website.domain,
            onsite : response[0],
            offsite : response[1],
            pages : response[2]
          });
          this.loadedWebsites++;
          if (index + 1 === websites.length) {
            observer.next();
            observer.complete();
          }
        });
      });
    });
  }

  loadOnsite(id: string) {
    return new Observable( observer => {
      this._onsiteService.loadOnsite(id).subscribe( (response: any) => {
        observer.next(response.tasks);
        observer.complete();
      });
    });
  }

  loadOffsite(id: string) {
    return new Observable( observer => {
      this._offsiteService.loadOffsite(id).subscribe( (response: any) => {
        observer.next(response.tasks);
        observer.complete();
      });
    });
  }

  loadPages(id: string) {
    return new Observable( observer => {
      this._pageService.loadPages(id).subscribe( (response: any) => {
        observer.next(response.pages);
        observer.complete();
      });
    });
  }

  makeItems() {
    this.creatingItems = true;
    return new Observable( observer => {
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
        this.websites.forEach( website => {
          if (website.onsite.length > 0) {
            website.onsite.forEach( (onsite: any) => {
              if (new Date(onsite.year, onsite.month - 1) >= date) {
                if (!item.onsite.includes( onsite)) {
                  if (onsite.year === item.year && onsite.month === item.index) {
                    item.onsite.push( onsite );
                  }
                }
              } else {
                if (!this.oldItems.includes( onsite)) {
                  this.oldItems.push(onsite);
                }
              }
            });
          }
          if (website.offsite.length > 0) {
            website.offsite.forEach( (offsite: any) => {
              if (new Date(offsite.year, offsite.month - 1) >= date) {
                if (!item.offsite.includes( offsite)) {
                  if (offsite.year === item.year && offsite.month === item.index) {
                    item.offsite.push( offsite );
                  }
                }
              } else {
                if (!this.oldItems.includes( offsite)) {
                  this.oldItems.push(offsite);
                }
              }
            });
          }
          if (website.pages.length > 0) {
            website.pages.forEach( (pages: any) => {
              if (new Date(pages.year, pages.month - 1) >= date) {
                if (!item.pages.includes( pages)) {
                  if (pages.year === item.year && pages.month === item.index) {
                    item.pages.push( pages );
                  }
                }
              } else {
                if (!this.oldItems.includes( pages)) {
                  this.oldItems.push(pages);
                }
              }
            });
          }
        });
      });
      observer.next();
      observer.complete();
    });
  }
}
