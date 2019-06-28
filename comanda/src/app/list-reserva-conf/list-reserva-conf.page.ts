import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-list-reserva-conf',
  templateUrl: './list-reserva-conf.page.html',
  styleUrls: ['./list-reserva-conf.page.scss'],
})
export class ListReservaConfPage implements OnInit {

  reservas: any;
  reservasPendientes:any;
  mesas: any;
  // itemReservas:any;


  constructor(  private baseService: FirebaseService) { 
  
  }

  ngOnInit() {
    this.cargoReservasPendientes()
  }

  async cargoReservasPendientes(){
    await this.traerReservasPendientes();
  }
 

  async traerReservasPendientes() {
    await this.baseService.getItems('reservademesas').then(async lista => {
      this.reservas = lista
      // this.reserva
      this.reservasPendientes = this.reservas.filter(reserva => reserva.estadoConfirmacion == "pendiente");
    });
  }

  confirmarReserva(correo: string) {
    let reservaConfirmado: any = this.reservas.find(cliente => cliente.correo == correo);
    let key: string = reservaConfirmado.key;
    // delete reservaConfirmado['key'];
    reservaConfirmado.estadoConfirmacion = 'confirmado';
    this.baseService.updateItem('reservademesas', key, reservaConfirmado);

     //TABLA MESAS
     this.guardarMesas();   


     this.traerReservasPendientes();
  }

  rechazarReserva(correo: string) {
    let reservaRechazada: any = this.reservas.find(cliente => cliente.correo == correo);
    if(reservaRechazada !== undefined)
    {
      let key: string = reservaRechazada.key;
      // delete reservaConfirmado['key'];
      reservaRechazada.estadoConfirmacion = 'rechazada';
      this.baseService.updateItem('reservademesas', key, reservaRechazada);
      // this.baseService.addItem('usuarios', { 'clave': clienteConfirmado.clave, 'correo': correo, 'perfil': 'cliente' });
      // this.enviarCorreo(correo);
     
       //TABLA MESAS
      //  this.guardarMesas();     

    }
    this.traerReservasPendientes();
    
  }

  async guardarMesas (){

    let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));


    await this.baseService.getItems('reservademesas').then(async lista => {
      this.reservas = lista;
      // console.log(this.reservas);
      // let mesareserva = this.reservas.mesaSeleccionada;

      this.reservas.forEach(element => {

          this.baseService.getItems('mesas').then(mesas => {
          this.mesas = mesas.find(mesaEl => mesaEl.nromesa == element.mesaSeleccionada);
          console.log(this.reservas.mesaSeleccionada);
          this.mesas.reservada = "si";
    
          this.baseService.updateItem('mesas', this.mesas.key , this.mesas);
      
        });
        
      });

    
     
    
    
    });



    

  }

}
