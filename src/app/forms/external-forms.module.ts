import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { NewNetworkComponent } from './new-network/new-network.component';
import { NetworksComponent } from './networks/networks.component';
import { NewPageComponent } from './new-page/new-page.component';

@NgModule({
  declarations: [
    NewNetworkComponent,
    NetworksComponent,
    NewPageComponent,
  ],
  exports: [
    NewNetworkComponent,
    NetworksComponent,
    NewPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ExternalFormsModule { }
