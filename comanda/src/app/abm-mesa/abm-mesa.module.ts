import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AbmMesaPage } from './abm-mesa.page';

import { ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AbmMesaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AbmMesaPage]
})
export class AbmMesaPageModule {}
