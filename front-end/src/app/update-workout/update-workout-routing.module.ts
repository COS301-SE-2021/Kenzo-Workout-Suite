import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateWorkoutPage } from './update-workout.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateWorkoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateWorkoutPageRoutingModule {}
