import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperPage } from './super.page';

const routes: Routes = [
  {
    path: '',
    component: SuperPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperPageRoutingModule {}
