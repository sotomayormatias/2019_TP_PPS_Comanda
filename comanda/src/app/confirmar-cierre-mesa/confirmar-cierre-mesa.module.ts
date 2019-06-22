import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfirmarCierreMesaPage } from './confirmar-cierre-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmarCierreMesaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfirmarCierreMesaPage]
})
export class ConfirmarCierreMesaPageModule {}
