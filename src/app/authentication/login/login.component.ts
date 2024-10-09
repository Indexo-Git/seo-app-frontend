import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { UserService } from '../../services/service.index';

// Models
import { User } from '../../models/user.model';

// Google API
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  // Form variable
  public form: FormGroup;
  public disabled = false;
  email: string;

  // Google sign-in variables
  auth2: any;

  constructor( private router: Router,
               public userService: UserService) {}

  ngOnInit() {

    // this.googleInit();

    this.email = localStorage.getItem('email') || '';
    this.form = new FormGroup({
      'email' : new FormControl({ value : this.email, disabled: this.disabled }, [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'password' : new FormControl({ value : '', disabled: this.disabled }, [ Validators.required ]),
      'remember' : new FormControl({ value : false, disabled: this.disabled })
    });
    if ( this.email.length > 1) {
      this.form.controls['remember'].setValue(true);
    }
  }

  login() {
    if (this.form.valid) {
      const user = new User(null, this.form.value.email, this.form.value.password);
      this.userService.login(user, this.form.value.remember).subscribe( () => this.router.navigate(['/dashboard']));
    } else {
      console.log('Hackerman...');
    }
  }

  // Google sign-in
  googleInit () {

    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '306130000799-a0r0f3b81bekrn31b77d5ntvpoj679t0.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignIn( document.getElementById('btn-google'));
    });
  }

  attachSignIn ( element: any ) {
    this.auth2.attachClickHandler( element, {}, ( googleUser ) => {

      // let profile = googleUser.getBasicProfile();

      const token = googleUser.getAuthResponse().id_token;

      this.userService.loginGoogle( token ).subscribe( () => window.location.href = '#/dashboard');

    } );
  }

}
