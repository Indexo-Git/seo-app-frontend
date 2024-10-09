import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Models
import { Website } from '../../models/website.model';
import { Keyword } from '../../models/keyword.model';
import { Network } from '../../models/network.model';
import { City } from '../../models/city.model';
import { Technology } from '../../models/technology.model';
import { Type } from '../../models/type.model';
import { Category } from '../../models/category.model';
import { WebsiteCity } from '../../models/websiteCity.model';
import { WebsiteNetwork } from '../../models/websiteNetwork.model';
import { Position } from '../../models/position.model';
import { Analyze } from '../../models/analyze.model';
import { Offsite } from '../../models/offsite.model';
import { Onsite } from '../../models/onsite.model';
import { Page } from '../../models/page.model';
import { SemanticTask } from '../../models/semanticTask.model';
import { PageSemantic } from '../../models/pageSemantic.model';
import { TechnicalTask } from '../../models/technicalTask.model';
import { Concurrent } from '../../models/concurrent.model';
import { BackLink } from '../../models/backLink.model';

// Services
import { WebsiteService, CityService, KeywordService, NetworkService, TechnologyService, TypeService, CategoryService, UserService, PositionService, AnalyzeService, OnsiteService, OffsiteService, PageService, SemanticTaskService, TechnicalTaskService, ConcurrentService, BackLinkService } from 'src/app/services/service.index';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

declare var $: any;

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styles: [
    '.table th, .table td {padding: 6px;}',
    ':host ::ng-deep .ck-editor__editable {min-height: 300px;}'
  ]
})
export class WebsiteComponent implements OnInit {

  public website: Website;
  public city: any;
  public relCity: any;
  public keywords: Keyword[];
  public users: any[] = [];

  public formCity: FormGroup;
  public cities: City[] = [];
  public selectedCity = '';
  public disableCity = false;
  public disableCities = false;

  public formTechnology: FormGroup;
  public technologies: Technology[] = [];
  public selectedTechnology = '';
  public disableTechnology = false;
  public disableTechnologies = false;

  public formType: FormGroup;
  public types: Type[] = [];
  public selectedType = '';
  public disableType = false;
  public disableTypes = false;

  public formCategory: FormGroup;
  public categories: Category[] = [];
  public selectedCategory = '';
  public disableCategory = false;
  public disableCategories = false;

  public formKeywords: FormGroup;
  public keyword: Keyword;

  public network: Network;
  public userNetworks: Network[] = [];
  public websiteNetworks: string[] = [];
  public checkedNetworks: any = [];

  public formComment: FormGroup;

  public formShare: FormGroup;

  public Editor = ClassicEditor;
  public editorAdmin = '';
  public editorUser = '';

  public deletingKeywords: boolean;
  public deletedTotalKeywords: number;
  public keywordsFinished: boolean;
  public deletingPositions: boolean;
  public deletedTotalPositions: number;
  public positionsFinished: boolean;
  public deletingAnalyze: boolean;
  public deletedAnalyze: boolean;
  public analyzeFinished: boolean;
  public deletingOnsiteTasks: boolean;
  public deletedTotalOnsite: number;
  public onsiteFinished: boolean;
  public deletingOffsiteTasks: boolean;
  public deletedTotalOffsite: number;
  public offsiteFinished: boolean;
  public deletingPages: boolean;
  public deletedTotalPages: number;
  public pagesFinished: boolean;
  public deletingSemanticTasks: boolean;
  public deletedTotalSemantic: number;
  public semanticFinished: boolean;
  public deletingTechnicalTasks: boolean;
  public deletedTotalTechnical: number;
  public technicalFinished: boolean;
  public deletingBackLinks: boolean;
  public deletedTotalBackLinks: number;
  public backLinksFinished: boolean;
  public deletingConcurrence: boolean;
  public deletedTotalConcurrence: number;
  public concurrenceFinished: boolean;
  public deletingUsers: boolean;
  public deletedTotalUsers: number;
  public usersFinished: boolean;
  public deletingNetworks: boolean;
  public deletedTotalNetworks: number;
  public networksFinished: boolean;
  public deletingCity: boolean;
  public cityFinished: boolean;

  public allFinished: boolean;
  public finalCounter = 5;

  constructor(public activatedRoute: ActivatedRoute,
              public _websiteService: WebsiteService,
              public _cityService: CityService,
              public _keywordService: KeywordService,
              public _networkService: NetworkService,
              public _technologyService: TechnologyService,
              public _typeService: TypeService,
              public _categoryService: CategoryService,
              public _userService: UserService,
              public _toasterService: ToasterService,
              public _positionService: PositionService,
              public _analyzeService: AnalyzeService,
              public _onsiteService: OnsiteService,
              public _offsiteService: OffsiteService,
              public _pageService: PageService,
              public _semanticService: SemanticTaskService,
              public _technicalService: TechnicalTaskService,
              public _backLinkService: BackLinkService,
              public _concurrentService: ConcurrentService,
              private router: Router) {

    this.formTechnology = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false }, [ Validators.minLength(2) ])
    });

    this.formType = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false }, [ Validators.minLength(2) ])
    });

    this.formKeywords = new FormGroup({
      'keyword' : new FormControl({ value : '', disabled: false }, [ Validators.required, Validators.minLength(2) ]),
      'primary' : new FormControl(),
      'demand' : new FormControl({ value : 0, disabled: false })
    });

    this.formCategory = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false }, [Validators.minLength(2) ])
    });

    this.formCity  = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false }, [Validators.minLength(2) ])
    });

    this.formComment = new FormGroup({
      'comment' : new FormControl({ value : '', disabled: false }, [Validators.minLength(10) ])
    });

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

    this.formShare = new FormGroup({
      'email' : new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] )
    });

    this.activatedRoute.params.subscribe( params => {
      const id = params['id'];
      this.getWebsite(id);
      this.getCity(id);
      this.getKeywords(id);
      this.getNetworks(id);
      this.getUsers(id);
    });
  }

  ngOnInit() {
  }

  getWebsite(id: string) {
    this._websiteService.getWebsite(id).subscribe( (response: any) => {
      this.website = response.website[0];
      if (this.website.comment) {
        this.formComment.setValue({'comment': this.website.comment});
      }
      if (this.website.connection) {
        this.editorAdmin = this.website.connection;
      }
      if (this.website.info) {
        this.editorUser = this.website.info;
      }
    });
  }

  getCity (id: string) {
    this._cityService.getCityFromWebsite(id).subscribe( (response: any) => {
      if (response.city) {
        this._websiteService.updateCityName(id, response.city.city.name).subscribe((update: any) => {
          this.relCity = response.city._id;
          this.city = response.city.city;
        });
      }
    });
  }

  getKeywords( id: string) {
    this._keywordService.loadKeywords(id).subscribe( (response: any) => {
      this.keywords = response.keywords;
      this.keywords.forEach( (keyword: any) => {
        if (keyword.primary) {
          const primary = {
            keyword: keyword.name,
            demand: keyword.demand,
            url: keyword.name.trim().split(' ').join('+')
          };

          // this._websiteService.updatePrimary(id, primary).subscribe();
        }
      });
    });
  }

  getNetworks( id: string) {
    this.userNetworks = [];
    this.websiteNetworks = [];
    this._networkService.loadNetworks().subscribe( (response: any) => {
      response.networks.forEach((element: any) => {
        this.userNetworks.push(element.network);
      });
    });

    this._networkService.loadNetworksFromWebsite(id).subscribe( (response: any) => {
      response.networks.forEach((element: any) => {
        this.websiteNetworks.push(element.network._id);
      });
      Object.assign(this.checkedNetworks, this.websiteNetworks);
    });
  }

  getUsers( id: string ) {
    this._websiteService.loadUsers(id).subscribe( (response: any) => {
      this.users = response.users;
    });
  }

  /*--------------------------------------------*/

  loadCities() {
    return this._cityService.loadCities();
  }

  showFormCity( city: City) {
    this.loadCities().subscribe( (response: any) => {
      this.cities = response.cities;
      if (city) {
        this.formCity.setValue({'name' : city.name});
      }
    });
  }

  onCityChange( event: any) {
    if (event.target.checked) {
      this.selectedCity = event.target.value;
    }
  }

  manageCities() {
    if (this.formCity.value.name === '') {
      this.disableCities = false;
    } else {
      this.disableCities = true;
      this.selectedCity = '';
    }
  }

  updateCity() {
    if ( this.formCity.valid ) {
      if ( this.selectedCity !== '') {
        if (this.relCity) {
          /*
          this._cityService.deleteRel(this.relCity).subscribe( (response: any) => {*/
            this._websiteService.updateCity(this.website._id, this.selectedCity).subscribe( () => {
              this.getCity(this.website._id);
              $('#city-modal').modal('hide');
              this.disableCities = false;
              /*this._cityService.createRel(this.setWebsiteCity(this.selectedCity)).subscribe( () => {
                this.getCity(this.website._id);
                $('#city-modal').modal('hide');
                this.disableCities = false;
              });*/
            });
          /*});*/
        } else {
          this._cityService.createRel(this.setWebsiteCity(this.selectedCity)).subscribe( () => {
            this.getCity(this.website._id);
            $('#city-modal').modal('hide');
            this.disableCities = false;
          });
        }
      } else {
        this._cityService.update(this.city._id, this.formCity.value.name).subscribe( (response: any) => {
          this.getCity(this.website._id);
          $('#city-modal').modal('hide');
          this.disableCities = false;
        });
      }
    } else {
      console.log('Hackerman...');
    }
  }

  newCity() {
    if ( this.formCity.valid ) {
      if (this.relCity) {
        this._cityService.deleteRel(this.relCity).subscribe( (response: any) => {
          this._cityService.create(this.website._id, this.formCity.value.name).subscribe( (city: City) => {
            this._cityService.createRel(this.setWebsiteCity(city._id)).subscribe( () => {
              this.getCity(this.website._id);
              $('#city-modal').modal('hide');
              this.disableCities = false;
              this.formCity.reset();
            });
          });
        });
      } else {
        this._cityService.create(this.website._id, this.formCity.value.name).subscribe( (city: City) => {
          this._cityService.createRel(this.setWebsiteCity(city._id)).subscribe( () => {
            this.getCity(this.website._id);
            $('#city-modal').modal('hide');
            this.disableCities = false;
            this.formCity.reset();
          });
        });
      }

    } else {
      console.log('Hackerman...');
    }
  }

  setWebsiteCity( city: string ) {
    return new WebsiteCity ( this.website._id, city);
  }

  /*--------------------------------------------*/

  loadTechnologies() {
    return this._technologyService.loadTechnologies();
  }

  showFormTechnology() {
    this.loadTechnologies().subscribe( (response: any) => {
      this.technologies = response.technologies;
      this.formTechnology.setValue({'name' : this.website.technology.name});
    });
  }

  onTechnologyChange( event: any) {
    if (event.target.checked) {
      this.selectedTechnology = event.target.value;
    }
  }

  manageTechnologies() {
    if (this.formTechnology.value.name === '') {
      this.disableTechnologies = false;
    } else {
      this.disableTechnologies = true;
      this.selectedTechnology = '';
    }
  }

  updateTechnology() {
    if ( this.formTechnology.valid ) {
      if ( this.selectedTechnology !== '') {
        this._websiteService.updateTechnology(this.website._id, this.selectedTechnology).subscribe( () => {
          this.getWebsite(this.website._id);
          $('#technology-modal').modal('hide');
          this.disableTechnologies = false;
        });
      } else {
        this._technologyService.update(this.website.technology._id, this.formTechnology.value.name).subscribe( () => {
          this.getWebsite(this.website._id);
          $('#technology-modal').modal('hide');
          this.disableTechnologies = false;
        });
      }
    } else {
      console.log('Hackerman...');
    }
  }

  newTechnology() {
    if ( this.formTechnology.valid ) {
      this._technologyService.create(this.formTechnology.value.name).subscribe( (technology: Technology) => {
        this._websiteService.updateTechnology(this.website._id, technology._id).subscribe( () => {
          this.getWebsite(this.website._id);
          $('#technology-modal').modal('hide');
          this.disableTechnologies = false;
          this.formTechnology.reset();
        });
      });
    } else {
      console.log('Hackerman...');
    }
  }

   /*--------------------------------------------*/

   loadTypes() {
    return this._typeService.loadTypes();
  }

  showFormTypes() {
    this.loadTypes().subscribe( (response: any) => {
      this.types = response.types;
      this.formType.setValue({'name' : this.website.type.name});
    });
  }

  onTypeChange( event: any) {
    if (event.target.checked) {
      this.selectedType = event.target.value;
    }
  }

  manageTypes() {
    if (this.formType.value.name === '') {
      this.disableTypes = false;
    } else {
      this.disableTypes = true;
      this.selectedType = '';
    }
  }

  updateType() {
    if ( this.formType.valid ) {
      if ( this.selectedType !== '') {
        this._websiteService.updateType(this.website._id, this.selectedType).subscribe( () => {
          this.getWebsite(this.website._id);
          $('#type-modal').modal('hide');
          this.disableTypes = false;
        });
      } else {
        this._typeService.update(this.website.type._id, this.formType.value.name).subscribe( () => {
          this.getWebsite(this.website._id);
          $('#type-modal').modal('hide');
          this.disableTypes = false;
        });
      }
    } else {
      console.log('Hackerman...');
    }
  }

  newType() {
    if ( this.formType.valid ) {
      this._typeService.create(this.formType.value.name).subscribe( (type: Type) => {
        this._websiteService.updateType(this.website._id, type._id).subscribe( () => {
          this.getWebsite(this.website._id);
          $('#type-modal').modal('hide');
          this.disableTypes = false;
          this.formType.reset();
        });
      });
    } else {
      console.log('Hackerman...');
    }
  }

  deleteType(id: string) {
     this._websiteService.websiteBy('type', id).subscribe( (response: any) => {
      if (response.count > 0) {
        this._toasterService.pop('error', 'Error!', 'You can\'t delete this type because is used for other websites');
      } else{
        this._typeService.delete(id).subscribe(() => {
          this.loadTypes().subscribe( (responseTypes: any) => {
            this.types = responseTypes.types;
          });
        });
      }
     });
  }

  /*--------------------------------------------*/

  loadCategories() {
    return this._categoryService.loadCategories();
  }

  showFormCategories() {
    this.loadCategories().subscribe( (response: any) => {
      this.categories = response.categories;
      this.formCategory.setValue({'name' : this.website.category.name});
    });
  }

  onCategoryChange( event: any) {
    if (event.target.checked) {
      this.selectedCategory = event.target.value;
    }
  }

  manageCategories() {
    if (this.formCategory.value.name === '') {
      this.disableCategories = false;
    } else {
      this.disableCategories = true;
      this.selectedCategory = '';
    }
  }

  updateCategory() {
    if ( this.formCategory.valid ) {
      if ( this.selectedCategory !== '') {
        this._websiteService.updateCategory(this.website._id, this.selectedCategory).subscribe( () => {
          this.getWebsite(this.website._id);
          $('#category-modal').modal('hide');
          this.disableCategories = false;
        });
      } else {
        this._categoryService.update(this.website.category._id, this.formCategory.value.name).subscribe( () => {
          this.getWebsite(this.website._id);
          $('#category-modal').modal('hide');
          this.disableCategories = false;
        });
      }

    } else {
      console.log('Hackerman...');
    }
  }

  newCategory() {
    if ( this.formType.valid ) {
      this._typeService.create(this.formType.value.name).subscribe( (type: Type) => {
        this._websiteService.updateType(this.website._id, type._id).subscribe( () => {
          this.getWebsite(this.website._id);
          $('#type-modal').modal('hide');
          this.disableTypes = false;
          this.formType.reset();
        });
      });
    } else {
      console.log('Hackerman...');
    }
  }

  /*--------------------------------------------*/

  showFormKeywords(keyword: Keyword) {
    this.keyword = keyword;
    this.formKeywords.setValue({'keyword' : keyword.name, 'primary': keyword.primary , 'demand': keyword.demand});
  }

  updateKeyword() {
    if ( this.formKeywords.valid ) {
      this._keywordService.update(this.setKeyword(this.formKeywords)).subscribe( (response: Keyword) => {
        this.getKeywords(this.website._id);
        $('#keywords-modal').modal('hide');
        this.formKeywords.reset();
        this.keyword = undefined;
      });
    } else {
      console.log('Hackerman...');
    }
  }

  newKeyword() {
    this.keyword = undefined;
    this._keywordService.create(this.setKeyword(this.formKeywords)).subscribe( (response: Keyword) => {
      this.getKeywords(this.website._id);
      $('#keywords-modal').modal('hide');
      this.formKeywords.reset();
    });
  }

  setKeyword (form: FormGroup ) {

    let demand: number;
    let primary: boolean;
    let id: string;

    if (this.keyword) {
      id = this.keyword._id;
    }

    if ( form.value.demand === null || form.value.demand === undefined ) {
      demand = 0;
    } else {
      demand = this.formKeywords.value.demand;
    }

    if ( form.value.primary === null || form.value.primary === undefined ) {
      primary = false;
    } else {
      primary = this.formKeywords.value.primary;
    }
    return new Keyword(this.formKeywords.value.keyword, this.website._id, demand, primary, id);
  }

  bulkKeywords() {
    const keywords = $('#bulk-keywords').val().split('\n');

    for (let i = 0; i < keywords.length; i++) {
      const split = keywords[i].split('/', 2);
      const keyword = split[0];
      const demand = split[1];
      if (keywords[i] !== '') {
        this._keywordService.create({ name: keyword, website: this.website._id, demand: demand, primary: false}).subscribe( (response: Keyword) => {
          if (keywords[i] === keywords[keywords.length - 1]) {
            this.getKeywords(this.website._id);
            $('#new-keywords-modal').modal('hide');
            $('#bulk-keywords').val('');
          }
        });
      } else {
        if (keywords[i] === keywords[keywords.length - 1]) {
          this.getKeywords(this.website._id);
          $('#new-keywords-modal').modal('hide');
          $('#bulk-keywords').val('');
        }
      }
    }

  }

  /*--------------------------------------------*/

  onNetworkChange( event: any) {
    if (event.target.checked) {
      this.checkedNetworks.push(event.target.value);
    } else {
      this.checkedNetworks.forEach((item: any, index: any, object: any) => {
        if (item === event.target.value) {
          object.splice(index, 1);
        }
      });
    }
  }

  updateRelNetworks() {
   if ( this.checkedNetworks.length > 0) {
      this._networkService.deleteRel(this.websiteNetworks, this.website._id ).subscribe( () => {
        this.checkedNetworks.forEach( (network: string, index: any) => {
          this._networkService.createRel({ website: this.website._id, network: network}).subscribe( (answer: any) => {
            if (this.checkedNetworks[index] === this.checkedNetworks[this.checkedNetworks.length - 1]) {
              this.getNetworks(this.website._id);
              $('#manage-networks-modal').modal('hide');
            }
          });
        });
      });
    }
  }

  setNetwork ( name: string,  id: string = null) {
    return new Network ( name, id);
  }

  setWebsiteNetwork( network: string ) {
    return new WebsiteNetwork ( this.website._id, network);
  }

  /*--------------------------------------------*/

  updateFavorite() {
    this._websiteService.updateFavorite(this.website._id, !this.website.favorite).subscribe( () => {
      this.getWebsite(this.website._id);
    });
  }

   updateSold() {
    this._websiteService.updateSold(this.website._id, !this.website.sold).subscribe( () => {
      this.getWebsite(this.website._id);
    });
   }

   updateCheckIndex() {
    this._websiteService.updateCheckIndex(this.website._id, !this.website.checkIndex).subscribe( (response:any) => {
      console.log(response);
      this.getWebsite(this.website._id);
    });
  }

   updateComment() {
     if (this.formComment.valid) {
      this._websiteService.updateComment(this.website._id, this.formComment.value.comment).subscribe( () => {
        this.getWebsite(this.website._id);
      });
     } else {
      console.log('Hackerman...');
    }

   }

   updateConnection() {
    this._websiteService.updateConnection(this.website._id, this.editorAdmin).subscribe( () => {
      this.getWebsite(this.website._id);
    });
   }

   updateInfo() {
    this._websiteService.updateInfo(this.website._id, this.editorUser).subscribe( () => {
      this.getWebsite(this.website._id);
    });
   }

   deleteKeyword( id: string) {
     this._keywordService.delete(id).subscribe( (response: any) => {
       this.getKeywords(this.website._id);
     });
   }

   addUser() {
     if ( this.formShare.valid ) {
       this._userService.getUserByEmail(this.formShare.value.email).subscribe( (response: any) => {
         if (response.user) {
           this._websiteService.createRel(response.user._id, this.website._id).subscribe( (result: any) => {
             console.log('result', result);
             this.getUsers(this.website._id);
             this.formShare.reset();
           });
         } else {
          this._toasterService.pop('error', 'Error!', 'This email is not registered in our system!');
         }
       });
     } else {
      console.log('Hackerman...');
    }
   }

   deleteRel( id: string) {
    this._websiteService.deleteRel(id).subscribe( () => {
      this.getUsers(this.website._id);
    });
   }

   deleteWebsite() {
     // Keywords and Positions
     this.deletingKeywords = true;
     this.keywordsFinished = false;
     this._keywordService.loadKeywords(this.website._id).subscribe( (keywordsResponse: any) => {
       if (keywordsResponse.count > 0) {
        this.deletedTotalKeywords = 0;
        keywordsResponse.keywords.forEach( (keyword: Keyword) => {
          this._keywordService.delete(keyword._id).subscribe( () => {
            this.deletedTotalKeywords++;
            if (keywordsResponse.count === this.deletedTotalKeywords) {
              this.keywordsFinished = true;
            }
          });
          this._positionService.loadPositions(keyword._id).subscribe( (responsePositions: any) => {
            if (responsePositions.positions.length > 0) {
              this.deletingPositions = true;
              this.deletedTotalPositions = 0;
              responsePositions.positions.forEach( (position: Position) => {
                this._positionService.delete( position._id).subscribe( () => {
                  this.deletedTotalPositions++;
                });
              });
            }
          });
        });
      } else {
        this.keywordsFinished = true;
      }
     });

     // Analyze
     this.deletingAnalyze = true;
     this.analyzeFinished = false;
     this._analyzeService.loadAnalyzes(this.website._id).subscribe( (responseAnalyze: any) => {
        if (responseAnalyze.analyze.length > 0) {
          let analyzeCounter = 0;
          responseAnalyze.analyze.forEach( (analyze: Analyze) => {
            this._analyzeService.delete(analyze._id).subscribe( () => {
              analyzeCounter++;
              if (responseAnalyze.analyze.length === analyzeCounter) {
                this.deletedAnalyze = true;
                this.analyzeFinished = true;
              }
            });
          });
        } else {
          this.deletingAnalyze = false;
          this.analyzeFinished = true;
        }
     });

     // Onsite
     this.deletingOnsiteTasks = true;
     this.onsiteFinished = false;
     this._onsiteService.loadOnsite(this.website._id).subscribe( (responseOnsite: any) => {
       if (responseOnsite.count > 0) {
         this.deletedTotalOnsite = 0;
         responseOnsite.tasks.forEach( (task: Onsite) => {
           this._onsiteService.delete(task._id).subscribe( () => {
            this.deletedTotalOnsite++;
            if (responseOnsite.count === this.deletedTotalOnsite) {
              this.onsiteFinished = true;
            }
           });
         });
       } else {
         this.deletingOnsiteTasks = false;
         this.onsiteFinished = true;
       }
     });

     // Offsite
     this.deletingOffsiteTasks = true;
     this.offsiteFinished = false;
     this._offsiteService.loadOffsite(this.website._id).subscribe( (responseOffsite: any) => {
       if (responseOffsite.count > 0) {
         this.deletedTotalOffsite = 0;
         responseOffsite.tasks.forEach( (task: Offsite) => {
           this._offsiteService.delete(task._id).subscribe( () => {
            this.deletedTotalOffsite++;
            if (responseOffsite.count === this.deletedTotalOffsite) {
              this.offsiteFinished = true;
            }
           });
         });
       } else {
         this.deletingOffsiteTasks = false;
         this.offsiteFinished = true;
       }
     });

     // Pages
     this.deletingPages = true;
     this.pagesFinished = false;
     this._pageService.loadPages(this.website._id).subscribe( (responsePages: any) => {
       if (responsePages.count > 0) {
         this.deletedTotalPages = 0;
         responsePages.pages.forEach( (page: Page) => {
           this._pageService.delete(page._id).subscribe( () => {
            this.deletedTotalPages++;
            if (responsePages.count === this.deletedTotalPages) {
              this.pagesFinished = true;
            }
           });
         });
       } else {
         this.deletingPages = false;
         this.pagesFinished = true;
       }
     });

     // Semantic
     this.deletingSemanticTasks = true;
     this.semanticFinished = false;
     this._semanticService.loadTasks(this.website._id).subscribe( (responseSemantic: any) => {
       if (responseSemantic.count > 0) {
        this.deletedTotalSemantic = 0;
        responseSemantic.tasks.forEach( (task: SemanticTask) => {
          this._semanticService.delete(task._id).subscribe( () => {
            this.deletedTotalSemantic++;
            if (responseSemantic.count === this.deletedTotalSemantic) {
              this.semanticFinished = true;
            }
          });
          this._semanticService.getRelations(task._id).subscribe( (responseRelations: any) => {
            if (responseRelations.relations.length > 0) {
              responseRelations.relations.forEach( (pageSemantic: PageSemantic) => {
                this._semanticService.deleteRelationForPage(pageSemantic._id).subscribe();
              });
            }
          });
        });
       } else {
         this.deletingSemanticTasks = false;
         this.semanticFinished = true;
       }
     });

     // Technical
     this.deletingTechnicalTasks = true;
     this.technicalFinished = false;
     this._technicalService.loadTasks(this.website._id).subscribe( (responseTechnical: any) => {
       if (responseTechnical.count > 0) {
         this.deletedTotalTechnical = 0;
         responseTechnical.tasks.forEach( (task: TechnicalTask) => {
          this._technicalService.delete(task._id).subscribe(() => {
            this.deletedTotalTechnical++;
            if (responseTechnical.count === this.deletedTotalTechnical) {
              this.technicalFinished = true;
            }
          });
         });
       } else {
         this.deletingTechnicalTasks = false;
         this.technicalFinished = true;
       }
     });

    // BackLinks
    this.deletingBackLinks = true;
    this.backLinksFinished = false;
    this._backLinkService.getBackLinksFromWebsite(this.website._id).subscribe( (responseBackLinks: any) => {
      if (responseBackLinks.backLinks.length > 0) {
        this.deletedTotalBackLinks = 0;
        responseBackLinks.backLinks.forEach( (backLink: BackLink) => {
          this._backLinkService.delete(backLink._id).subscribe( () => {
            this.deletedTotalBackLinks++;
            if (responseBackLinks.backLinks.length === this.deletedTotalBackLinks) {
              this.backLinksFinished = true;
            }
          });
        });
      } else {
        this.backLinksFinished = true;
      }
    });

    // Concurrent
    this.deletingConcurrence = true;
    this.concurrenceFinished = false;
    this._concurrentService.loadConcurrence(this.website._id).subscribe( (responseConcurrence: any) => {
      if (responseConcurrence.count > 0) {
        this.deletedTotalConcurrence = 0;
        responseConcurrence.concurrence.forEach( (concurrent: Concurrent) => {
          this._concurrentService.delete(concurrent._id).subscribe( () => {
            this.deletedTotalConcurrence++;
            if (responseConcurrence.count === this.deletedTotalConcurrence) {
              this.concurrenceFinished = true;
            }
          });
        } );
      } else {
        this.deletingConcurrence = false;
        this.concurrenceFinished = true;
      }
    });

    // Users
    this.deletingUsers = true;
    this.deletedTotalUsers = 0;
    this.users.forEach( (relation: any) => {
      this._websiteService.deleteRel(relation._id).subscribe( () => {
        this.deletedTotalUsers++;
        if (this.users.length === this.deletedTotalUsers) {
          this.usersFinished = true;
        }
      });
    });

    // Networks
    this.deletingNetworks = true;
    this.networksFinished = false;
    this._networkService.deleteRel(this.websiteNetworks, this.website._id ).subscribe( () => {
      this.deletedTotalNetworks = this.websiteNetworks.length;
      this.networksFinished = true;
    });

    // City
    this.deletingCity = true;
    this.cityFinished = false;
    this._cityService.deleteRel(this.relCity).subscribe( () => {
      this.cityFinished = true;
    });

    // Website
    this._websiteService.delete(this.website._id).subscribe( () => {
      this.verifyDeleted().then( () => {
        this.allFinished = true;
        const finalInter = setInterval(() => {
          this.finalCounter--;
          if (this.finalCounter === 0) {
            clearInterval(finalInter);
            this.router.navigate(['/dashboard']);
          }
        }, 1000);
      });
    });

   }

   verifyDeleted() {
    return new Promise( (resolve, reject) => {
      const interval = setInterval( () => {
        if ( this.keywordsFinished && this.analyzeFinished && this.onsiteFinished && this.offsiteFinished && this.pagesFinished && this.semanticFinished && this.technicalFinished && this.backLinksFinished && this.concurrenceFinished && this.usersFinished && this.networksFinished ) {
          resolve(true);
          clearInterval(interval);
        }
      }, 10);
    });
  }

}
