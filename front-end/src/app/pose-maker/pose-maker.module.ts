import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoseMakerPageRoutingModule } from './pose-maker-routing.module';

import { PoseMakerPage } from './pose-maker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoseMakerPageRoutingModule
  ],
  declarations: [PoseMakerPage]
})
export class PoseMakerPageModule {}
