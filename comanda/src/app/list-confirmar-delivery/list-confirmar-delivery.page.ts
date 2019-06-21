import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: 'app-list-confirmar-delivery',
  templateUrl: './list-confirmar-delivery.page.html',
  styleUrls: ['./list-confirmar-delivery.page.scss'],
})
export class ListConfirmarDeliveryPage implements OnInit {
  pedidosAConfirmar: any;
  pedidosAEntregar: any;
  perfil: string = "";

  constructor(private baseService: FirebaseService) {
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
      this.pedidosAConfirmar = ped
      this.pedidosAConfirmar = this.pedidosAConfirmar.filter(pedido => pedido.estado == "creado");
    });
  }

  traerPedidosAEntregar() {
    this.baseService.getItems('pedidosDelivery').then(ped => {
      this.pedidosAEntregar = ped
      this.pedidosAEntregar = this.pedidosAEntregar.filter(pedido => pedido.estado == "entrega");
    });
  }

  confirmarPedido(cliente: string) {
    let pedidoAceptado: any = this.pedidosAConfirmar.find(pedido => pedido.cliente == cliente);
    let key: string = pedidoAceptado.key;
    delete pedidoAceptado['key'];
    pedidoAceptado.estado = 'confirmado';
    this.baseService.updateItem('pedidosDelivery', key, pedidoAceptado);
    this.traerPedidosAConfirmar();
  }

  verRuta() {
    alert("Funcionalidad en construccion");
  }
}
