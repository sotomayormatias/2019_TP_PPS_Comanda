import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ModalController, ToastController } from "@ionic/angular";
import { ModalRutaPage } from "../modal-ruta/modal-ruta.page";

@Component({
  selector: 'app-list-confirmar-delivery',
  templateUrl: './list-confirmar-delivery.page.html',
  styleUrls: ['./list-confirmar-delivery.page.scss'],
})
export class ListConfirmarDeliveryPage implements OnInit {
  pedidosAConfirmar: any;
  pedidosAEntregar: any;
  perfil: string = "";
  hayPedidosAConfirmar: boolean = true;
  hayPedidosAEntregar: boolean = true;

  constructor(private baseService: FirebaseService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController) {
    this.perfil = JSON.parse(sessionStorage.getItem('usuario')).perfil;
    if (this.perfil == 'delivery')
      this.traerPedidosAEntregar();
    else
      this.traerPedidosAConfirmar();
  }

  ngOnInit() {
  }

  traerPedidosAConfirmar() {
    this.baseService.getItems('pedidosDelivery').then(ped => {
      this.pedidosAConfirmar = ped;
      this.pedidosAConfirmar = this.pedidosAConfirmar.filter(pedido => pedido.estado == "creado");
      if (this.pedidosAConfirmar.length == 0) {
        this.hayPedidosAConfirmar = false;
      }
      console.log("prueba async dentro funcion");
    });

    console.log("prueba async dsp funcion");
  }

  traerPedidosAEntregar() {
    this.baseService.getItems('pedidosDelivery').then(ped => {
      this.pedidosAEntregar = ped
      this.pedidosAEntregar = this.pedidosAEntregar.filter(pedido => pedido.estado == "listoEntrega");
      if (this.pedidosAEntregar.length == 0) {
        this.hayPedidosAEntregar = false;
      }
    });
  }

  confirmarPedido(cliente: string) {
    let pedidoAceptado: any = this.pedidosAConfirmar.find(pedido => pedido.cliente == cliente);
    let key: string = pedidoAceptado.key;
    delete pedidoAceptado['key'];
    pedidoAceptado.estado = 'aceptado';
    this.baseService.updateItem('pedidosDelivery', key, pedidoAceptado);
    this.traerPedidosAConfirmar();
    this.presentToast('Pedido confirmado');
  }

  rechazarPedido(cliente: string) {
    let pedidoAceptado: any = this.pedidosAConfirmar.find(pedido => pedido.cliente == cliente);
    let key: string = pedidoAceptado.key;
    let idPedido: number = pedidoAceptado.id;
    this.baseService.removeItem('pedidosDelivery', key);
    this.baseService.getItems('pedidoDetalle').then(detalles => {
      detalles.forEach(det => {
        if (det.id_pedido == idPedido) {
          this.baseService.removeItem('pedidoDetalle', det.key);
        }
      });
    });
    this.traerPedidosAConfirmar();
    this.presentToast('Pedido rechazado');
  }

  async verRuta(idPedido: number) {
    const modal = await this.modalCtrl.create({
      component: ModalRutaPage,
      componentProps: {
        pedido: idPedido,
      }
    });
    return await modal.present();
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: 'success',
      showCloseButton: false,
      position: 'bottom',
      closeButtonText: 'Done',
      duration: 2000
    });
    toast.present();
  }
}
