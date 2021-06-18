import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateWorkoutPageRoutingModule } from './create-workout-routing.module';

import { CreateWorkoutPage } from './create-workout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateWorkoutPageRoutingModule
  ],
  declarations: [CreateWorkoutPage]
})
export class CreateWorkoutPageModule {}
