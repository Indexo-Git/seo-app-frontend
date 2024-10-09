// Modules
import { Routes, RouterModule } from '@angular/router';

// Components
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

// Guard
import { UserLoggedGuard } from '../guards/guards.index';

const authRoutes: Routes = [
    {
        path: '',
        component: AuthenticationComponent,
        // canActivate: [UserLoggedGuard],
        children: [
            { path: 'login', component: LoginComponent },
            // { path: 'signup', component: SignupComponent },

            { path: '', pathMatch: 'full', redirectTo: '/login' }
        ]
    }
];

export const AUTH_ROUTES = RouterModule.forChild( authRoutes );
