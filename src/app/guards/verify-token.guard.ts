import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from 'src/app/services/service.index';

@Injectable({
  providedIn: 'root'
})
export class VerifyTokenGuard implements CanActivate {

  constructor(public _userService: UserService,
              public router: Router) {}

  canActivate(): Promise<boolean> | boolean {
    
    let token = this._userService.token;
    let payload = JSON.parse( atob( token.split('.')[1]));
    let expired = this.expired(payload.exp);

    if (expired) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verifyRenew(payload.exp);
  }

  expired( date: number) {
    const now = new Date().getTime() / 1000;

    if (date < now) {
      return true;
    }

    return false;
  }

  verifyRenew( date: number ): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      let tokenExp = new Date( date * 1000 );
      let now = new Date();

      now.setTime( now.getTime() + ( 4 * 60 * 60 * 1000));

      if (tokenExp.getTime() > now.getTime()) {
        resolve(true);
      } else {
        this._userService.renewToken().subscribe( () => {
          resolve(true);
        }, () => {
          this.router.navigate(['/login']);
          reject(false);
        });
      }
    });
  }
}
