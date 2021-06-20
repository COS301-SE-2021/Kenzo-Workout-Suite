import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateWorkoutPageRoutingModule } from './update-workout-routing.module';

import { UpdateWorkoutPage } from './update-workout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateWorkoutPageRoutingModule
  ],
  declarations: [UpdateWorkoutPage]
})
export class UpdateWorkoutPageModule {}
