import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { EmailComposer } from "@ionic-native/email-composer/ngx";

@Component({
  selector: 'app-list-confirmar-cliente-alta',
  templateUrl: './list-confirmar-cliente-alta.page.html',
  styleUrls: ['./list-confirmar-cliente-alta.page.scss'],
})
export class ListConfirmarClienteAltaPage implements OnInit {

  clientes: any[];

  constructor(
    private baseService: FirebaseService,
    private sendEmail: EmailComposer) {
    this.traerClientesPendientes();
  }

  ngOnInit() {
  }

  traerClientesPendientes() {
    this.baseService.getItems('clientes').then(clients => {
      this.clientes = clients
      this.clientes = this.clientes.filter(cliente => cliente.estado == "pendiente");
    });
  }

  confirmarCliente(correo: string) {
    let clienteConfirmado: any = this.clientes.find(cliente => cliente.correo == correo);
    let key: string = clienteConfirmado.key;
    delete clienteConfirmado['key'];
    clienteConfirmado.estado = 'confirmado';
    this.baseService.updateItem('clientes', key, clienteConfirmado);
    this.baseService.addItem('usuarios', { 'clave': clienteConfirmado.clave, 'correo': correo, 'perfil': 'cliente' });
    this.enviarCorreo(correo);
    this.traerClientesPendientes();
  }

  enviarCorreo(correo: string) {
    let email = {
      to: correo,
      subject: 'Comiradix - Inscripción confirmada',
      body: 'Estimado/a cliente: <br> Ha sido dado de alta satisfactoriamente en Comiradix, ya puede ingresar y disfrutar de todos los beneficios. <br><br> Saludos cordiales. <br> Gerencia de Comiradix.',
      isHtml: true
    }
    // Send a text message using default options
    this.sendEmail.open(email);
  }
}
