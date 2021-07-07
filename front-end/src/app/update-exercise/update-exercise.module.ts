import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateExercisePageRoutingModule } from './update-exercise-routing.module';

import { UpdateExercisePage } from './update-exercise.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateExercisePageRoutingModule
  ],
  declarations: [UpdateExercisePage]
})
export class UpdateExercisePageModule {}
