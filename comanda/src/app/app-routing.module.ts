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
  { path: '', loadChildren: './confirmar-cierre-mesa/confirmar-cierre-mesa.module#ConfirmarCierreMesaPageModule' }
,
  {
    path: '', 
    loadChildren: './abm-empleados/abm-empleados.module#AbmEmpleadosPageModule'
  },
  { path: '', loadChildren: './abm-cliente-anonimo/abm-cliente-anonimo.module#AbmClienteAnonimoPageModule' },
  { path: '', loadChildren: './est-empleado/est-empleado.module#EstEmpleadoPageModule' },
  { path: '', loadChildren: './list-pedidos-bartender/list-pedidos-bartender.module#ListPedidosBartenderPageModule' }
,
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
  { path: '', loadChildren: './encuesta-cliente/encuesta-cliente.module#EncuestaClientePageModule' },
  { path: 'encuesta-cliente', loadChildren: './encuesta-cliente/encuesta-cliente.module#EncuestaClientePageModule' },
  { path: 'est-satisfaccion', loadChildren: './est-satisfaccion/est-satisfaccion.module#EstSatisfaccionPageModule' },
  { path: 'list-confirmar-cliente-alta', loadChildren: './list-confirmar-cliente-alta/list-confirmar-cliente-alta.module#ListConfirmarClienteAltaPageModule' },
  { path: 'encuesta-sup', loadChildren: './encuesta-sup/encuesta-sup.module#EncuestaSupPageModule' },
  { path: 'qr-mesa', loadChildren: './qr-mesa/qr-mesa.module#QrMesaPageModule' },
  { path: 'encuesta-empleado', loadChildren: './encuesta-empleado/encuesta-empleado.module#EncuestaEmpleadoPageModule' },
  { path: 'est-empleado', loadChildren: './est-empleado/est-empleado.module#EstEmpleadoPageModule' },
  { path: 'est-supervisor', loadChildren: './est-supervisor/est-supervisor.module#EstSupervisorPageModule' },
  { path: 'qr-ingreso-local', loadChildren: './qr-ingreso-local/qr-ingreso-local.module#QrIngresoLocalPageModule' },
  { path: 'list-confirmar-cliente-mesa', loadChildren: './list-confirmar-cliente-mesa/list-confirmar-cliente-mesa.module#ListConfirmarClienteMesaPageModule' },
  { path: 'qr-propina', loadChildren: './qr-propina/qr-propina.module#QrPropinaPageModule' },
  { path: 'generar-pedido', loadChildren: './generar-pedido/generar-pedido.module#GenerarPedidoPageModule' },
  { path: 'list-confirmar-pedido', loadChildren: './list-confirmar-pedido/list-confirmar-pedido.module#ListConfirmarPedidoPageModule' },
  { path: 'abm-cliente-anonimo', loadChildren: './abm-cliente-anonimo/abm-cliente-anonimo.module#AbmClienteAnonimoPageModule' },
  { path: 'reservas', loadChildren: './reservas/reservas.module#ReservasPageModule' },
  { path: 'list-pedidos-cocina', loadChildren: './list-pedidos-cocina/list-pedidos-cocina.module#ListPedidosCocinaPageModule' },
  { path: 'list-pedidos-bartender', loadChildren: './list-pedidos-bartender/list-pedidos-bartender.module#ListPedidosBartenderPageModule' },
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },
  { path: 'pedir-delivery', loadChildren: './pedir-delivery/pedir-delivery.module#PedirDeliveryPageModule' },
  { path: 'list-confirmar-delivery', loadChildren: './list-confirmar-delivery/list-confirmar-delivery.module#ListConfirmarDeliveryPageModule' },
  { path: 'confirmar-entrega', loadChildren: './confirmar-entrega/confirmar-entrega.module#ConfirmarEntregaPageModule' },
  { path: 'confirmar-cierre-mesa', loadChildren: './confirmar-cierre-mesa/confirmar-cierre-mesa.module#ConfirmarCierreMesaPageModule' },  { path: 'list-reserva-conf', loadChildren: './list-reserva-conf/list-reserva-conf.module#ListReservaConfPageModule' }









];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
