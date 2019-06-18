import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgCalendarModule  } from 'ionic2-calendar';

import { IonicModule } from '@ionic/angular';

import { ReservasPage } from './reservas.page';


const routes: Routes = [
  {
    path: '',
    component: ReservasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgCalendarModule,
    RouterModule.forChild(routes)
  ],
 
  declarations: [ReservasPage]
})
export class ReservasPageModule {}
