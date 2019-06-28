import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoDescuentoPage } from './juego-descuento.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoDescuentoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoDescuentoPage]
})
export class JuegoDescuentoPageModule {}
