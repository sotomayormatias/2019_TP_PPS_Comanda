import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'app-list-confirmar-cliente-mesa',
  templateUrl: './list-confirmar-cliente-mesa.page.html',
  styleUrls: ['./list-confirmar-cliente-mesa.page.scss'],
})
export class ListConfirmarClienteMesaPage implements OnInit {

  esMozo: any = false;
  clientes: any[];
  hayCliente: boolean = true;

  constructor(
    private baseService: FirebaseService,
    private router: Router,
    private toastCtrl: ToastController
    ) {
    this.traerPendientes();
  }

  ngOnInit() {
  }

  traerPendientes() {
    let usuarioLogueado = JSON.parse(sessionStorage.getItem("usuario")).perfil;

    if ( usuarioLogueado == "cliente") {
      // this.esMozo = false;
      this.baseService.getItems('listaEsperaClientes').then(clients => {
        this.clientes = clients;
        this.clientes = this.clientes.filter(cliente => cliente.estado == "confirmacionMozo");
        this.hayCliente = this.clientes.length > 0;
      });
     
    } else  {
      // ES MOZO
      this.esMozo = true;
      this.baseService.getItems('listaEsperaClientes').then(clients => {
        this.clientes = clients;
        this.clientes = this.clientes.filter(cliente => cliente.estado == "confirmacionMozo");
        this.hayCliente = this.clientes.length > 0;
      });
    }

    
  }

  confirmarCliente(correo: string) {
    let clienteConfirmado: any = this.clientes.find(cliente => cliente.correo == correo);
    let key: string = clienteConfirmado.key;
    delete clienteConfirmado['key'];
    clienteConfirmado.estado = 'esperandoMesa';
    this.baseService.updateItem('listaEsperaClientes', key, clienteConfirmado);
    // this.baseService.addItem('listaEsperaClientes', { 'clave': clienteConfirmado.clave, 'correo': correo, 'perfil': 'cliente' });
    // let datos: any = { 'correo': clienteConfirmado.correo, 'perfil': clienteConfirmado.perfil, 'key': clienteConfirmado.key, 'estado': "esperandoMesa" };
    
    this.traerPendientes();
    this.presentToast('Cliente confirmado');
    // this.router.navigateByUrl('/list-confirmar-cliente-mesa');
  }

  rechazarCliente(correo: string) {
    let clienteRechazado: any = this.clientes.find(cliente => cliente.correo == correo);
    let key: string = clienteRechazado.key;
    this.baseService.removeItem('listaEsperaClientes', key);
    this.traerPendientes();
    this.presentToast('Cliente rechazado');
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
}
