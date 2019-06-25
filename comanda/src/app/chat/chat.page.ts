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
  chats: { texto: string, usuario: string, destino: string, hora: string }[] = [];
  public clientesConPedido: any[] = [];
  public cliente: string = "";

  constructor(private baseService: FirebaseService) {
    this.inicializarChats();
  }

  ngOnInit() {
  }

  traerChats() {
    this.baseService.getItems('chat').then(chat => {
      if (this.esClienteConPedido) {
        this.chats = chat.filter(ch => 
          (ch.usuario == this.usuario.correo && ch.destino == 'delivery@gmail.com')
          || (ch.usuario == 'delivery@gmail.com' && ch.destino == this.usuario.correo));
      } else {
        if (this.cliente != "") {
          this.chats = chat.filter(ch => 
            (ch.usuario == 'delivery@gmail.com' && ch.destino == this.cliente)
            || (ch.usuario == this.cliente && ch.destino == 'delivery@gmail.com'));
        }
      }

    });
  }

  doSend() {
    let hora_fecha = (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString();
    let chat: any;
    if (this.esClienteConPedido) {
      chat = {
        texto: this.inputText,
        usuario: this.usuario.correo,
        destino: 'delivery@gmail.com',
        hora: hora_fecha
      };
    } else {
      chat = {
        texto: this.inputText,
        usuario: this.usuario.correo,
        destino: this.cliente,
        hora: hora_fecha
      };
    }

    this.baseService.addItem('chat', chat);
    this.inputText = "";
    this.traerChats();
  }

  inicializarChats() {
    this.baseService.getItems('pedidosDelivery').then(pedidos => {
      pedidos.forEach(ped => {
        if (ped.estado == 'listoEntrega') {
          this.clientesConPedido.push(ped.cliente);
        }
      });

      this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
      this.esDeliveryBoy = this.usuario.perfil == 'delivery';

      let hayPedido: boolean = false;
      if (pedidos.find(pedido => pedido.cliente == this.usuario.correo && pedido.estado == 'listoEntrega')) {
        hayPedido = pedidos.filter(pedido => pedido.cliente == this.usuario.correo && pedido.estado == 'listoEntrega').length > 0;
      }
      this.esClienteConPedido = this.usuario.perfil == 'cliente' && hayPedido;

      if (this.esClienteConPedido) {
        this.traerChats();
      }
      console.log(this.clientesConPedido);
    });
  }

  onChangeCliente() {
    this.traerChats();
  }
}
