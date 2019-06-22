import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'app-confirmar-cierre-mesa',
  templateUrl: './confirmar-cierre-mesa.page.html',
  styleUrls: ['./confirmar-cierre-mesa.page.scss'],
})
export class ConfirmarCierreMesaPage implements OnInit {

  pedidoEnLocal: any = null;
  pedidoDetalle: any[] = [];
  hayPedidoEnLocal: boolean = false;
  pedidoAceptado: any ;
  pedidos: any; 
  spinner: boolean;
  mesas: any; 
  mesaAceptado: any;

  
  listIdPedidosAceptadosBar: any;

  constructor(private baseService: FirebaseService,
              private toastCtrl: ToastController) {
    this.traerPedidos();
  }

  ngOnInit() {
  }

  traerPedidos() {
    // this.pedidosMostrarBar = [] ; 

    this.spinner = true;

    this.baseService.getItems('pedidos').then(ped => {
  
      this.pedidos = ped;
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "entregado" );
      this.listIdPedidosAceptadosBar =  this.pedidos;
        
      this.spinner = false;
    });
    
  }


  cerrarMesa(pedido) {
    // ARMO STRINGS Y TRAIGO MESAS Y PEDIDOS
    this.baseService.getItems('mesas').then(mesas => {
      
      this.mesas = mesas;
      console.log("mesas get: ", mesas);
      this.mesas = this.mesas.filter( listMesa => listMesa.nromesa == pedido.mesa );
      this.mesaAceptado =  this.mesas[0];
      console.log("mesas Aceptado: ", this.mesaAceptado);
      let mesasKey = this.mesaAceptado.key ;
  
      console.log("mesas key: ", mesasKey) ;
      
      delete this.mesaAceptado['key'];
      this.mesaAceptado.cliente = '';
      this.mesaAceptado.estado = 'libre';
      this.baseService.updateItem('mesas', mesasKey , this.mesaAceptado);
      this.traerPedidos();

      this.spinner = false;
    });

    this.baseService.getItems('pedidos').then(ped => {
  
      this.pedidos = ped;
      console.log("Pedidos get: ", this.pedidos);
      this.pedidos = this.pedidos.filter( listPedido => listPedido.id == pedido.id );
      this.pedidoAceptado =  this.pedidos[0];
      console.log("Pedido Aceptado: ", this.pedidoAceptado);
      let pedidoKey = pedido.key ;
  
      console.log("Pedido key: ", pedidoKey) ;
      
      delete this.pedidoAceptado['key'];
      this.pedidoAceptado.estado = 'finalizado';
      this.baseService.updateItem('pedidos', pedidoKey , this.pedidoAceptado);
      this.traerPedidos();

      this.spinner = false;
    });

    // LIBERAR MESA Y ACTUALIZARLE CLIENTE


      // //CERRAR PEDIDO
      // let key: string = this.pedidoEnLocal.key;
      // delete this.pedidoEnLocal['key'];
      // this.pedidoEnLocal.estado = 'entregado';
      // this.baseService.updateItem('pedidos', key, this.pedidoEnLocal);
    
      // this.presentToast();
   
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Mesa cerrada',
      color: 'success',
      showCloseButton: false,
      position: 'bottom',
      closeButtonText: 'Done',
      duration: 2000
    });
    toast.present();
  }

}
