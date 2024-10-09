import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { BackLinkService, WebsiteService, OffsiteService } from 'src/app/services/service.index';

// Models
import { Website } from '../../models/website.model';
import { Offsite } from 'src/app/models/offsite.model';

declare var $: any;

@Component({
  selector: 'app-netlinking',
  templateUrl: './netlinking.component.html',
  styles: [
    'table.interlinking td, table.interlinking th{padding: 5px; vertical-align: middle;}'
  ]
})
export class NetlinkingComponent implements OnInit {

  public website: Website;
  public senders: any[] = [];
  public receivers: any[] = [];

  public loadingSenders: boolean;
  public loadingReceivers: boolean;

  public totalPrice: number;

  constructor(public activatedRoute: ActivatedRoute,
              public _websiteService: WebsiteService,
              public _backLinkService: BackLinkService,
              public _offsiteService: OffsiteService) {
    this.activatedRoute.params.subscribe( params => {
      this._websiteService.getWebsite(params['id']).subscribe( ( websiteResponse: any) => {
        this.website = websiteResponse.website[0];
        this.loadSenders();
        this.loadReceivers();
      });
    });
  }

  ngOnInit() {
  }

  loadSenders() {
    this.loadingSenders = true;
    this.senders = [];
    this._offsiteService.loadOffsite(this.website._id).subscribe( (responseOffsite: any) => {
      if (responseOffsite.count > 0) {
        this.totalPrice = 0;
        responseOffsite.tasks.forEach( (task: Offsite) => {
          this._backLinkService.getByTask(task._id).subscribe( (responseBackLink: any) => {
            if (responseBackLink.backLinks.length > 0) {
              responseBackLink.backLinks.forEach( (backLink: any) => {
                if (backLink.task.status) {
                  this.totalPrice =  this.totalPrice + backLink.task.price;
                  this.senders.push({
                    task : backLink.task,
                    sender: backLink.sender
                  });
                }
              });
            } else {
              if (task.status) {
                this.totalPrice = this.totalPrice + task.price;
                this.senders.push({
                  task : task,
                  sender: null
                });
              }
            }
          });
        });
        this.loadingSenders = false;
        if ( !$.fn.dataTable.isDataTable( '#senders-table' ) ) {
          setTimeout(() => {
            $('#senders-table').DataTable({pageLength: 100, lengthMenu: [ [25, 50, 100, -1], [25, 50, 100, 'All'] ]});
          }, 500);
        }
      }
    });
  }

  loadReceivers() {
    this.loadingReceivers = true;
    this.receivers = [];
    this._backLinkService.getReceiversFromWebsite(this.website._id).subscribe( (response: any) => {
      if (response.backLinks.length > 0) {
        response.backLinks.forEach( (backLink: any) => {
          if (backLink.task.status) {
            this.receivers.push({
              id: backLink._id,
              task: backLink.task,
              receiver: backLink.receiver
            });
          }
        });
      }
      this.loadingReceivers = false;
      if ( !$.fn.dataTable.isDataTable( '#receivers-table' ) ) {
        setTimeout(() => {
          $('#receivers-table').DataTable({pageLength: 100, lengthMenu: [ [25, 50, 100, -1], [25, 50, 100, 'All'] ]});
        }, 500);
      }
    });
  }

}
