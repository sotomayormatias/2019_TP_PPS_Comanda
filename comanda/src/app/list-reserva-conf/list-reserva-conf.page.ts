import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-list-reserva-conf',
  templateUrl: './list-reserva-conf.page.html',
  styleUrls: ['./list-reserva-conf.page.scss'],
})
export class ListReservaConfPage implements OnInit {

  reservas: any[];


  constructor(  private baseService: FirebaseService) { 
    this.traerReservasPendientes();
  }

  ngOnInit() {
  }

  traerReservasPendientes() {
    this.baseService.getItems('reservademesas').then(lista => {
      this.reservas = lista
      this.reservas = this.reservas.filter(reserva => reserva.estadoConfirmacion == "pendiente");
    });
  }

  confirmarReserva(correo: string) {
    let reservaConfirmado: any = this.reservas.find(cliente => cliente.correo == correo);
    let key: string = reservaConfirmado.key;
    // delete reservaConfirmado['key'];
    reservaConfirmado.estadoConfirmacion = 'confirmado';
    this.baseService.updateItem('reservademesas', key, reservaConfirmado);
    // this.baseService.addItem('usuarios', { 'clave': clienteConfirmado.clave, 'correo': correo, 'perfil': 'cliente' });
    // this.enviarCorreo(correo);


     //TABLA MESAS
     this.guardarMesas();   


    this.traerReservasPendientes();
  }

  guardarMesas (){

  //   let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
  //   this.baseService.getItems('mesas').then(mesas => {
  //     this.mesas = mesas.find(mesaEl => mesaEl.nromesa == this.mesaSeleccionada);
    
  //     this.mesas.reservada = "si";

  //     this.baseService.updateItem('mesas', this.mesas.key , this.mesas);

    
      
    
  
  
  //   });

  }

}
