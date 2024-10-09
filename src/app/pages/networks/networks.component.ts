import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Models
import { Network } from 'src/app/models/network.model';

// Services
import { NetworkService, UserService } from '../../services/service.index';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

declare var $: any;

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styles: [
    '#network-button{color: #fff;position: fixed;bottom: 5%;right: 5%;z-index: 1;}',
    'table th, table td{vertical-align: middle'
  ]
})
export class NetworksComponent implements OnInit {

  public networks: any[] = [];
  public loadingNetworks: boolean;
  public loadingWebsites: boolean;

  public formShare: FormGroup;
  public formUpdate: FormGroup;

  public usersNetwork: any[] = [];
  public selectedNetwork: string;
  public updatedNetwork: Network;

  public websites: any[] = [];

  constructor(public _networkService: NetworkService,
              public _userService: UserService,
              public _toasterService: ToasterService) {
  }

  ngOnInit() {
    this.loadNetworks();
    this.formShare = new FormGroup({
      'email' : new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] )
    });
    this.formUpdate = new FormGroup({
      'name' : new FormControl({ value : '', disabled: false }, [ Validators.required, Validators.minLength(2) ])
    });
  }

  loadNetworks() {
    this.loadingNetworks = true;
    this.networks = [];
    this._networkService.loadNetworks().subscribe( (response: any) => {
      response.networks.forEach( (network: any) => {
        this.networks.push(network.network);
      });
      this.loadingNetworks = false;
    });
  }

  getWebsites( id: string ) {
    this.loadingWebsites = true;
    this.websites = [];
    this._networkService.loadWebsiteFromNetwork(id).subscribe( (response: any) => {
      if (response.websites.length > 0) {
        response.websites.forEach( (networkWebsite: any) => {
          this.websites.push(networkWebsite.website);
        });
      }
      this.loadingWebsites = false;

    });
  }


  getUsers( id: string) {
    this.selectedNetwork = id;
    this.usersNetwork = [];
    this._networkService.loadNetworksUsers(id).subscribe( (response: any) => {
      this.usersNetwork = response.networks;
    });
  }

  share() {
    if (this.formShare.valid) {
      this._userService.getUserByEmail(this.formShare.value.email).subscribe( (response: any) => {
        if (response.user) {
          this._networkService.shareNetwork( { network: this.selectedNetwork, user: response.user._id }).subscribe( (answer) => {
            this.getUsers(this.selectedNetwork);
          });
        } else {
         this._toasterService.pop('error', 'Error!', 'This email is not registered in our system!');
        }
      });

    } else {
      console.log('Hackerman...');
    }
  }

  deleteShare(id: string) {
    this._networkService.deleteShare(id).subscribe( () => {
      this.getUsers(this.selectedNetwork);
    });
  }

  /*---------------------*/

  getNetwork( network: Network) {
    this.updatedNetwork = network;
    this.formUpdate.setValue({'name' : network.name});

  }

  update() {
    if (this.formUpdate.valid) {
      this._networkService.update(this.setNetwork(this.formUpdate.value.name)).subscribe( () => {
        this.loadNetworks();
        $('#update-modal').modal('hide');
      });
    } else {
      console.log('Hackerman...');
    }
  }

  setNetwork ( name: string) {
    return new Network ( name, this.updatedNetwork._id );
  }

  deleteNetwork( network: Network) {
    this._networkService.loadWebsiteFromNetwork(network._id).subscribe( (response: any) => {
      if (response.websites.length > 0) {
        this._toasterService.pop('error', 'Error!', 'This network is related to ' + response.websites.length + ' websites. It can\'t be deleted.');
      } else {
        this._networkService.delete( network._id) .subscribe();
      }
    });
  }

}
