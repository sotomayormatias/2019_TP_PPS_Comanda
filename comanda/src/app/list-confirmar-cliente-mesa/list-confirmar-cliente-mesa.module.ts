import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListConfirmarClienteMesaPage } from './list-confirmar-cliente-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: ListConfirmarClienteMesaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListConfirmarClienteMesaPage]
})
export class ListConfirmarClienteMesaPageModule {}
