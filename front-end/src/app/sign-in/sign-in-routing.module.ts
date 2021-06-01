import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInPage } from './sign-in.page';
import {SignUpPage} from "../sign-up/sign-up.page";

const routes: Routes = [
  {
    path: '',
    component: SignInPage
  },
  {
    path: 'sign-up',
    component: SignUpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignInPageRoutingModule {}
