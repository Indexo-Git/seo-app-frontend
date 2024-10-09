// Modules
import { Routes, RouterModule } from '@angular/router';

// Components
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { NetlinkingComponent } from './netlinking/netlinking.component';
import { BasicSeoComponent } from './basic-seo/basic-seo.component';
import { StrategyComponent } from './strategy/strategy.component';
import { WebsiteComponent } from './website/website.component';
import { TrackingComponent } from './tracking/tracking.component';
import { NetworksComponent } from './networks/networks.component';
import { TechnicalComponent } from './technical/technical.component';
import { OnPageComponent } from './on-page/on-page.component';
import { OtherComponent } from './other/other.component';
import { GlobalComponent } from './global/global.component';

// Guard
import { LoginGuard, VerifyTokenGuard } from '../guards/guards.index';
import { AddWebsiteComponent } from './add-website/add-website.component';
import { CostsComponent } from './costs/costs.component';

const pageRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [LoginGuard, VerifyTokenGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard'} },
            { path: 'new-website', component: AddWebsiteComponent, data: { title: 'New website'} },
            { path: 'profile', component: ProfileComponent, data: { title: 'Profile'} },
            { path: 'netlinking/:id', component: NetlinkingComponent, data: { title: 'Netlinking'} },
            { path: 'basic-seo/:id', component: BasicSeoComponent, data: { title: 'Basic SEO'} },
            { path: 'strategy/:id', component: StrategyComponent, data: { title: 'Strategy'} },
            { path: 'tracking/:id', component: TrackingComponent, data: { title: 'Strategy tracking'} },
            { path: 'website/:id', component: WebsiteComponent, data: { title: 'Website management'} },
            { path: 'technical/:id', component: TechnicalComponent, data: { title: 'Technical tasks'} },
            { path: 'on-page/:id', component: OnPageComponent, data: { title: 'On page optimizations'} },
            { path: 'other/:id', component: OtherComponent, data: { title: 'Other tasks'} },
            { path: 'networks', component: NetworksComponent, data: { title: 'Networks management'} },
            { path: 'costs/:id', component: CostsComponent, data: { title: 'Website Costs'} },
            { path: 'global', component: GlobalComponent, data: { title: 'Global Tasks View'}},
            { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild( pageRoutes );
