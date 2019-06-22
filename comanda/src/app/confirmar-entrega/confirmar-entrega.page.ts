import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'app-confirmar-entrega',
  templateUrl: './confirmar-entrega.page.html',
  styleUrls: ['./confirmar-entrega.page.scss'],
})
export class ConfirmarEntregaPage implements OnInit {
  pedidoEnLocal: any = null;
  pedidoDelivery: any = null;
  pedidoDetalle: any[] = [];
  hayPedidoDelivery: boolean = false;
  hayPedidoEnLocal: boolean = false;

  constructor(private baseService: FirebaseService,
    private toastCtrl: ToastController) {
    this.traerPedidos();
  }

  ngOnInit() {
  }

  traerPedidos() {
    let cliente = JSON.parse(sessionStorage.getItem('usuario')).correo;
    this.baseService.getItems('pedidos').then(ped => {
      this.pedidoEnLocal = ped.find(pedido => pedido.estado == "listoEntrega" && pedido.cliente == cliente);
      this.hayPedidoEnLocal = this.pedidoEnLocal != undefined;

      if (this.hayPedidoEnLocal)
        this.traerDetalle(this.pedidoEnLocal.id);
    });

    this.baseService.getItems('pedidosDelivery').then(ped => {
      this.pedidoDelivery = ped.find(pedido => pedido.estado == "listoEntrega" && pedido.cliente == cliente);
      this.hayPedidoDelivery = this.pedidoDelivery != undefined;

      if (this.hayPedidoDelivery)
        this.traerDetalle(this.pedidoDelivery.id);
    });
  }

  traerDetalle(idPedido: number) {
    this.baseService.getItems('pedidoDetalle').then(pedido => {
      this.pedidoDetalle = pedido.filter(producto => producto.id_pedido == idPedido);
    });
  }

  confirmarEntrega(){
    if(this.hayPedidoEnLocal){
      let key: string = this.pedidoEnLocal.key;
      delete this.pedidoEnLocal['key'];
      this.pedidoEnLocal.estado = 'entregado';
      this.baseService.updateItem('pedidos', key, this.pedidoEnLocal);
    }
    if(this.hayPedidoDelivery){
      let key: string = this.pedidoDelivery.key;
      delete this.pedidoDelivery['key'];
      this.pedidoDelivery.estado = 'cobrado';
      this.baseService.updateItem('pedidosDelivery', key, this.pedidoDelivery);
    }
    this.presentToast();
    this.traerPedidos();
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Entrega confirmada',
      color: 'success',
      showCloseButton: false,
      position: 'bottom',
      closeButtonText: 'Done',
      duration: 2000
    });
    toast.present();
  }
}
