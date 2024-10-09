import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// Services
import { UserService } from '../services/service.index';

@Injectable({
  providedIn: 'root'
})
export class UserLoggedGuard implements CanActivate {

  constructor( public userService: UserService, public router: Router ) {}

  canActivate() {
    console.log('user logged guard');
    if (!this.userService.isLogged()) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
