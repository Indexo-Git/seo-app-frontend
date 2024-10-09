import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserService } from '../../services/service.index';

// Interfaces
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: []
})
export class SignupComponent implements OnInit {

  public form: FormGroup;

  public disabled = false;

  public checkingMail = false;

  constructor( public toasterService: ToasterService,
               private router: Router,
               private userService: UserService) {}

  ngOnInit() {
    this.form = new FormGroup({
      'name' : new FormControl({ value : '', disabled: this.disabled }, [ Validators.required, Validators.minLength(2) ]),
      'email' : new FormControl({ value : '', disabled: this.disabled }, [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'password' : new FormControl({ value : '', disabled: this.disabled }, [ Validators.required, Validators.minLength(6) ]),
      'confirm' : new FormControl({ value : '', disabled: this.disabled }, [Validators.required])
    }, { validators: this.areEqual( 'password', 'confirm')});
  }

  register() {
    if (this.form.valid) {
      const user = new User(
        this.form.value.name,
        this.form.value.email,
        this.form.value.password
      );
      this.userService.create( user ).subscribe( () => {
        this.router.navigate(['/login']);
      });
    } else {
      console.log('Hackerman...');
    }

  }

  // Validations

  isEqual( control: FormControl ): any {
    const form: any = this;

    if ( control.value !== form.controls['password'].value ) {
      return {
        isequal: true
      };
    }

    return null;
  }

  areEqual ( one: string, two: string) {
    return ( group: FormGroup ) => {

      const password = group.controls[one].value;
      const confirm = group.controls[two].value;

      if ( password === confirm ) {
        return null;
      }
      return {
        areequal: true
      };
    };
  }

}
