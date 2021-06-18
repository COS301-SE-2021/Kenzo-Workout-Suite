import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInPage } from './sign-in.page';
import {SignUpPage} from "../sign-up/sign-up.page";
import {YourWorkoutsPage} from "../your-workouts/your-workouts.page";

const routes: Routes = [
  {
    path: '',
    component: SignInPage
  },
  {
    path: 'sign-up',
    component: SignUpPage
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
export class SignInPageRoutingModule {}
