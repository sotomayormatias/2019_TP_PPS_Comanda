import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'app-list-confirmar-cliente-alta',
  templateUrl: './list-confirmar-cliente-alta.page.html',
  styleUrls: ['./list-confirmar-cliente-alta.page.scss'],
})
export class ListConfirmarClienteAltaPage implements OnInit {

  clientes: any[];
  hayClientes: boolean = true;

  constructor(
    private baseService: FirebaseService,
    private sendEmail: EmailComposer,
    private toastCtrl: ToastController) {
    this.traerClientesPendientes();
  }

  ngOnInit() {
  }

  traerClientesPendientes() {
    this.baseService.getItems('clientes').then(clients => {
      this.clientes = clients
      this.clientes = this.clientes.filter(cliente => cliente.estado == "pendiente");
      this.hayClientes = this.clientes.length > 0;
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
    this.presentToast('Cliente confirmado');
  }

  rechazarCliente(correo: string) {
    let clienteRechazado: any = this.clientes.find(cliente => cliente.correo == correo);
    let key: string = clienteRechazado.key;
    this.baseService.removeItem('clientes', key);
    this.traerClientesPendientes();
    this.presentToast('Cliente rechazado');
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
      this.clientes = [];
      this.hayClientes = true;
      this.traerClientesPendientes();
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
