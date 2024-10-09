import { Component, OnInit } from '@angular/core';

// Services
import { SidebarService, UserService } from '../../services/service.index';

// Models
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  user: User;

  constructor(public _sidebarService: SidebarService,
              public _userService: UserService) { }

  ngOnInit() {
    this.user = this._userService.user;
  }

}
