import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Models
import { Page } from '../../models/page.model';
import { Keyword } from '../../models/keyword.model';

// Services
import { PageService, SemanticTaskService } from 'src/app/services/service.index';

declare var $: any;

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: []
})
export class NewPageComponent implements OnInit {

  @Input() website: string;
  @Input() keywords: Keyword[];
  @Output() updatePages: EventEmitter<any>  = new EventEmitter();

  public disabled = false;
  public form: FormGroup;
  public pages: Page[] = [];
  public total: number;

  constructor( public _pageService: PageService,
               public _semanticService: SemanticTaskService) {
  }

  ngOnInit() {
    this._pageService.loadPages(this.website).subscribe( (response: any) => {
      this.pages = response.pages;
      this.total = response.count;
    });

    this.form = new FormGroup({
      'name' : new FormControl({ value : '', disabled: this.disabled }, [ Validators.required, Validators.minLength(2) ]),
      'website' : new FormControl({ value: this.website }),
      'mother' : new FormControl(),
      'keywords' : new FormControl(),
    });
  }

  newPage() {
    this._pageService.create( this.setPage() ).subscribe( (page: any) => {
      $('#new-page-modal').modal('hide');
      this.form.reset();
      this._pageService.loadPages(this.website).subscribe( (response: any) => {
        this._semanticService.loadTasks( this.website ).subscribe( (tasks: any) => {
          if (tasks.tasks.length > 0) {
            tasks.tasks.forEach( (task: any) => {
              this._semanticService.createRelationForPage( task._id, page._id);
            });
          }
        });
        this.pages = response.pages;
        this.total = response.count;
      });
      this.updatePages.emit(null);
    });
  }

  setPage() {
    const page = new Page(
      this.form.value.name,
      this.website,
      this.total + 1,
      this.form.value.keywords,
      true,
      true,
      false,
      this.form.value.mother);
    return page;
  }

}
