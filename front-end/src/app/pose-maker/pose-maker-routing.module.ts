import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoseMakerPage } from './pose-maker.page';

const routes: Routes = [
  {
    path: '',
    component: PoseMakerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoseMakerPageRoutingModule {}
