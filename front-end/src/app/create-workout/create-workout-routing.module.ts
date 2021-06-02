import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateWorkoutPage } from './create-workout.page';
import {YourWorkoutsPage} from "../your-workouts/your-workouts.page";

const routes: Routes = [
  {
    path: '',
    component: CreateWorkoutPage
  },
  {
    path: 'your-workouts',
    component: YourWorkoutsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateWorkoutPageRoutingModule {}
