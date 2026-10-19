import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SsoPage } from './sso.page';

const routes: Routes = [
  {
    path: '',
    component: SsoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SsoPageRoutingModule {}
