import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YourWorkoutsPageRoutingModule } from './your-workouts-routing.module';

import { YourWorkoutsPage } from './your-workouts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YourWorkoutsPageRoutingModule
  ],
  declarations: [YourWorkoutsPage]
})
export class YourWorkoutsPageModule {}
