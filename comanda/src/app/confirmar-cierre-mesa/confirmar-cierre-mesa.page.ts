import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'app-confirmar-cierre-mesa',
  templateUrl: './confirmar-cierre-mesa.page.html',
  styleUrls: ['./confirmar-cierre-mesa.page.scss'],
})
export class ConfirmarCierreMesaPage implements OnInit {
  pedidoAceptado: any;
  pedidos: any[] = [];
  spinner: boolean;
  // mesas: any[] = [];
  mesaAceptado: any;
  hayPedidosACerrar: boolean = false;

  constructor(private baseService: FirebaseService,
    private toastCtrl: ToastController) {
    this.traerPedidos();
  }

  ngOnInit() {
  }

  traerPedidos() {
    this.spinner = true;
    this.baseService.getItems('pedidos').then(ped => {
      this.pedidos = ped;
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "entregado");
      this.hayPedidosACerrar = this.pedidos.length > 0;
      this.spinner = false;
    });
  }

  cerrarMesa(pedido) {
    // ARMO STRINGS Y TRAIGO MESAS Y PEDIDOS
    this.baseService.getItems('mesas').then(mesas => {
      this.mesaAceptado = mesas.find(listMesa => listMesa.nromesa == pedido.mesa);

      let mesaKey = this.mesaAceptado.key;
      delete this.mesaAceptado['key'];
      this.mesaAceptado.cliente = '';
      this.mesaAceptado.estado = 'libre';
      this.baseService.updateItem('mesas', mesaKey, this.mesaAceptado);

      this.baseService.getItems('pedidos').then(ped => {
        this.pedidoAceptado = ped.find(listPedido => listPedido.id == pedido.id);

        let pedidoKey = pedido.key;
        delete this.pedidoAceptado['key'];
        this.pedidoAceptado.estado = 'finalizado';
        this.baseService.updateItem('pedidos', pedidoKey, this.pedidoAceptado);

        this.presentToast();
        this.traerPedidos();
        this.spinner = false;
      });
    });
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

  ionRefresh(event) {
    setTimeout(() => {
      event.target.complete();
      this.pedidos = [];
      this.hayPedidosACerrar = false;
      this.traerPedidos();
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
