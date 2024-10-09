import { Component, OnInit } from '@angular/core';

// Models
import { Website } from '../models/website.model';
import { Keyword } from '../models/keyword.model';
import { Position } from '../models/position.model';

// Service
import { MonitorankService, WebsiteService, KeywordService, PositionService } from '../services/service.index';

@Component({
  selector: 'app-monitorank',
  templateUrl: './monitorank.component.html',
  styles: []
})
export class MonitorankComponent implements OnInit {

  constructor( public _websiteService: WebsiteService,
               public _monitorankService: MonitorankService,
               public _keywordService: KeywordService,
               public _positionService: PositionService) {
    this.getPositions();
  }

  ngOnInit() {
  }

  getPositions() {
    this._websiteService.getAll().subscribe( (allWebsites: any) => {
      const websites: Website[] = allWebsites.websites;
      websites.forEach( website => {
        this._keywordService.loadKeywords(website._id).subscribe( (keywords: any) => {
          if (keywords.count > 0) {
            this._monitorankService.getPositionsByDomain(website.domain).subscribe( (positions: any) => {
              if (positions.result) {
                keywords.keywords.forEach( (keyword: Keyword) => {
                  const keywordInData = positions.data.filter( (data: any) => (data.keywords === keyword.name));
                  if (keywordInData.length > 0) {
                    if (keywordInData.length < 2) {
                      if (keyword.primary) {
                        this.createPositionsObject(website._id, keyword, keywordInData[0].rank);
                      }
                      for (const [date, position] of Object.entries(keywordInData[0].rank)) {
                        this.loadAndCreatePosition(keyword._id, new Date(date), position);
                      }
                    } else {
                      for (let i = 0; i < keywordInData.length; i++) {
                        if (keywordInData[i].query.localisation !== 'all') {
                          if (keyword.primary) {
                            this.createPositionsObject(website._id, keyword, keywordInData[i].rank);
                          }
                          for (const [date, position] of Object.entries(keywordInData[i].rank)) {
                            this.loadAndCreatePosition(keyword._id, new Date(date), position);
                          }
                          break;
                        }
                        if (keywordInData[i].query.device === 'mobile') {
                          if (keyword.primary) {
                            this.createPositionsObject(website._id, keyword, keywordInData[i].rank);
                          }
                          for (const [date, position] of Object.entries(keywordInData[i].rank)) {
                            this.loadAndCreatePosition(keyword._id, new Date(date), position);
                          }
                          break;
                        }
                        if (keywordInData[i].type_rank !== 'type_bloc_image') {
                          if (keyword.primary) {
                            this.createPositionsObject(website._id, keyword, keywordInData[i].rank);
                          }
                          for (const [date, position] of Object.entries(keywordInData[i].rank)) {
                            this.loadAndCreatePosition(keyword._id, new Date(date), position);
                          }
                          break;
                        }
                      }
                    }
                  }
                });
              }
            });
          }
        });
      });
    });
  }

  loadAndCreatePosition(keyword: string, date: Date, position: any) {
    // Check if keyword exists if not create
    this._positionService.loadByIdAndDate(keyword, new Date(date)).subscribe( (oldPositions: any) => {
      if (oldPositions.positions.length === 0) {
        this._positionService.create(this.setPosition(keyword, Number(position) , date )).subscribe( (newPosition: any) => {
          console.log(newPosition);
        });
      }
    });
  }

  createPositionsObject(id: string, keyword: Keyword, rank: any) {
    const labels: any[] = [];
    const data: any[] = [];
    let counter = 0;
    for (const [date, position] of Object.entries(rank).reverse()) {
      const pos: any = position;
      if (counter < 5) {
        labels.push(new Date(date).toLocaleDateString());
        // tslint:disable-next-line:radix
        data.push(parseInt(pos));
      }
      counter ++;
    }
    const primary = {
      keyword: keyword.name,
      position: data[0],
      demand: keyword.demand,
      url: keyword.name.trim().split(' ').join('+'),
      chart : { labels : labels.reverse(), data: data.reverse() }
    };

    this._websiteService.updatePrimary(id, primary).subscribe((response: any) => {
      console.log('primary saved', response);
    });
  }


  setPosition( keyword: string, position: number, date: Date) {
    return new Position(keyword, position, date);
  }

}
