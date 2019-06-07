import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListConfirmarClienteAltaPage } from './list-confirmar-cliente-alta.page';

const routes: Routes = [
  {
    path: '',
    component: ListConfirmarClienteAltaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListConfirmarClienteAltaPage]
})
export class ListConfirmarClienteAltaPageModule {}
