import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'app-list-confirmar-pedido',
  templateUrl: './list-confirmar-pedido.page.html',
  styleUrls: ['./list-confirmar-pedido.page.scss'],
})
export class ListConfirmarPedidoPage implements OnInit {
  pedidos: any[] = [];
  hayPedidos: boolean = true;

  constructor(private baseService: FirebaseService,
    private toastCtrl: ToastController) {
    this.traerPedidosAConfirmar();
  }

  ngOnInit() {
  }

  traerPedidosAConfirmar() {
    this.baseService.getItems('pedidos').then(ped => {
      this.pedidos = ped
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "creado");
      if(this.pedidos.length == 0){
        this.hayPedidos = false;
      }
    });
  }

  aceptarPedido(mesa: string) {
    let pedidoAceptado: any = this.pedidos.find(pedido => pedido.mesa == mesa);
    let key: string = pedidoAceptado.key;
    delete pedidoAceptado['key'];
    pedidoAceptado.estado = 'aceptado';
    this.baseService.updateItem('pedidos', key, pedidoAceptado);
    this.traerPedidosAConfirmar();
    this.presentToast('pedido Aceptado');
  }

  rechazarPedido(mesa: string) {
    let pedidoRechazado: any = this.pedidos.find(pedido => pedido.mesa == mesa);
    let key: string = pedidoRechazado.key;
    this.baseService.removeItem('pedidos', key);
    this.traerPedidosAConfirmar();
    this.presentToast('Pedido rechazado');
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

  ionRefresh(event) {
    setTimeout(() => {
      event.target.complete();
      this.pedidos = [];
      this.hayPedidos = true;
      this.traerPedidosAConfirmar();
    }, 2000);
  }
  ionPull(event) {
    // Emitted while the user is pulling down the content and exposing the refresher.
    // console.log('ionPull Event Triggered!');

  }
  ionStart(event) {
    // Emitted when the user begins to start pulling down.
    // console.log('ionStart Event Triggered!');
  }
}
