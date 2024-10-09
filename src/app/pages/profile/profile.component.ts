import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Models
import { User } from 'src/app/models/user.model';

// Services
import { UserService } from 'src/app/services/service.index';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  user: User;
  disabled = false;
  email = false;
  uploadImage: File;
  imgTmp: string;

  public form: FormGroup;

  constructor( public _userService: UserService,
               public _toasterService: ToasterService) {
    this.user = this._userService.user;
    if ( this.user.google ) {
      this.email = true;
    }
    this.form = new FormGroup({
      'name' : new FormControl({ value : this.user.name, disabled: this.disabled }),
      'email' : new FormControl({ value : this.user.email, disabled: this.email }, [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])
    });
  }

  ngOnInit() {
  }

  save() {
    this.user.name = this.form.controls['name'].value;
    if (!this.user.google) {
      this.user.email = this.form.controls['email'].value;
    }

    this._userService.update( this.user).subscribe();
  }

  selectImage( file: File ) {
    if ( !file ) {
      this.uploadImage = null;
      return;
    }

    if (file.type.indexOf('image') < 0) {
      this._toasterService.pop('error', 'Attention!', 'The selected file isn\'t an image');
      this.uploadImage = null;
      return;
    }

    this.uploadImage = file;

    // Vanilla Javascript
    const reader = new FileReader();
    const urlImageTemp = reader.readAsDataURL(file);

    reader.onloadend = function() {
      // console.log(reader.result);
      // this.imgTmp = reader.result;
      // console.log(this.imgTmp);
    };
    /*
    .map(this.extractData.bind(this))
    or
    .map((data) => this.extractData(data))
    */
  }

  changeImage() {
    this._userService.updateImage(this.uploadImage, this.user._id);
  }

  setPreview( image: string ) {
    this.imgTmp = image;
  }

}
