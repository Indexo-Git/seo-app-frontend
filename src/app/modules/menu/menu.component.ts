import { Component, OnInit, Input, OnDestroy } from '@angular/core';

// Models
import { Website } from '../../models/website.model';
import { Page } from '../../models/page.model';
import { PageSemantic } from '../../models/pageSemantic.model';
import { SemanticTask } from '../../models/semanticTask.model';
import { TechnicalTask } from '../../models/technicalTask.model';
import { User } from '../../models/user.model';
import { Subscription, Observable } from 'rxjs';
import { Onsite } from '../../models/onsite.model';
import { Offsite } from '../../models/offsite.model';

// Services
import { PageService, SemanticTaskService, TechnicalTaskService, UserService, OnsiteService, OffsiteService } from 'src/app/services/service.index';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: []
})
export class MenuComponent implements OnInit, OnDestroy {

  @Input() public website: Website;
  @Input() public subMenuActive: string;
  @Input() public menuActive: string;

  public user: User;
  public pages: any[] = [];
  public totalPages: number;
  public totalPagesDone: number;
  public percentPages: number;

  public semanticTasks: SemanticTask[] = [];
  public totalSemanticTasks: number;
  public totalSemanticTasksDone: number;
  public percentSemantic: number;

  public technicalTasks: TechnicalTask[] = [];
  public totalTechnicalTasks: number;
  public totalTechnicalTasksDone: number;
  public percentTechnical: number;

  public onsiteTasks: Onsite[] = [];
  public totalOnsite: number;
  public totalOnsiteDone: number;
  public percentOnsite: number;

  public offsiteTasks: Offsite[] = [];
  public totalOffsite: number;
  public totalOffsiteDone: number;
  public percentOffsite: number;

  private contentSubscription: Subscription;
  private onPageSubscription: Subscription;
  private technicalSubscription: Subscription;
  private onsiteSubscription: Subscription;
  private offsiteSubscription: Subscription;

  @Input() updateContent: Observable<void>;
  @Input() updateOnPage: Observable<void>;
  @Input() updateTechnical: Observable<void>;
  @Input() updateOnsite: Observable<void>;
  @Input() updateOffsite: Observable<void>;

  constructor( public _pageService: PageService,
               public _semanticService: SemanticTaskService,
               public _technicalService: TechnicalTaskService,
               public _onsiteService: OnsiteService,
               public _offsiteService: OffsiteService,
               public _userService: UserService) {
  }

  ngOnInit() {
    this.user = this._userService.user;
    this.loadAll();
    if (this.updateContent) {
      this.contentSubscription = this.updateContent.subscribe( () => this.loadPages());
    }
    if (this.updateOnPage) {
      this.onPageSubscription = this.updateOnPage.subscribe( () => this.loadSemantic());
    }
    if (this.updateTechnical) {
      this.technicalSubscription = this.updateTechnical.subscribe( () => this.loadTechnical());
    }
    if (this.updateOnsite) {
      this.onsiteSubscription = this.updateOnsite.subscribe( () => this.loadOnsite());
    }
    if (this.updateOnsite) {
      this.offsiteSubscription = this.updateOffsite.subscribe( () => this.loadBackLinks());
    }
  }

  ngOnDestroy() {
    if (this.contentSubscription) {
      this.contentSubscription.unsubscribe();
    }
    if (this.onPageSubscription) {
      this.onPageSubscription.unsubscribe();
    }
    if (this.technicalSubscription) {
      this.technicalSubscription.unsubscribe();
    }
    if (this.onsiteSubscription) {
      this.onsiteSubscription.unsubscribe();
    }
    if (this.offsiteSubscription) {
      this.offsiteSubscription.unsubscribe();
    }
  }

  loadAll() {
    this.loadPages();
    this.loadSemantic();
    this.loadTechnical();
    this.loadOnsite();
    this.loadBackLinks();
  }

  loadPages() {
    this.totalPagesDone = 0;
    this.totalPages = 0;
    this.percentPages = 0;
    this._pageService.loadPagesForTable(this.website._id).subscribe( (response: any) => {
      this.pages = response;
      this.totalPages = this.pages.length;
      this.pages.forEach( (page: any) => {
        if (page.page.online) {
          this.totalPagesDone++;
        }
        if (page.daughters.length > 0) {
          this.totalPages += page.daughters.length;
          page.daughters.forEach( (daughter: any) => {
            if (daughter.online) {
              this.totalPagesDone++;
            }
          });
        }
      });
      if (this.totalPages !== 0) {
        this.percentPages = Math.round((this.totalPagesDone * 100) / this.totalPages);
      }
    });
  }

  loadSemantic() {
    this.totalSemanticTasks = 0;
    this.totalSemanticTasksDone = 0;
    this.percentSemantic = 0;
    this._semanticService.loadTasks( this.website._id ).subscribe( (response: any) => {
      this.semanticTasks = response.tasks;
      this._pageService.loadPages( this.website._id ).subscribe( (responsePages: any) => {
        this.totalSemanticTasks = this.semanticTasks.length * responsePages.pages.length;
        responsePages.pages.forEach((page: Page) => {
          if (page.online) {
            this._pageService.getTasks(page._id).subscribe( (responseTasks: any) => {
              responseTasks.tasks.forEach( (task: PageSemantic) => {
                if (task.status) {
                  this.totalSemanticTasksDone++;
                }
              });
              if (this.semanticTasks.length !== 0) {
                this.percentSemantic = Math.round((this.totalSemanticTasksDone * 100) / this.totalSemanticTasks);
              }
            });
          }
        });
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
    });
  }

  loadOnsite() {
    this.totalOnsite = 0;
    this.totalOnsiteDone = 0;
    this.percentOnsite = 0;
    this._onsiteService.loadOnsite( this.website._id ).subscribe( (response: any) => {
      this.onsiteTasks = response.tasks;
      this.totalOnsite = response.count;
      this.onsiteTasks.forEach( (task: Onsite) => {
        if (task.status) {
          this.totalOnsiteDone++;
        }
      });
      if (response.count !== 0) {
        this.totalOnsite = response.count;
        this.percentOnsite = Math.round((this.totalOnsiteDone * 100) / this.totalOnsite);
      }
    });
  }

  loadBackLinks() {
    this.totalOffsite = 0;
    this.totalOffsiteDone = 0;
    this.percentOffsite = 0;
    this._offsiteService.loadOffsite(this.website._id).subscribe( (responseOffsite: any) => {
      if (responseOffsite.count > 0) {
        this.totalOffsite = responseOffsite.count;
        responseOffsite.tasks.forEach( (task: Offsite) => {
          if (task.status) {
            this.totalOffsiteDone++;
          }
        });
        this.percentOffsite = Math.round((this.totalOffsiteDone * 100) / this.totalOffsite);
      }
    });
  }

}
