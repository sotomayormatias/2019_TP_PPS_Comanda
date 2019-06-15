import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-pedido',
  templateUrl: './modal-pedido.page.html',
  styleUrls: ['./modal-pedido.page.scss'],
})
export class ModalPedidoPage implements OnInit {

  @Input("pedido") pedido: any;
  pedidoDetalle: any[] = [];

  constructor(private baseService: FirebaseService,
    private modalController: ModalController) {
    this.traerPedido();
  }

  ngOnInit() {
  }

  traerPedido() {
    this.baseService.getItems('pedidoDetalle').then(ped => {
      this.pedidoDetalle = ped;
      this.pedidoDetalle = this.pedidoDetalle.filter(pedido => pedido.mesa == this.pedido);
    });
  }

  async cerrar() {
    this.modalController.dismiss();
  }
}
