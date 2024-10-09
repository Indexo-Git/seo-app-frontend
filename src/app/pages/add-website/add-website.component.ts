import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, } from 'rxjs';
import { Router } from '@angular/router';

// Models
import { Network } from 'src/app/models/network.model';
import { Category } from 'src/app/models/category.model';
import { Type } from 'src/app/models/type.model';
import { Technology } from 'src/app/models/technology.model';
import { Website } from 'src/app/models/website.model';
import { City } from 'src/app/models/city.model';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { NetworkService, TypeService , CategoryService, WebsiteService, TechnologyService, KeywordService, CityService } from 'src/app/services/service.index';

@Component({
  selector: 'app-add-website',
  templateUrl: './add-website.component.html',
  styles: []
})
export class AddWebsiteComponent implements OnInit {

  public loading: boolean;
  public loadingCounter = 0;

  public networks: Network[] = [];
  public categories: Category[] = [];
  public types: Type[] = [];
  public technologies: Technology[] = [];
  public cities: City[] = [];
  public keywords: any[] = [];

  public technologyID: string;
  public categoryID: string;
  public typeID: string;

  public website: Website;
  public websites: Website[] = [];

  public form: FormGroup;
  public formKeywords: FormGroup;

  public disableCategory = false;
  public disableCategories = false;
  public disableType = false;
  public disableTypes = false;
  public disableTechnology = false;
  public disableTechnologies = false;
  public disableCity = false;
  public disableCities = false;

  public checkedNetworks: any = [];
  public selectedCategory = '';
  public selectedTechnology = '';
  public selectedType = '';
  public selectedCity = '';

  public hasPrimary = false;

  constructor(private _toasterService: ToasterService,
              private _networkService: NetworkService,
              private _categoryService: CategoryService,
              private _typeService: TypeService,
              private _technologyService: TechnologyService,
              private _keywordService: KeywordService,
              private _websiteService: WebsiteService,
              private _cityService: CityService,
              private _router: Router) {}

  ngOnInit() {
    this.loading = true;
    const timer = setInterval(() => {
      if (this.loadingCounter === 5) {
        this.loading = false;
        clearTimeout(timer);
      }
    }, 500);
    this.loadCities();
    this.loadTechnologies();
    this.loadTypes();
    this.loadCategories();
    this.loadNetworks();

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

    this.form = new FormGroup({
      'domain' : new FormControl({ value : '', disabled: false }, [ Validators.required, Validators.pattern(reg) ], [ this.validateDomain.bind(this)]),
      'comment' : new FormControl({ value : '', disabled: false }, [ Validators.minLength(10) ]),
      'favorite' : new FormControl(),
      'sold' : new FormControl (),
      'technology' : new FormControl({ value : '', disabled: this.disableTechnology }, [ Validators.minLength(2) ]),
      'type' : new FormControl({ value : '', disabled: this.disableType }, [ Validators.minLength(2) ]),
      'category' : new FormControl({ value : '', disabled: this.disableCategory }, [Validators.minLength(2) ]),
      'network' : new FormControl({ value : '', disabled: false }, [ Validators.minLength(2) ]),
      'city' : new FormControl({ value : '', disabled: this.disableCity }, [ Validators.minLength(2) ])
    });

    this.formKeywords = new FormGroup({
      'keyword' : new FormControl({ value : '', disabled: false }, [ Validators.required, Validators.minLength(2) ]),
      'primary' : new FormControl(),
      'demand' : new FormControl({ value : 0, disabled: false })
    });

  }

  validateDomain(control: FormControl ): Promise<any>|Observable<any> {
    if (!control.value) {
      return Promise.resolve(null);
    }
    return this._websiteService.websiteBy('domain', control.value).toPromise().then((websites: any) => {
      if (websites.count) {
        return { exist: true };
      } else {
        return null;
      }
    });

  }

  // ------------------------
  // Getting external data
  // ------------------------

  loadNetworks() {
    this._networkService.loadNetworks().subscribe( (response: any) => {
      response.networks.forEach( (websiteNetwork: any) => {
        this.networks.push(websiteNetwork.network);
      });
      this.loadingCounter++;
    });
  }

  loadCategories() {
    this._categoryService.loadCategories().subscribe( (response: any) => {
      this.categories = response.categories;
      this.loadingCounter++;
    });
  }

  loadTypes() {
    this._typeService.loadTypes().subscribe( (response: any) => {
      this.types = response.types;
      this.loadingCounter++;
    });
  }

  loadTechnologies() {
    this._technologyService.loadTechnologies().subscribe( (response: any) => {
      this.technologies = response.technologies;
      this.loadingCounter++;
    });
  }

  loadCities() {
    this._cityService.loadCities().subscribe( (response: any) => {
      this.cities = response.cities;
      this.loadingCounter++;
    });
  }

  // ------------------------
  // Form behavior
  // ------------------------

  manageTechnologies() {
    if (this.form.value.technology === '') {
      this.disableTechnologies = false;
    } else {
      this.disableTechnologies = true;
      this.selectedTechnology = '';
    }
  }

  onTechnologyChange( event: any) {
    if (event.target.checked) {
      this.selectedTechnology = event.target.value;
    }
  }

  manageTypes() {
    if (this.form.value.type === '') {
      this.disableTypes = false;
    } else {
      this.disableTypes = true;
      this.selectedType = '';
    }
  }

  onTypeChange( event: any) {
    if (event.target.checked) {
      this.selectedType = event.target.value;
    }
  }

  manageCategories() {
    if (this.form.value.category === '') {
      this.disableCategories = false;
    } else {
      this.disableCategories = true;
      this.selectedCategory = '';
    }
  }

  onCategoryChange( event: any) {
    if (event.target.checked) {
      this.selectedCategory = event.target.value;
    }
  }

  onNetworkChange( event: any) {
    if (event.target.checked) {
      this.checkedNetworks.push(event.target.value);
    } else {
      this.checkedNetworks.forEach((item, index, object) => {
        if (item === event.target.value) {
          object.splice(index, 1);
        }
      });
    }
  }

  manageCities() {
    if (this.form.value.city === '') {
      this.disableCities = false;
    } else {
      this.disableCities = true;
      this.selectedCity = '';
    }
  }

  onCityChange( event: any) {
    if (event.target.checked) {
      this.selectedCity = event.target.value;
    }
  }

  addKeyword(keyword: any, demand: any, primary: any) {
    if (keyword.value === '') {
      this._toasterService.pop('warning', 'Warning!', 'You didn\'t write any keyword!');
      return;
    }
    if (demand.value === '') {
      this._toasterService.pop('warning', 'Warning!', 'You didn\'t write any demand!');
      return;
    }
    if (this.hasPrimary && primary.checked) {
      this._toasterService.pop('warning', 'Warning!', 'You have already chosen your primary keyword!');
      return;
    }
    if (primary.checked) {
      this.hasPrimary = true;
    }
    this.keywords.push({name: keyword.value, demand:  demand.value, primary: primary.checked});
    keyword.value = '';
    demand.value = '';
    primary.checked = false;
  }

  bulkKeywords(control: any) {
    const bulk = control.value.split('\n');

    bulk.forEach((row: any) => {
      const split = row.split('/', 2);
      const keyword = split[0];
      const demand = split[1];
      this.keywords.push({name: split[0], demand:  split[1], primary: false});
    });
  }

  deleteKeyword(index: number) {
    if (this.keywords[index].primary) {
      this.hasPrimary = false;
    }
    this.keywords.splice(index, 1);
  }

  // ------------------------
  // Save website
  // ------------------------
  async saveWebsite(stay = false) {
    // Validate empty technology
    if (this.form.value.technology === '' && this.selectedTechnology === '') {
      this._toasterService.pop('warning', 'Warning!', 'You didn\'t choose any technology!');
      return;
    }
    // Validate empty type
    if (this.form.value.type === '' && this.selectedType === '') {
      this._toasterService.pop('warning', 'Warning!', 'You didn\'t choose any type!');
      return;
    }
    // Validate empty category
    if (this.form.value.category === '' && this.selectedCategory === '') {
      this._toasterService.pop('warning', 'Warning!', 'You didn\'t choose any category!');
      return;
    }
    // Validate empty network
    if (this.form.value.network === '' && this.checkedNetworks.length === 0 ) {
      this._toasterService.pop('warning', 'Warning!', 'You didn\'t choose any network!');
      return;
    }
    // Validate empty city
    if (this.form.value.city === '' && this.selectedCity === '') {
      this._toasterService.pop('warning', 'Warning!', 'You didn\'t choose any city!');
      return;
    }
    // Validate empty keywords
    if (this.keywords.length === 0 ) {
      this._toasterService.pop('warning', 'Warning!', 'You didn\'t add any keyword!');
      return;
    }
    // Validate primary keyword
    if (!this.hasPrimary) {
      this._toasterService.pop('warning', 'Warning!', 'You haven\'t choose your primary keyword!');
      return;
    }
    // Once we have all the info
    // Get selected technology if not create it
    if ( this.selectedTechnology !== '' || this.selectedTechnology === undefined) {
      this.technologyID = this.selectedTechnology;
    } else {
      this.technologyID = await this._technologyService.create(this.form.value.technology).toPromise().then((technology: Technology) => technology._id);
    }
    // Get selected type if not create it
    if ( this.selectedType !== '' || this.selectedType === undefined) {
      this.typeID = this.selectedType;
    } else {
      this.typeID = await this._typeService.create(this.form.value.type).toPromise().then((type: Type) => type._id);
    }
    // Get selected category if not create it
    if ( this.selectedCategory !== '') {
      this.categoryID = this.selectedCategory;
    } else {
      this.categoryID = await this._categoryService.create({ name : this.form.value.category}).toPromise().then((category: Category) => category._id);
    }
    // Set website
    let comment: string;
    if (this.form.value.comment === '') {
      comment = null;
    } else {
      comment = this.form.value.comment;
    }
    const website = new Website(
      this.form.value.domain,
      this.form.value.favorite,
      this.form.value.sold,
      this.typeID,
      this.categoryID,
      this.technologyID,
      null,
      null,
      comment
    );
    // Create website
    const newWebsite = await this._websiteService.create(website).toPromise().then((createdWebsite: Website) => createdWebsite);

    if ( this.checkedNetworks.length > 0) {
      this.checkedNetworks.forEach( (network: any) => {
        this._networkService.createRel({ website: newWebsite._id, network: network }).subscribe();
      });
    } else {
      this._networkService.create({ name: this.form.value.network }).subscribe( ( network: Network ) => {
        this._networkService.createRel({ website: newWebsite._id, network: network._id }).subscribe();
      });
    }

    let cityName: string;
    if ( this.selectedCity !== '') {
      const chosenCity: any = this.cities.filter(city => city._id === this.selectedCity);
      cityName = chosenCity[0].name;
      this._cityService.createRel({ website: newWebsite._id, city: this.selectedCity}).subscribe();
    } else {
      cityName = this.form.value.city;
      this._cityService.create(newWebsite._id, this.form.value.city).subscribe();
    }

    this.keywords.forEach((keyword: any) => {
      this._keywordService.create({ name : keyword.name, website: newWebsite._id, demand: keyword.demand, primary: keyword.primary }).subscribe();
      if (keyword.primary) {
        const primary = {
          keyword: keyword.name,
          position: null,
          demand: keyword.demand,
          url: keyword.name.trim().split(' ').join('+'),
          chart : null
        };

        this._websiteService.updatePrimary(newWebsite._id, primary).subscribe();
      }
    });

    this._websiteService.updateCityName(newWebsite._id, cityName).subscribe( () => {

      if (stay) {
        this.cleanForm();
      } else {
        this._router.navigate(['/dashboard']);
      }
    });
  }

  cleanForm() {
    this.form.reset();
    this.disableCategory = false;
    this.disableCategories = false;
    this.disableType = false;
    this.disableTypes = false;
    this.disableTechnology = false;
    this.disableTechnologies = false;
    this.disableCity = false;
    this.disableCities = false;

    this.checkedNetworks = [];
    this.keywords = [];
    this.hasPrimary = false;
    this.selectedCategory = '';
    this.selectedTechnology = '';
    this.selectedType = '';
    this.selectedCity = '';
    window.scroll(0, 0);
  }

  // ------------------------
  // Delete components
  // ------------------------

  deleteByField ( field: string, id: string) {
    this._websiteService.websiteBy(field, id).subscribe((response: any) => {
      if (response.count > 0) {
        this._toasterService.pop('error', 'Error!', 'You can\'t delete this ' + field + ' because is related to ' + response.count + ' websites!');
        return;
      }
      if (field === 'technology') {
        this._technologyService.delete(id).subscribe(() => {
          this.loadTechnologies();
        });
      }
      if (field === 'type') {
        this._typeService.delete(id).subscribe(() => {
          this.loadTypes();
        });
      }
      if (field === 'category') {
        this._categoryService.delete(id).subscribe(() => {
          this.loadCategories();
        });
      }
    });
  }

  deleteCity (id: string) {
    this._cityService.getRelations(id).subscribe((response: any) => {
      if (response.relations.length > 0) {
        this._toasterService.pop('error', 'Error!', 'You can\'t delete this city because is related to other websites!');
        return;
      }
      this._cityService.delete(id).subscribe(() => {
        this.loadCities();
      });
    });
  }

}
