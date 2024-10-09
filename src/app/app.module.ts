// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationModule } from './authentication/authentication.module';
import { PagesModule } from './pages/pages.module';
import { ServicesModule } from './services/services.module';
import { ToasterModule } from 'angular2-toaster';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ChartistModule } from 'ng-chartist';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { NotificationsComponent } from './shared/notifications/notifications.component';
import { ValidationsComponent } from './shared/validations/validations.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { MonitorankComponent } from './monitorank/monitorank.component';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { InterceptorService } from './interceptors/interceptor.service';
// Routes
import { APP_ROUTES } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    NotificationsComponent,
    ValidationsComponent,
    PagenotfoundComponent,
    MonitorankComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthenticationModule,
    PagesModule,
    ServicesModule,
    ToasterModule,
    SweetAlert2Module.forRoot(),
    ChartistModule,
    HttpClientModule,
    APP_ROUTES
  ],
  exports: [
    LoaderComponent,
    NotificationsComponent,
    ValidationsComponent
  ],
  providers: [
    ToasterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
