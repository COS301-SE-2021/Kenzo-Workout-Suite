import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourWorkoutsPage } from './your-workouts.page';
import { CreateWorkoutPage} from '../create-workout/create-workout.page'

const routes: Routes = [
  {
    path: '',
    component: YourWorkoutsPage
  },
  {
    path: 'create-workout',
    component: CreateWorkoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YourWorkoutsPageRoutingModule {}
