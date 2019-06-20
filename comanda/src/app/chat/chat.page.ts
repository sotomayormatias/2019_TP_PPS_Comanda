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
  chats: {texto: string, usuario: string, hora: string, key: string }[] = [];

  constructor(private baseService: FirebaseService) {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.traerChats();
  }

  ngOnInit() {
  }

  traerChats() {
    this.baseService.getItems('chat').then(chat => {
      this.chats = chat;
    });
  }

  doSend(){
    let hora_fecha = (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString();
    this.baseService.addItem('chat', {texto: this.inputText, usuario: this.usuario.correo, hora: hora_fecha});
    this.inputText = "";
    this.traerChats();
  }
}
