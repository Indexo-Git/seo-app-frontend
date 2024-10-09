// Modules
import { Routes, RouterModule } from '@angular/router';

// Components
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { MonitorankComponent } from './monitorank/monitorank.component';

const appRoutes: Routes = [
    { path: 'positions', component: MonitorankComponent },
    { path: '**', component: PagenotfoundComponent }
];

export const APP_ROUTES = RouterModule.forRoot( appRoutes , { useHash : true } );
