import { Component, OnInit } from '@angular/core';

// Services
import { WebsiteService, UserService } from 'src/app/services/service.index';

declare var Chart: any;
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    '#website-button{color: #fff;position: fixed;bottom: 5%;right: 5%;z-index: 1;}',
    '.table th, .table td{ padding: 0 11px;}',
    '.badge-warning{color:#fff!important}',
    '.badge.badge-pill{font-size: 10px;font-weight: 600;padding: 3px 6px;}',
    '.form-dashboard {font-size: 0.6rem;padding: 0.375rem 0rem; border: 0px;text-align: left;display: inherit;}',
    '.td-progress{min-width: 60px;}',
    '.chart-keywords{width:100px}',
    '.star-checkbox .custom-control-input:checked~.custom-control-label::before{background-color: #febc34}',
    '.star-checkbox .custom-control-input:checked~.custom-control-label::after{font-family: "Font Awesome 5 Free";content: "\\f005";line-height: 15px;color: #fff;font-size: 12px;text-align: center;background-image: none;}',
    '.sold-checkbox .custom-control-input:checked~.custom-control-label::before{background-color: #3880ff}',
    '.sold-checkbox .custom-control-input:checked~.custom-control-label::after{font-family: "Font Awesome 5 Free";content: "\\f155";line-height: 15px;color: #fff;font-size: 12px;text-align: center;background-image: none;}',
    '.custom-control{padding: initial;}',
    '#demand-th{padding: 0 11px 5px;}',
    '.css-bar-other {background-image: linear-gradient(90deg, rgb(114, 78, 208) 0%, rgb(151, 115, 234) 100%);}',
    '.css-bar-other.css-bar-0{background-image: linear-gradient(90deg, #fafafa 50%, transparent 50%, transparent), linear-gradient(90deg, #724ed0 50%, #fafafa 50%, #fafafa);}'
  ]
})
export class DashboardComponent implements OnInit {

  public websites: any[] = [];
  public backUpWebsites: any[] = [];
  public networks: any[] = [];
  public totalWebsites: number;
  public totalNetworks: number;
  public loading: boolean;
  public loadingMonitorank: boolean;
  public oneDay = true;
  public sevenDays = false;
  public fifteenDays = false;
  public thirtyDays = false;
  public sixtyDays = false;
  public totalContent = 0;
  public totalContentDone = 0;
  public totalContentPending = 0;
  public totalOtherPending = 0;
  public totalBacklinks = 0;
  public totalBacklinksDone = 0;
  public totalBacklinksPending = 0;

  public selectedWebsite: string;

  public sortedByFavorite = false;
  public sortedBySold = false;
  public sortedByPosition = false;
  public reverseByPosition = false;
  public sortedByDomain = false;
  public reverseByDomain = false;
  public sortedByKeyword = false;
  public reverseByKeyword = false;
  public sortedByDemand = false;
  public reverseByDemand = false;
  public sortedByCity = false;
  public reverseByCity = false;
  public sortedByTechnology = false;
  public reverseByTechnology = false;
  public sortedByType = false;
  public reverseByType = false;
  public sortedByCategory = false;
  public reverseByCategory = false;

  public month: any;

  constructor(public _websitesService: WebsiteService,
              public _userService: UserService) {}

  ngOnInit() {
    this.loadWebsites();
  }

  // Loaders
  /*------------------------------------------------*/

  loadWebsites() {
    this.loading = true;
    this._websitesService.loadWebsites().subscribe( (response: any) => {
      this.totalWebsites = response.count;
      if (this.totalWebsites > 0) {
        this.getInfoFromWebsites(response.websites);
      } else {
        this.loading = false;
      }
    });
  }

  getInfoFromWebsites( websites: any[]) {
    this.websites = [];
    websites.forEach( (website: any) => {
      this.websites.push({
        data: website.website,
        keyword: website.website.primary,
        onsite : website.website.onsite,
        progress: website.website.progress,
        semantic: website.website.semantic,
        technical: website.website.technical,
        city: website.website.city,
        backLinks: website.website.offsite
      });
    });
    this.websites.sort(function(a, b) {
      const keyA = a.data.priority, keyB = b.data.priority;
      if (keyA < keyB) {
        return -1;
      }
      if (keyA > keyB) {
        return 1;
      }
      return 0;
    });
    this.websites.reverse();
    this.loading = false;
    Object.assign(this.backUpWebsites, this.websites);
    this.websites = this.websites.filter( website => website.data.priority !== 0);
    this.totalWebsites = this.websites.length;
    this.countTotalPending();
    this.restartCharts('chartThree', 15);
    this.sortByPositions();
  }

  restartCharts(chart: any, days: Number) {
    setTimeout(() => {
      this.websites.forEach( (website: any) => {
        if (website.keyword[chart] !== undefined) {
          if (website.keyword[chart].data.length > 0) {
            this.createKeywordsChart(website.data._id, website.keyword[chart], days);
          }
        }
      });
      $('[data-toggle=popover]').popover();
      $('[data-toggle=tooltip]').tooltip();
    }, 1000);
  }

  createKeywordsChart(id: string, chart: any, type: Number) {
    const ctx = document.getElementById('chart-' + type + '-' + id);
    const positionsChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: chart.labels,
          datasets: [{
              data: chart.data,
              backgroundColor: '#e6efff',
              borderColor: '#3880ff',
              borderWidth: 1,
              pointBackgroundColor: '#3880ff',
              fill: 'start'
          }]
      },
      options: {
        layout: {
          padding: {
              left: 0,
              right: 10,
              top: 10,
              bottom: 0
          }
        },
        animation: {
          duration: 0
        },
          elements: { point: {
              radius:  2
            }
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display: false,
                      drawBorder: false
                  },
                  ticks: {
                      display: false
                  }
              }],
              yAxes: [{
                  gridLines: {
                      display: false,
                      drawBorder: false,
                  },
                  ticks: {
                      display: false,
                      reverse: true
                  }
              }]
          },
          legend: {
              display: false,
              labels: {
                  fontColor: 'rgb(255, 99, 132)'
              }
          },
          tooltips : {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            titleFontSize: 9,
            titleFontStyle: 'normal',
            titleMarginBottom: 2,
            bodyFontSize: 9,
            bodyFontStyle: 'normal',
            displayColors: false,
            xPadding: 2,
            yPadding: 2
          }
      }
    });
  }

  pingMonitorank() {
    this.loadingMonitorank = true;
    setTimeout(() => {
      this.loadingMonitorank = false;
    }, 2000);
  }

  // Filters
  /*------------------------------------------------*/

  countTotalPending() {
    this.totalContentPending = this.websites.map( website => website.progress.pendingContent).reduce( function (a, b) {
      return a + b;
    }, 0);
    this.totalBacklinksPending = this.websites.map( website => website.progress.pendingBacklink).reduce( function (a, b) {
      return a + b;
    }, 0);
    this.totalOtherPending = this.websites.map( website => website.progress.pendingOther).reduce( function (a, b) {
      return a + b;
    }, 0);
  }

  changeDays(days: Number) {
    switch (days) {
      case 1:
        this.oneDay = true; this.sevenDays = false; this.fifteenDays = false; this.thirtyDays = false; this.sixtyDays = false;
        this.restartCharts('chartThree', 15);
        break;
      case 7:
        this.oneDay = false; this.sevenDays = true; this.fifteenDays = false; this.thirtyDays = false; this.sixtyDays = false;
        this.restartCharts('chartThree', 15);
        break;
      case 15:
        this.oneDay = false; this.sevenDays = false; this.fifteenDays = true; this.thirtyDays = false; this.sixtyDays = false;
        this.restartCharts('chartThree', 15);
        break;
      case 30:
        this.oneDay = false; this.sevenDays = false; this.fifteenDays = false; this.thirtyDays = true; this.sixtyDays = false;
        this.restartCharts('chartFour', 30);
        break;
      case 60:
        this.oneDay = false; this.sevenDays = false; this.fifteenDays = false; this.thirtyDays = false; this.sixtyDays = true;
        this.restartCharts('chartFive', 60);
        break;
      default:
        break;
    }
  }

  filterSelect( event: any) {
    this.clearAll('blah');
    this.websites = this.backUpWebsites;
    if (parseInt(event.srcElement.value, 10) === 5) {
      this.websites = this.backUpWebsites;
    } else if (parseInt(event.srcElement.value, 10) !== 4) {
      this.websites = this.websites.filter( website => website.data.priority === parseInt(event.srcElement.value, 10));
    } else {
      this.websites = this.websites.filter( website => website.data.priority !== 0);
    }
    this.totalWebsites = this.websites.length;
    this.countTotalPending();
    this.restartCharts('chartThree', 15);
  }

  filterCheckbox( event: any, field: any ) {
    if (!$('#sold-check').is(':checked')) {
      this.websites = this.backUpWebsites;
      return;
    }
    this.websites = this.websites.filter( website => website.data.sold === event.srcElement.checked);
    this.restartCharts('chartThree', 15);
    this.countTotalPending();
    this.totalWebsites = this.websites.length;
  }

  searchBy( field: string, value: string , element: any, key: any = null) {
    if ( value.length <= 0 || value === '' ) {
      Object.assign(this.websites, this.backUpWebsites);
      this.countTotalPending();
      this.restartCharts('chartThree', 15);
      return;
    }
    if (key) {
      this.websites = this.websites.filter( website => website[element][field][key].toLocaleLowerCase().includes(value.toLocaleLowerCase()));
    } else {
      this.websites = this.websites.filter( website => website[element][field].toLocaleLowerCase().includes(value.toLocaleLowerCase()));
    }
    this.restartCharts('chartThree', 15);
    this.countTotalPending();
    this.totalWebsites = this.websites.length;
  }

  // Sorters
  /*------------------------------------------------*/

  sortByFavorite() {
    if (!this.sortedByFavorite) {
      this.sortedByFavorite = true;
      this.websites.sort(function(a, b) {
        const keyA = a.data.favorite, keyB = b.data.favorite;
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
    } else {
      this.sortedByFavorite = false;
      Object.assign(this.websites, this.backUpWebsites);
    }
  }

  sortBySold() {
    if (!this.sortedBySold) {
      this.sortedBySold = true;
      this.websites.sort(function(a, b) {
        const keyA = a.data.sold, keyB = b.data.sold;
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
    } else {
      this.sortedBySold = false;
      Object.assign(this.websites, this.backUpWebsites);
    }
  }

  sortByDomain() {
    this.clearAll('domain');
    if (!this.sortedByDomain) {
      this.sortedByDomain = true;
      this.websites.sort(function(a, b) {
        const keyA = a.data.domain.toUpperCase(), keyB = b.data.domain.toUpperCase();
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
    } else {
      if (!this.reverseByDomain) {
        this.reverseByDomain = true;
        this.websites.reverse();
      } else {
        this.reverseByDomain = false;
        this.sortedByDomain = false;
        Object.assign(this.websites, this.backUpWebsites);
      }
    }
  }

  sortByKeyword() {
    this.clearAll('keyword');
    if (!this.sortedByKeyword) {
      this.sortedByKeyword = true;
      this.websites.sort(function(a, b) {
        const keyA = a.keyword.keyword.toUpperCase(), keyB = b.keyword.keyword.toUpperCase();
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
    } else {
      if (!this.reverseByKeyword) {
        this.reverseByKeyword = true;
        this.websites.reverse();
      } else {
        this.reverseByKeyword = false;
        this.sortedByKeyword = false;
        Object.assign(this.websites, this.backUpWebsites);
      }
    }
  }

  sortByPositions() {
    this.loading = true;
    // Clear null and zero positions websites
    /*this.websites = this.websites.filter( website => (website.keyword.chartThree !== undefined && website.keyword.chartThree.data.length > 0 && website.keyword.chartThree.data[5] !== null));
    this.totalWebsites = this.websites.length;*/
    this.clearAll('position');
    if (!this.sortedByPosition) {
      this.sortedByPosition = true;
      this.websites.sort(function(a, b) {
        if (a.keyword.chartThree !== undefined && a.keyword.chartThree.data.length > 0 && a.keyword.chartThree.data[5] !== null) {
            return -1;
        }
        return 1;
      });

      this.websites.sort(function(a, b) {
        if ((a.keyword.chartThree !== undefined && a.keyword.chartThree.data.length > 0 && a.keyword.chartThree.data[5] !== null)
            && (b.keyword.chartThree !== undefined && b.keyword.chartThree.data.length > 0 && b.keyword.chartThree.data[5] !== null)) {
          if (a.keyword.chartThree.data[5] < b.keyword.chartThree.data[5]) {
            return -1;
          }
          if (a.keyword.chartThree.data[5] > b.keyword.chartThree.data[5]) {
            return 1;
          }
        }
        return 0;
      });
    } else {
      if (!this.reverseByPosition) {
        this.reverseByPosition = true;
        this.websites.sort(function(a, b) {
          if ((a.keyword.chartThree !== undefined && a.keyword.chartThree.data.length > 0 && a.keyword.chartThree.data[5] !== null)
              && (b.keyword.chartThree !== undefined && b.keyword.chartThree.data.length > 0 && b.keyword.chartThree.data[5] !== null)) {
            if (a.keyword.chartThree.data[5] > b.keyword.chartThree.data[5]) {
              return -1;
            }
            if (a.keyword.chartThree.data[5] < b.keyword.chartThree.data[5]) {
              return 1;
            }
          }
          return 0;
        });
      } else {
        this.reverseByPosition = false;
        this.sortedByPosition = false;
        if ($('#favorite-check').is(':checked')) {
          // Object.assign(this.websites, this.backUpWebsites);
          $('#favorite-check').prop( 'checked', true );
          this.filterCheckbox({srcElement: { checked : true}}, 'favorite');
        }
      }
    }
    this.loading = false;
  }

  sortByDemand() {
    this.clearAll('demand');
    if (!this.sortedByDemand) {
      this.sortedByDemand = true;
      this.websites.sort(function(a, b) {
        const keyA = a.keyword.demand, keyB = b.keyword.demand;
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
    } else {
      if (!this.reverseByDemand) {
        this.reverseByDemand = true;
        this.websites.reverse();
      } else {
        this.reverseByDemand = false;
        this.sortedByDemand = false;
        Object.assign(this.websites, this.backUpWebsites);
      }
    }
  }

  sortByCity() {
    this.clearAll('city');
    if (!this.sortedByCity) {
      this.sortedByCity = true;
      this.websites.sort(function(a, b) {
        const keyA = a.city.name.toUpperCase(), keyB = b.city.name.toUpperCase();
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
    } else {
      if (!this.reverseByCity) {
        this.reverseByCity = true;
        this.websites.reverse();
      } else {
        this.reverseByCity = false;
        this.sortedByCity = false;
        Object.assign(this.websites, this.backUpWebsites);
      }
    }
  }

  sortByTechnology() {
    this.clearAll('technology');
    if (!this.sortedByTechnology) {
      this.sortedByTechnology = true;
      this.websites.sort(function(a, b) {
        const keyA = a.data.technology.name.toUpperCase(), keyB = b.data.technology.name.toUpperCase();
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
    } else {
      if (!this.reverseByTechnology) {
        this.reverseByTechnology = true;
        this.websites.reverse();
      } else {
        this.reverseByTechnology = false;
        this.sortedByTechnology = false;
        Object.assign(this.websites, this.backUpWebsites);
      }
    }
  }

  sortByType() {
    this.clearAll('type');
    if (!this.sortedByType) {
      this.sortedByType = true;
      this.websites.sort(function(a, b) {
        const keyA = a.data.type.name.toUpperCase(), keyB = b.data.type.name.toUpperCase();
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
    } else {
      if (!this.reverseByType) {
        this.reverseByType = true;
        this.websites.reverse();
      } else {
        this.reverseByType = false;
        this.sortedByType = false;
        Object.assign(this.websites, this.backUpWebsites);
      }
    }
  }

  sortByCategory() {
    this.clearAll('category');
    if (!this.sortedByCategory) {
      this.sortedByCategory = true;
      this.websites.sort(function(a, b) {
        const keyA = a.data.category.name.toUpperCase(), keyB = b.data.category.name.toUpperCase();
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
    } else {
      if (!this.reverseByCategory) {
        this.reverseByCategory = true;
        this.websites.reverse();
      } else {
        this.reverseByCategory = false;
        this.sortedByCategory = false;
        Object.assign(this.websites, this.backUpWebsites);
      }
    }
  }

  clearAll(except: string) {
    if (except !== 'position') {
      this.sortedByPosition = false;
      this.reverseByPosition = false;
    }
    if (except !== 'domain') {
      this.sortedByDomain = false;
      this.reverseByDomain = false;
    }
    if (except !== 'keyword') {
      this.sortedByKeyword = false;
      this.reverseByKeyword = false;
    }
    if (except !== 'demand') {
      this.sortedByDemand = false;
      this.reverseByDemand = false;
    }
    if (except !== 'city') {
      this.sortedByCity = false;
      this.reverseByCity = false;
    }
    if (except !== 'technology') {
      this.sortedByTechnology = false;
      this.reverseByTechnology = false;
    }
    if (except !== 'type') {
      this.sortedByType = false;
      this.reverseByType = false;
    }
    if (except !== 'category') {
      this.sortedByCategory = false;
      this.reverseByCategory = false;
    }
  }

  onClick(e: any, page: any, id: any) {
    e.preventDefault();
    window.open( '/#/' + page + '/' + id);
  }

  changePriority(website: any) {
    if (website.priority < 3) {
      website.priority++;
    } else {
      website.priority = 0;
    }
    this._websitesService.updatePriority(website._id, website.priority).subscribe((response: any) => {
      /*this.websites.sort(function(a, b) {
        const keyA = a.data.priority, keyB = b.data.priority;
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
      this.websites.reverse();*/
    });
  }

}
