import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';

// Models
import { Network } from 'src/app/models/network.model';

// Services
import { NetworkService } from 'src/app/services/service.index';

declare var $: any;

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styles: [

  ]
})

export class NetworksComponent implements OnInit {

  networks: any[] = [];

  constructor( public _networkService: NetworkService) { }

  ngOnInit() {
    this.loadNetworks();
  }

  delete ( network: Network) {
    swal({
      title: 'Are you sure?',
      text: 'You won\'t be abel to recover this network',
      icon: 'warning',
      dangerMode: true,
      buttons: ['Oh noez!', true],
    }).then( () => {
      this._networkService.delete(network._id).subscribe( () => {
        this.loadNetworks();
      });
    });
  }

  loadNetworks() {
    this._networkService.loadNetworks().subscribe( (response: any) => {
      this.networks = response.networks;
    });
  }

  search( value: string) {
    if ( value.length <= 0 || value === '' ) {
      this.loadNetworks();
      return;
    }

    this._networkService.search(value).subscribe((response: any) => {
      console.log(response);
      this.networks = response.networks;
    });
  }

}
