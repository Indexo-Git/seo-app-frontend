import { Component, OnInit } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'seo-xtreme';

  public toasterConfig: any;
  public toasterconfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-bottom-center',
    showCloseButton: true,
    timeout: 1000
  });

  ngOnInit(): void {}
}
