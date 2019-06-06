import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: '',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  {
    path: '',
    loadChildren: './list/list.module#ListPageModule'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },

  {
    path: 'abm-producto', 
    loadChildren: './abm-producto/abm-producto.module#AbmProductoPageModule'
  },
  {
    path: 'abm-mesas', 
    loadChildren: './abm-mesa/abm-mesa.module#AbmMesaPageModule'
  },
  {
    path: '', 
    loadChildren: './abm-mesa/abm-mesa.module#AbmMesaPageModule'
  },
  {
    path: '', 
    loadChildren: './abm-producto/abm-producto.module#AbmProductoPageModule'
  },
  {
    path: '', 
    loadChildren: './abm-empleados/abm-empleados.module#AbmEmpleadosPageModule'
  },
  {
    path: '',
    loadChildren: './login/login.module#LoginPageModule'
  },
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },
  { path: 'tab1', loadChildren: './tab1/tab1.module#Tab1PageModule' },
  { path: 'tab2', loadChildren: './tab2/tab2.module#Tab2PageModule' },
  { path: 'first-with-tabs', loadChildren: './first-with-tabs/first-with-tabs.module#FirstWithTabsPageModule' },
  { path: 'abm-empleados', loadChildren: './abm-empleados/abm-empleados.module#AbmEmpleadosPageModule' },
  { path: 'abm-cliente', loadChildren: './abm-cliente/abm-cliente.module#AbmClientePageModule' },
  { path: '', loadChildren: './abm-cliente/abm-cliente.module#AbmClientePageModule' },
  { path: '', loadChildren: './abm-duesup/abm-duesup.module#AbmDuesupPageModule' },
  { path: 'abm-duesup', loadChildren: './abm-duesup/abm-duesup.module#AbmDuesupPageModule' },
  { path: 'abm-mesa', loadChildren: './abm-mesa/abm-mesa.module#AbmMesaPageModule' },  { path: 'encuesta-cliente', loadChildren: './encuesta-cliente/encuesta-cliente.module#EncuestaClientePageModule' },
  { path: 'est-satisfaccion', loadChildren: './est-satisfaccion/est-satisfaccion.module#EstSatisfaccionPageModule' },
  { path: 'encuesta-sup', loadChildren: './encuesta-sup/encuesta-sup.module#EncuestaSupPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
