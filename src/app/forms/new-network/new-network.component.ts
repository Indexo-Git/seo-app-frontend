import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Models
import { Network } from 'src/app/models/network.model';

// Services
import { NetworkService } from 'src/app/services/service.index';

declare var $: any;

@Component({
  selector: 'app-new-network',
  templateUrl: './new-network.component.html',
  styles: []
})
export class NewNetworkComponent implements OnInit {

  @Output() updateNetworks: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;
  public disabled = false;

  constructor( public _networkService: NetworkService) {
    this.form = new FormGroup({
      'name' : new FormControl({ value : '', disabled: this.disabled }, [ Validators.required, Validators.minLength(2) ]),
    });
  }

  ngOnInit() {
  }

  newNetwork() {
    if (this.form.valid) {
      const network = new Network(this.form.value.name);
      this._networkService.create(network).subscribe( response => {
        this.form.reset();
        this.updateNetworks.emit(null);
        $('#new-network-modal').modal('hide');
      });
    } else {
      console.log('Wow, hackerman!');
    }
  }

  private disableForm( choice: boolean ) {
    const state = choice ? 'disable' : 'enable';

    Object.keys(this.form.controls).forEach((controlName) => {
      this.form.controls[controlName][state]();
    });
  }

}
