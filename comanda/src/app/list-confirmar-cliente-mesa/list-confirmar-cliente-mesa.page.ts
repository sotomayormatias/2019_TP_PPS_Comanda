import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
@Component({
  selector: 'app-list-confirmar-cliente-mesa',
  templateUrl: './list-confirmar-cliente-mesa.page.html',
  styleUrls: ['./list-confirmar-cliente-mesa.page.scss'],
})
export class ListConfirmarClienteMesaPage implements OnInit {


  clientes: any[];

  constructor(
    private baseService: FirebaseService,
    ) {
    this.traerPendientes();
  }

  ngOnInit() {
  }

  traerPendientes() {
    let usuarioLogueado = JSON.parse(sessionStorage.getItem("usuario")).perfil;

    if ( usuarioLogueado == "cliente") {
      this.baseService.getItems('listaEsperaClientes').then(clients => {
        this.clientes = clients;
        this.clientes = this.clientes.filter(cliente => cliente.estado == "esperandoMesa");
      });
    } else  {
      // ES MOZO
      this.baseService.getItems('listaEsperaClientes').then(clients => {
        this.clientes = clients;
        this.clientes = this.clientes.filter(cliente => cliente.estado == "confirmacionMozo");
      });
    }

    
  }

  // confirmarCliente(correo: string) {
  //   let clienteConfirmado: any = this.clientes.find(cliente => cliente.correo == correo);
  //   let key: string = clienteConfirmado.key;
  //   delete clienteConfirmado['key'];
  //   clienteConfirmado.estado = 'confirmado';
  //   this.baseService.updateItem('clientes', key, clienteConfirmado);
  //   this.baseService.addItem('usuarios', { 'clave': clienteConfirmado.clave, 'correo': correo, 'perfil': 'cliente' });
  //   this.traerPendientes();
  // }

}
