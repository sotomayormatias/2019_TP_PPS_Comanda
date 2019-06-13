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
  { path: '', loadChildren: './list-confirmar-cliente-mesa/list-confirmar-cliente-mesa.module#ListConfirmarClienteMesaPageModule' }
  ,
  {
    path: '', 
    loadChildren: './abm-mesa/abm-mesa.module#AbmMesaPageModule'
  },
  { path: '', loadChildren: './encuesta-empleado/encuesta-empleado.module#EncuestaEmpleadoPageModule' },
  {
    path: '', 
    loadChildren: './abm-producto/abm-producto.module#AbmProductoPageModule'
  },
  {
    path: '', 
    loadChildren: './abm-empleados/abm-empleados.module#AbmEmpleadosPageModule'
  },
  { path: '', loadChildren: './est-empleado/est-empleado.module#EstEmpleadoPageModule' },
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
  { path: 'abm-mesa', loadChildren: './abm-mesa/abm-mesa.module#AbmMesaPageModule' },
  { path: 'encuesta-cliente', loadChildren: './encuesta-cliente/encuesta-cliente.module#EncuestaClientePageModule' },
  { path: 'est-satisfaccion', loadChildren: './est-satisfaccion/est-satisfaccion.module#EstSatisfaccionPageModule' },
  { path: 'list-confirmar-cliente-alta', loadChildren: './list-confirmar-cliente-alta/list-confirmar-cliente-alta.module#ListConfirmarClienteAltaPageModule' },
  { path: 'encuesta-sup', loadChildren: './encuesta-sup/encuesta-sup.module#EncuestaSupPageModule' },
  { path: 'qr-mesa', loadChildren: './qr-mesa/qr-mesa.module#QrMesaPageModule' },
  { path: 'encuesta-empleado', loadChildren: './encuesta-empleado/encuesta-empleado.module#EncuestaEmpleadoPageModule' },
  { path: 'modal-page', loadChildren: './modal-page/modal-page.module#ModalPagePageModule' },
  { path: 'est-empleado', loadChildren: './est-empleado/est-empleado.module#EstEmpleadoPageModule' },
  { path: 'est-supervisor', loadChildren: './est-supervisor/est-supervisor.module#EstSupervisorPageModule' },
  { path: 'qr-ingreso-local', loadChildren: './qr-ingreso-local/qr-ingreso-local.module#QrIngresoLocalPageModule' },
  { path: 'list-confirmar-cliente-mesa', loadChildren: './list-confirmar-cliente-mesa/list-confirmar-cliente-mesa.module#ListConfirmarClienteMesaPageModule' }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
