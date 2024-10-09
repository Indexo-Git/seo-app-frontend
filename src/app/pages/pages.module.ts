// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PipesModule } from '../pipes/pipes.module';
import { ExternalFormsModule } from '../forms/external-forms.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ChartistModule } from 'ng-chartist';
import { ModulesModule } from '../modules/modules.module';

// Components
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddWebsiteComponent } from './add-website/add-website.component';
import { ProfileComponent } from './profile/profile.component';
import { BasicSeoComponent } from './basic-seo/basic-seo.component';
import { StrategyComponent } from './strategy/strategy.component';
import { TrackingComponent } from './tracking/tracking.component';
import { WebsiteComponent } from './website/website.component';
import { NetworksComponent } from './networks/networks.component';
import { NetlinkingComponent } from './netlinking/netlinking.component';
import { TechnicalComponent } from './technical/technical.component';
import { OnPageComponent } from './on-page/on-page.component';
import { OtherComponent } from './other/other.component';

// Routes
import { PAGES_ROUTES } from './pages.routes';
import { CostsComponent } from './costs/costs.component';
import { GlobalComponent } from './global/global.component';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    AddWebsiteComponent,
    ProfileComponent,
    BasicSeoComponent,
    StrategyComponent,
    TrackingComponent,
    WebsiteComponent,
    NetworksComponent,
    NetlinkingComponent,
    TechnicalComponent,
    OnPageComponent,
    OtherComponent,
    CostsComponent,
    GlobalComponent
  ],
  exports: [
    DashboardComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ModulesModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ExternalFormsModule,
    PipesModule,
    DragDropModule,
    ScrollingModule,
    CKEditorModule,
    SweetAlert2Module,
    ChartistModule,
    PAGES_ROUTES
  ]
})
export class PagesModule { }
