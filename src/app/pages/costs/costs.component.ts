import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Services
import { WebsiteService, UserService, CostService } from 'src/app/services/service.index';

// Models
import { Website } from '../../models/website.model';
import { User } from 'src/app/models/user.model';
import { Cost } from 'src/app/models/cost.model';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styles: []
})
export class CostsComponent implements OnInit {

  public loading: boolean;

  public website: Website;
  public user: User;
  public costs: Cost[] = [];

  public onPage: number;
  public netlinking: number;
  public other: number;
  public total: number;

  public form: FormGroup;

  constructor(public _activatedRoute: ActivatedRoute,
              public _costService: CostService,
              public _websiteService: WebsiteService,
              public _userService: UserService) {}

  ngOnInit() {
    this.loading = true;
    this.user = this._userService.user;
    this._activatedRoute.params.subscribe( params => {
      const id = params['id'];
      this.getInfo(id);
    });
    this.form = new FormGroup({
      'category' : new FormControl({ value : '', disabled: false }, [ Validators.required ]),
      'value' : new FormControl({ value : '', disabled: false }, [ Validators.required ]),
      'comment' : new FormControl({ value : '', disabled: false }, [ Validators.required ]),
      'date' : new FormControl({ value : '', disabled: false }, [ Validators.required ])
    });
  }

  getInfo(id: string) {
    this.onPage = 0;
    this.netlinking = 0;
    this.other = 0;
    this.total = 0;
    this._websiteService.getWebsite(id).subscribe( (response: any) => {
      this.website = response.website[0];
      this._costService.loadCosts(this.website._id).subscribe((costs: Cost[]) => {
        this.costs = costs.reverse();
        this.costs.forEach((cost: Cost) => {
          if (cost.category === 'On-page') {
            this.onPage = this.onPage + cost.value;
          }
          if (cost.category === 'Netlinking') {
            this.netlinking = this.netlinking + cost.value;
          }
          if (cost.category === 'Other') {
            this.other = this.other + cost.value;
          }
        });
        this.total = this.onPage + this.netlinking + this.other;
        this.loading = false;
      });
    });
  }

  saveCost() {
    this.loading = false;
    if (!this.form.valid) {
      return;
    }

    this._costService.create({
      category: this.form.value.category,
      value: this.form.value.value,
      date: this.form.value.date,
      comment: this.form.value.comment,
      website: this.website._id
    }).subscribe(() => {
      this.getInfo(this.website._id);
      this.form.reset();
    });
  }

  deleteCost(id: string) {
    this._costService.delete(id).subscribe((response: any) => {
      this.getInfo(this.website._id);
    });
  }

}
