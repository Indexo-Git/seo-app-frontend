import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any = [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      url: '/dashboard'
    },
    {
      title: 'Networks',
      icon: 'mdi-network',
      url: '/networks'
    },
    {
      title: 'Global strategy',
      icon: 'mdi-web',
      url: '/global'
    }
  ];

  constructor() { }
}
