import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public usuario: any;
  public inputText: string;
  public esClienteConPedido: boolean = false;
  public esDeliveryBoy: boolean = false;
  chats: { texto: string, usuario: string, hora: string, key: string }[] = [];

  constructor(private baseService: FirebaseService) {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.esDeliveryBoy = this.usuario.perfil == 'delivery';
    this.baseService.getItems('pedidosDelivery').then(pedidos => {
      let hayPedido: boolean = false;
      if (pedidos.find(pedido => pedido.cliente == this.usuario.correo && pedido.estado == 'entrega')) {
        hayPedido = pedidos.filter(pedido => pedido.cliente == this.usuario.correo && pedido.estado == 'entrega').length > 0;
      }
      this.esClienteConPedido = this.usuario.perfil == 'cliente' && hayPedido;
      this.traerChats();
    });
  }

  ngOnInit() {
  }

  traerChats() {
    this.baseService.getItems('chat').then(chat => {
      this.chats = chat;
    });
  }

  doSend() {
    let hora_fecha = (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString();
    this.baseService.addItem('chat', { texto: this.inputText, usuario: this.usuario.correo, hora: hora_fecha });
    this.inputText = "";
    this.traerChats();
  }
}
