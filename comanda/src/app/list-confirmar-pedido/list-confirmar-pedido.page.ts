import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: 'app-list-confirmar-pedido',
  templateUrl: './list-confirmar-pedido.page.html',
  styleUrls: ['./list-confirmar-pedido.page.scss'],
})
export class ListConfirmarPedidoPage implements OnInit {
  pedidos: any;

  constructor(private baseService: FirebaseService) { 
    this.traerPedidosAConfirmar();
  }

  ngOnInit() {
  }

  traerPedidosAConfirmar() {
    this.baseService.getItems('pedidos').then(ped => {
      this.pedidos = ped
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "creado");
    });
  }

  aceptarPedido(mesa: string) {
    let pedidoAceptado: any = this.pedidos.find(pedido => pedido.mesa == mesa);
    let key: string = pedidoAceptado.key;
    delete pedidoAceptado['key'];
    pedidoAceptado.estado = 'aceptado';
    this.baseService.updateItem('pedidos', key, pedidoAceptado);
    this.traerPedidosAConfirmar();
  }
}
