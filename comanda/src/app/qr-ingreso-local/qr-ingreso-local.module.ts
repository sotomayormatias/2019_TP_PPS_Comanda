import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QrIngresoLocalPage } from './qr-ingreso-local.page';

const routes: Routes = [
  {
    path: '',
    component: QrIngresoLocalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QrIngresoLocalPage]
})
export class QrIngresoLocalPageModule {}
