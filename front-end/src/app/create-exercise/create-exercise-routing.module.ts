import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateExercisePage } from './create-exercise.page';

const routes: Routes = [
  {
    path: '',
    component: CreateExercisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateExercisePageRoutingModule {}
