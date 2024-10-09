import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';

// Models
import { Website } from '../../models/website.model';
import { Onsite } from '../../models/onsite.model';

// Services
import { WebsiteService, OnsiteService } from 'src/app/services/service.index';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styles: []
})
export class OtherComponent implements OnInit {

  public website: Website;

  public onsiteTasks: Onsite[] = [];
  public onsiteLoaded: boolean;

  constructor(public activatedRoute: ActivatedRoute,
              public _websiteService: WebsiteService,
              public _onsiteService: OnsiteService) {
    this.activatedRoute.params.subscribe( params => {
      this._websiteService.getWebsite(params['id']).subscribe( ( websiteResponse: any) => {
        this.website = websiteResponse.website[0];
        this.loadOnsite();
      });
    });
  }

  ngOnInit() {
  }


  loadOnsite() {
    this.onsiteLoaded = false;
    this._onsiteService.loadOnsite(this.website._id).subscribe( (response: any) => {
      this.onsiteTasks = response.tasks;
      this.onsiteLoaded = true;
    });
  }

  dropTask( event: CdkDragDrop<string[]> ) {
    if ( event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.onsiteTasks, event.previousIndex, event.currentIndex);
      this._onsiteService.updateOrder(this.onsiteTasks);
    }
  }
}
