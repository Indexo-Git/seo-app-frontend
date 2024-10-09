import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

declare var echarts: any;
declare var $: any;

// Models
import { Onsite } from '../../models/onsite.model';
import { Offsite } from '../../models/offsite.model';
import { Page } from '../../models/page.model';
import { SemanticTask } from '../../models/semanticTask.model';
import { TechnicalTask } from '../../models/technicalTask.model';
import { Keyword } from '../../models/keyword.model';
import { Position } from '../../models/position.model';
import { Website } from '../../models/website.model';
import { PageSemantic } from '../../models/pageSemantic.model';

// Services
import { OnsiteService, OffsiteService, PageService, SemanticTaskService, TechnicalTaskService, WebsiteService, PositionService, KeywordService } from 'src/app/services/service.index';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styles: [
    '.label {padding: 3px 7px;font-size: 9px;}',
    '.table th{font-size: 8px;padding: 1px;border-right:1px solid #dee2e6;}',
    '.table td{padding: 0;font-size: 11px;}',
    '.table th, .table td{text-align: center;}',
    '.bg-up{background: #c8c5ff ;}',
    '.bg-down{background: #ffdee4 ;}',
    '.bg-up:first-of-type,.bg-down:first-of-type{background: initial; color: initial}',
    '.bg-up:last-child,.bg-down:last-of-type{background: initial; color: initial}',
    'thead tr th:first-child,tbody tr td:first-child {width: 400px;min-width: 400px;max-width: 400px;word-break: break-all;font-size: 13px;font-weight: 600;}',
    'thead tr th,tbody tr td {width: 50px;min-width: 50px;max-width: 50px;word-break: break-all;}'

]})
export class TrackingComponent implements OnInit {

  public website: string;
  public currentWebsite: Website;
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

  public onsiteTasks: Onsite[] = [];
  public onsiteLoaded: boolean;

  public offsiteTasks: Offsite[] = [];
  public offsiteLoaded: boolean;

  public pages: Page[] = [];
  public pagesLoaded: boolean;
  public keywords: Keyword[] = [];

  public positions: Position[] = [];
  public positionsLoaded: boolean;

  public items: any[] = [];
  public oldItems: any[] = [];
  public old: any[] = [];

  public semanticTasks: SemanticTask[] = [];
  public totalSemanticTasks: number;
  public totalSemanticTasksDone: number;
  public percentSemantic: number;
  public semanticLoaded: boolean;

  public technicalTasks: TechnicalTask[] = [];
  public totalTechnicalTasks: number;
  public totalTechnicalTasksDone: number;
  public percentTechnical: number;
  public technicalLoaded: boolean;

  public totalPages: number;
  public totalPagesDone: number;
  public percentPages: number;

  public date: Date;
  public dateBarOne: Date;
  public dateBarTwo: Date;
  public dateLineOne: Date;
  public dateLineTwo: Date;

  public datesForm: FormGroup;

  public tableDates: any;
  public tablePositions: any;

  public charts: any[];

  public monthly = false;
  public weekly = false;
  public daily = true;

  public selectedYear: any;

  constructor(public activatedRoute: ActivatedRoute,
              public _onsiteService: OnsiteService,
              public _offsiteService: OffsiteService,
              public _pageService: PageService,
              public _websiteService: WebsiteService,
              public _semanticService: SemanticTaskService,
              public _technicalService: TechnicalTaskService,
              public _keywordService: KeywordService,
              public _positionService: PositionService) {
    this.date = new Date();
    this.dateBarOne = new Date();
    this.dateBarOne.setMonth(this.dateBarOne.getMonth() - 3);
    this.dateBarTwo = new Date();
    this.dateLineOne = new Date();
    this.dateLineOne.setMonth(this.dateLineOne.getMonth() - 3);
    this.dateLineTwo = new Date();
    this.activatedRoute.params.subscribe( params => {
      this.website = params['id'];
      this._websiteService.getWebsite(params['id']).subscribe( ( websiteResponse: any) => {
        this.currentWebsite = websiteResponse.website[0];
      });
    });

    this.datesForm = new FormGroup({
      'dateOne' : new FormControl(),
      'dateTwo' : new FormControl(),
    });
  }

  ngOnInit() {
    this.loadSemantic();
    this.loadTechnical();
    this.loadOnsite();
    this.loadOffsite();
    this.loadPages();
    this.loadPositions();
    this.verifyIfDataLoaded().then( () => {
      this.makeItems();
      this.createBar();
    });
  }

  loadSemantic() {
    this.semanticLoaded = false;
    this.totalSemanticTasksDone = 0;
    this.totalSemanticTasks = 0;
    this.percentSemantic = 0;
    this._semanticService.loadTasks( this.website ).subscribe( (responseSemantic: any) => {
      this.semanticTasks = responseSemantic.tasks;
      this._pageService.loadPages( this.website ).subscribe( (responsePages: any) => {
        responsePages.pages.forEach((page: Page) => {
          this._pageService.getTasks(page._id).subscribe( (responseTasks: any) => {
            if (responseTasks.count > 0) {
              responseTasks.tasks.forEach( (task: PageSemantic) => {
                if (task.status) {
                  this.totalSemanticTasksDone++;
                }
              });
              if (responseSemantic.count !== 0) {
                this.totalSemanticTasks = responseSemantic.count * responsePages.count;
                this.percentSemantic = Math.round((this.totalSemanticTasksDone * 100) / this.totalSemanticTasks);
              }
            }
          });
        });
      });
    });
  }

  loadTechnical() {
    this.technicalLoaded = false;
    this.totalTechnicalTasksDone = 0;
    this.totalTechnicalTasks = 0;
    this.percentTechnical = 0;
    this._technicalService.loadTasks( this.website ).subscribe( (response: any) => {
      this.technicalTasks = response.tasks;
      this.technicalLoaded = true;
      this.technicalTasks.forEach((task: any) => {
        if (task.status) {
          this.totalTechnicalTasksDone++;
        }
      });
      if (response.count !== 0) {
        this.totalTechnicalTasks = response.count;
        this.percentTechnical = Math.round((this.totalTechnicalTasksDone * 100) / this.totalTechnicalTasks);
      }
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
    this.totalPages = 0;
    this.totalPagesDone = 0;
    this.percentPages = 0;
    this.pagesLoaded = false;
    this._pageService.loadPages(this.website).subscribe( (response: any) => {
      this.pages = response.pages;
      this.totalPages = this.pages.length;
      this.pages.forEach( (page: Page) => {
        if (page.online) {
          this.totalPagesDone++;
        }
      });
      this.percentPages = Math.round((this.totalPagesDone * 100) / this.totalPages);
      this.pagesLoaded = true;
    });
  }

  loadPositions() {
    this._keywordService.loadKeywords( this.website ).subscribe( (keywords: any) => {
      this.keywords = keywords.keywords;
      const totalKeywords = this.keywords.length;
      let totalPositions = 0;
      this.keywords.forEach( (keyword: Keyword) => {
        this.positionsLoaded = false;
        this._positionService.loadPositions( keyword._id ).subscribe( (positions: any) => {
          totalPositions++;
          positions.positions.forEach((position: Position) => {
            this.positions.push(position);
          });
          if (totalKeywords === totalPositions) {
            this.positionsLoaded = true;
            this.createLine();
          }
        });
      });
    });
  }

  verifyIfDataLoaded() {
    return new Promise( (resolve, reject) => {
      const interval = setInterval( () => {
        if ( this.onsiteLoaded && this.offsiteLoaded && this.pagesLoaded && this.technicalLoaded ) {
          resolve(true);
          clearInterval(interval);
        }
      }, 10);
    });
  }

  verifyIfPositionsLoaded() {
    return new Promise( (resolve, reject) => {
      const interval = setInterval( () => {
        if ( this.positionsLoaded ) {
          resolve(true);
          clearInterval(interval);
        }
      }, 10);
    });
  }

  makeItems( year = null) {
    this.items = [];
    this.oldItems = [];
    let tempDate = new Date();
    tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);
    tempDate.setMonth(0);

    const date = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);
    let month = date.getMonth();
    if (year === null) {
      year = date.getFullYear();
    } else {
      date.setFullYear(year);
    }

    this.selectedYear = year;

    for (let i = 0; i < 12; i++) {
      this.items.push({
        index: this.months[month].index,
        month: this.months[month].month,
        year: year,
        onsite: [],
        offsite : [],
        pages: [],
        content: [],
        onPage: [],
        technical: [],
        done: false,
        date: new Date(this.selectedYear, this.months[month].index - 1),
        total: 0,
        totalDone: 0,
        percent: 0,
        onsiteDone: 0,
        offsiteDone: 0,
        sitemapDone: 0,
        contentDone: 0,
        onPageDone: 0,
        technicalDone: 0
      });
      month++;
      if (month === 12) {
        month = 0;
        year++;
      }
    }

    this.items.forEach( (item) => {
      let flag = true;
      this.onsiteTasks.forEach( (onsite) => {
        if (new Date(onsite.year, onsite.month - 1) >= date) {
          if ( !item.onsite.includes( onsite)) {
            if (onsite.year === item.year && onsite.month === item.index) {
              item.total++;
              item.onsite.push( onsite );
              if (!onsite.status) {
                flag = false;
              } else {
                item.onsiteDone++;
                item.totalDone++;
              }
              item.percent = Math.round((item.totalDone * 100) / item.total);
            }
          }
        } else {
          if ( !this.oldItems.includes( onsite)) {
            this.oldItems.push(onsite);
          }
        }
      });

      this.offsiteTasks.forEach( (offsite) => {
        if (new Date(offsite.year, offsite.month - 1) >= date) {
          if ( !item.offsite.includes( offsite)) {
            if ( offsite.month === item.index && offsite.year === item.year) {
              item.total++;
              item.offsite.push( offsite );
              if (!offsite.status) {
                flag = false;
              } else {
                item.offsiteDone++;
                item.totalDone++;
              }
              item.percent = Math.round((item.totalDone * 100) / item.total);
            }
          }
        } else {
          if ( !this.oldItems.includes( offsite)) {
            this.oldItems.push(offsite);
          }
        }
      });

      this.pages.forEach( (page) => {
        if (new Date(page.year, page.month - 1) >= date) {
          if ( !item.content.includes( page)) {
            if ( page.month === item.index && page.year === item.year) {
              item.total++;
              item.total++;

              if (page.online) {
                item.contentDone++;
                item.totalDone++;
              } else {
                flag = false;
              }

              if (page.optimized) {
                item.onPageDone++;
                item.totalDone++;
              } else {
                flag = false;
              }

              item.content.push( page );
              item.onPage.push( page );
              /*if (!page.status) {
                flag = false;
              } else {
                item.sitemapDone++;
                item.totalDone++;
              }*/
              item.percent = Math.round((item.totalDone * 100) / item.total);
            }
          }
        } else {
          if ( !this.oldItems.includes( page)) {
            this.oldItems.push(page);
          }
        }
      });

      this.technicalTasks.forEach( (task) => {
        if (task.status) {
          const taskDate = new Date(task.date);
          if (taskDate >= date) {
            if (!item.technical.includes(task)) {
              if (taskDate.getMonth() + 1 === item.index && taskDate.getFullYear() === item.year) {
                item.total++;
                item.technical.push( task );
                item.technicalDone++;
                item.totalDone++;
                item.percent = Math.round((item.totalDone * 100) / item.total);
              }
            }
          }  else {
            if ( !this.oldItems.includes( task)) {
              this.oldItems.push(task);
            }
          }
        }
      });
      item.done = flag;
    });
  }

  datesChange(type = null) {
    if ( type === 'w') {
      this.monthly = false;
      this.weekly = true;
      this.daily = false;
    }
    if ( type === 'm') {
      this.monthly = true;
      this.weekly = false;
      this.daily = false;
    }
    if (  type === 'd') {
      this.monthly = false;
      this.weekly = false;
      this.daily = true;
    }
    this.createLine($('#date-one').val(), $('#date-two').val());
    this.createBar($('#date-one').val(), $('#date-two').val());
  }

  createLine( one: any = null, two: any = null) {
    const dates: any[] = [];
    const keywords: any[] = [];
    let dateOne: any;
    let dateTwo: any;
    const series: any = [];
    let actual: any;
    // let selected: any;
    if ( !one && !two) {
      dateOne = this.dateLineOne;
      dateTwo = this.dateLineTwo;
    } else {
      dateOne = new Date(one);
      dateOne.setDate(dateOne.getDate() + 1);
      dateTwo = new Date(two);
      dateTwo.setDate(dateTwo.getDate());
    }
    dateOne.setHours(0, 0, 0, 0);
    dateTwo.setHours(23, 59, 59, 0);
    do {
      if (this.weekly) {
        if (dateOne.getDay() === 0) {
          dates.push(dateOne.toLocaleDateString());
        }
      }
      if ( this.monthly) {
        if (dates.length === 0) {
          dates.push(dateOne.toLocaleDateString());
        } else {
          const day = dates[dates.length - 1].substring(0,  dates[dates.length - 1].indexOf('/'));
          const month = dates[dates.length - 1].split('/')[1];
          if ( day < dateOne.getDate() ) {
            dates[ dates.length - 1] = dateOne.toLocaleDateString();
          } else {
            if ( month < (dateOne.getMonth() + 1) ) {
              dates.push(dateOne.toLocaleDateString());
            }
          }
        }
      }
      if ( this.daily) {
        dates.push(dateOne.toLocaleDateString());
      }
      dateOne.setDate(dateOne.getDate() + 1);
    } while (dateOne.getTime() <= dateTwo.getTime());

    this.positions.forEach( (position: any) => {
      const positionDate = new Date(position.date);
      positionDate.setHours(24, 0, 0, 0);

      const positionInDates = dates.indexOf(positionDate.toLocaleDateString());

      if (positionInDates > -1) {
        if (!keywords.includes(position.keyword.name + ' (' + position.keyword.demand + ')')) {
          keywords.push(position.keyword.name + ' (' + position.keyword.demand + ')');
        }
        actual = series.find( (value: any) => value.name === position.keyword.name + ' (' + position.keyword.demand + ')');
        if (!actual) {
          series.push({
            name: position.keyword.name + ' (' + position.keyword.demand + ')',
            type: 'line',
            data: [],
            smooth: true,
            // connectNulls : true,
            lineStyle: {
              width: 3
            }
          });
          const newSeries = series.find( (value: any) => value.name === position.keyword.name + ' (' + position.keyword.demand + ')');
          dates.forEach(() => {
            newSeries.data.push(null);
          });
          if (position.position === 0) {
            newSeries.data[positionInDates] = null;
          } else {
            newSeries.data[positionInDates] = position.position;
          }
        } else {
          if (position.position === 0) {
            actual.data[positionInDates] = null;
          } else {
            actual.data[positionInDates] = position.position;
          }
        }
      }
    });
    this.tableDates = dates;
    this.tablePositions = series;
    /*selected = '{';

    keywords.forEach((keyword) => {
      if (keyword === keywords[0]) {
        selected += ' \"' + keyword + '\": true';
      } else {
        selected += ' \"' + keyword + '\": false';
      }
      if (keyword !== keywords[keywords.length - 1]) {
        selected += ',';
      }
    });

    selected += '}';*/

    /*this.charts = [
      {
        data: {
          'labels': dates,
          'series': series
        },
        type: 'Line',
        options: {
          height: '300px'
        }
      }
    ];*/

    const lineChart = echarts.init(document.getElementById('basic-line'));
    const optionLine = {
      grid: {
        left: '1%',
        right: '20%',
        bottom: '3%',
        containLabel: true
      },

      // Add Tooltip
      tooltip : {
        trigger: 'axis'
      },
      // Add legend
      legend: {
        type: 'scroll',
        width: '50%',
        right: '0',
        bottom: '50',
        top: '100',
        data: keywords,
        orient: 'vertical',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 14
        },
        selector: [
          {
              type: 'all or inverse',
              // can be any title you like
              title: 'All'
          },
          {
              type: 'inverse',
              title: 'None'
          }
      ]
        // selected : JSON.parse(selected),
      },

      // Enable drag recalculate
      calculable: true,
      // Horizontal axis
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: dates,
        position: 'top',
        axisLine: {
          lineStyle: {
            color: '#c0c0c0',
            type: 'dotted'
          }
        }
      }],
      // Vertical axis
      yAxis: [{
        type: 'value',
        inverse: true,
        axisLine: {
          lineStyle: {
            color: '#c0c0c0',
            type: 'dotted'
          }
        }
      }],
      // Add series
      series: series,
      color: ['#f62e52', '#ed721a', '#fee00f', '#7069fa', '#5c33bb', '#0d1321']
    };
    lineChart.setOption(optionLine);
  }

  createBar( one: any = null, two: any = null) {
    const dates: any[] = [];
    const datesWeekly: Date[] = [];
    let dateOne: any;
    let dateTwo: any;
    const onsiteValues: any[] = [];
    const offsiteValues: any[] = [];
    const contentValues: any[] = [];
    const onPageValues: any[] = [];
    const technicalValues: any[] = [];

    if ( !one && !two) {
      dateOne = this.dateBarOne;
      dateTwo = this.dateBarTwo;
    } else {
      dateOne = new Date(one);
      dateOne.setDate(dateOne.getDate() + 1);
      dateTwo = new Date(two);
      dateTwo.setDate(dateTwo.getDate());
    }
    dateOne.setHours(0, 0, 0, 0);
    dateTwo.setHours(23, 59, 59, 0);
    do {
      if ( this.weekly) {
        if (dateOne.getDay() === 0) {
          datesWeekly.push(new Date(dateOne));
          dates.push(dateOne.toLocaleDateString());
        }
      }
      if ( this.monthly) {
        const firstMonth = new Date(dateOne.getFullYear(), dateOne.getMonth(), 1);
        const lastMonth = new Date(dateOne.getFullYear(), dateOne.getMonth() + 1, 0);
        if ( dateOne >= firstMonth && dateOne <= lastMonth) {
          if (!dates.includes(dateOne.getFullYear() + '/' + (dateOne.getMonth() + 1))) {
            dates.push(dateOne.getFullYear() + '/' + (dateOne.getMonth() + 1));
          }
        }
      }
      if ( this.daily) {
        dates.push(dateOne.toLocaleDateString());
      }
      dateOne.setDate(dateOne.getDate() + 1);
    } while (dateOne.getTime() <= dateTwo.getTime());

    dates.forEach(() => {
      contentValues.push(0);
      onPageValues.push(0);
      technicalValues.push(0);
      offsiteValues.push(0);
      onsiteValues.push(0);
    });

    if (this.weekly) {
      datesWeekly.push(new Date());
      datesWeekly.forEach( (date: any, index: number) => {
        this.onsiteTasks.forEach( (onsite) => {
          if (onsite.status && onsite.month) {
            if (new Date(onsite.date) >= datesWeekly[index] && new Date(onsite.date) < datesWeekly[index + 1]) {
              onsiteValues[index]++;
            }
          }
        });

        this.offsiteTasks.forEach( (offsite) => {
          if (offsite.status && offsite.month) {
            if (new Date(offsite.date) >= datesWeekly[index] && new Date(offsite.date) < datesWeekly[index + 1]) {
              offsiteValues[index]++;
            }
          }
        });

        this.pages.forEach( (page) => {
          if (page.online) {
            if (new Date(page.dateOnline) >= datesWeekly[index] && new Date(page.dateOnline) < datesWeekly[index + 1]) {
              contentValues[index]++;
            }
          }
          if (page.optimized) {
            if (new Date(page.dateOptimized) >= datesWeekly[index] && new Date(page.dateOptimized) < datesWeekly[index + 1]) {
              onPageValues[index]++;
            }
          }
        });

        this.technicalTasks.forEach( (task) => {
          if (task.status) {
            const taskDate = new Date(task.date);
            if (taskDate >= datesWeekly[index] && taskDate < datesWeekly[index + 1]) {
              technicalValues[index]++;
            }
          }
        });
      });
    } else {
      this.onsiteTasks.forEach( (onsite) => {
        if (onsite.status) {
          const onsiteDate = new Date(onsite.date);
          if ( this.monthly) {
            if (dates.indexOf(onsiteDate.getFullYear() + '/' + (onsiteDate.getMonth() + 1))  > -1) {
              onsiteValues[dates.indexOf(onsiteDate.getFullYear() + '/' + (onsiteDate.getMonth() + 1))]++;
            }
          } else {
            if (dates.indexOf(onsiteDate.toLocaleDateString()) > -1) {
              onsiteValues[dates.indexOf(onsiteDate.toLocaleDateString())]++;
            }
          }
        }
      });

      this.offsiteTasks.forEach( (offsite) => {
        if (offsite.status) {
          const offsiteDate = new Date(offsite.date);
          if (this.monthly) {
            if (dates.indexOf(offsiteDate.getFullYear() + '/' + (offsiteDate.getMonth() + 1))  > -1) {
              offsiteValues[dates.indexOf(offsiteDate.getFullYear() + '/' + (offsiteDate.getMonth() + 1))]++;
            }
          } else {
            if (dates.indexOf(offsiteDate.toLocaleDateString()) > -1) {
              offsiteValues[dates.indexOf(offsiteDate.toLocaleDateString())]++;
            }
          }
        }
      });

      this.pages.forEach( (page) => {
        if (page.online) {
          const contentDate = new Date(page.dateOnline);
          if ( this.monthly) {
            if (dates.indexOf(contentDate.getFullYear() + '/' + (contentDate.getMonth() + 1))  > -1) {
              contentValues[dates.indexOf(contentDate.getFullYear() + '/' + (contentDate.getMonth() + 1))]++;
            }
          } else {
            if (dates.indexOf(contentDate.toLocaleDateString()) > -1) {
              contentValues[dates.indexOf(contentDate.toLocaleDateString())]++;
            }
          }
        }
        if (page.optimized) {
          const onPageDate = new Date(page.dateOptimized);
          if ( this.monthly) {
            if (dates.indexOf(onPageDate.getFullYear() + '/' + (onPageDate.getMonth() + 1))  > -1) {
              onPageValues[dates.indexOf(onPageDate.getFullYear() + '/' + (onPageDate.getMonth() + 1))]++;
            }
          } else {
            if (dates.indexOf(onPageDate.toLocaleDateString()) > -1) {
              onPageValues[dates.indexOf(onPageDate.toLocaleDateString())]++;
            }
          }
        }
      });

      this.technicalTasks.forEach( (technical) => {
        if (technical.status) {
          const technicalDate = new Date(technical.date);
          if (this.monthly) {
            if (dates.indexOf(technicalDate.getFullYear() + '/' + (technicalDate.getMonth() + 1)) > - 1) {
              technicalValues[dates.indexOf(technicalDate.getFullYear() + '/' + (technicalDate.getMonth() + 1))]++;
            }
          } else {
            if (dates.indexOf(technicalDate.toLocaleDateString()) > -1) {
              technicalValues[dates.indexOf(technicalDate.toLocaleDateString())]++;
            }
          }
        }
      });
    }

    const barChart = echarts.init(document.getElementById('stacked-column'));
    const optionBar = {
      // Setup grid
      grid: {
        left: '1%',
        right: '20%',
        bottom: '3%',
        containLabel: true
      },
      // Add tooltip
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // Axis indicator axis trigger effective
          type : 'shadow'        // The default is a straight line, optionally: 'line' | 'shadow'
        }
      },
      // Add legend
      legend: {
        data: ['Content', 'On-Page', 'Technical', 'Backlink', 'Other'],
        right: '0%',
        bottom: '50%',
        orient: 'vertical',
      },
      // Add custom colors
      color: ['#f62e52', '#ed721a',  '#fee00f', '#7069fa', '#5c33bb'],
      // Enable drag recalculate
      calculable: true,
      // Horizontal axis
      xAxis: [{
        boundaryGap: false,
        type: 'category',
        data: dates,
        axisLine: {
          lineStyle: {
              color: '#c0c0c0',
              type: 'dotted'
          }
        }
      }],
      // Vertical axis
      yAxis: [{
        type: 'value',
        axisLine: {
          lineStyle: {
              color: '#c0c0c0',
              type: 'dotted'
          }
        }
      }],
      // Add series
      series : [
        {
          name: 'Content',
          type: 'bar',
          barWidth : 12,
          stack: 'total',
          data: contentValues
        },
        {
          name: 'On-Page',
          type: 'bar',
          barWidth: 12,
          stack: 'total',
          data: onPageValues
        },
        {
          name: 'Technical',
          type: 'bar',
          barWidth: 12,
          stack: 'total',
          data: technicalValues
        },
        {
          name: 'Backlink',
          type: 'bar',
          barWidth : 12,
          stack: 'total',
          data: offsiteValues
        },
        {
          name: 'Other',
          type: 'bar',
          barWidth : 12,
          stack: 'total',
          data: onsiteValues
        }
      ]
    };
    barChart.setOption(optionBar);
  }

}
