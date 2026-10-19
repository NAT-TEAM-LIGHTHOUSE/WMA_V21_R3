import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SsoPageRoutingModule } from './sso-routing.module';

import { SsoPage } from './sso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SsoPageRoutingModule
  ],
  declarations: [SsoPage]
})
export class SsoPageModule {}
