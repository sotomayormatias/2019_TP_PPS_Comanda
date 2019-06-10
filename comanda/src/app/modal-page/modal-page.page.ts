import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { ToastController } from '@ionic/angular';

import * as firebase from "firebase";




@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {

  //traigo la KEY 
  @Input("key") key:any;

  //creo los dos arrays de empleado/cliente
  empleados: any[];
  clientes: any[];


  //DATOS EMPLEADO/CLIENTE
  nombre;
  apellido;
  dataCambia;
  dni;
  labelD;
  calidad: number = 10;
  comentario: string = "";

  constructor( public modalController: ModalController,
               public toastController: ToastController,
               private baseService: FirebaseService,) { }

  ngOnInit() {
 

    //LEVANTO LOS DATOS DEL EMPLEADO MATCHEANDO POR KEY
    this.baseService.getItems('empleados').then(employed => {
    this.empleados = employed
    let empleadoElegido = this.empleados.find(emp => emp.key == this.key);
    //creo un preNomb previo, porque sino me trae el string con ""
    var preNomb = JSON.stringify(empleadoElegido.nombre);
    this.nombre = preNomb.substr(1,preNomb.length-2);
    var preApe = JSON.stringify(empleadoElegido.apellido)
    this.apellido = preApe.substr(1,preApe.length-2);
    this.labelD = "CUIL";
    this.dataCambia = JSON.stringify(empleadoElegido.cuil);
    this.dni = JSON.stringify(empleadoElegido.dni);
    });

    //LEVANTO LOS DATOS DEL CLIENTE MATCHEANDO POR KEY
    this.baseService.getItems('clientes').then(client => {
      this.clientes = client
      let clienteElegido = this.clientes.find(client => client.key == this.key);
      var preNomb = JSON.stringify(clienteElegido.nombre);
      this.nombre = preNomb.substr(1,preNomb.length-2);
      var preApe = JSON.stringify(clienteElegido.apellido);
      this.apellido = preApe.substr(1,preApe.length-2);
      this.labelD = "correo";
      var preData = JSON.stringify(clienteElegido.correo);
      this.dataCambia = preData.substr(1,preData.length-2);
      this.dni = JSON.stringify(clienteElegido.dni);
  
  
      });

    
  }

  async cerrar(){
        this.modalController.dismiss();
  }

  guardar(){

      let errores: number = 0;

      //MODIFICO LOS DATOS EN LA BASE DE DATOS DE EMPLEADO
        var db = firebase.database();
        db.ref("empleados/"+this.key).update({ 
          nombre: this.nombre, 
          apellido: this.apellido,
          cuil: this.dataCambia,
          dni: this.dni }                                       
        );

        //GUARDO LOS OTROS DATOS EN LA OTRA TABLA
        firebase.database().ref('encuestasEmpleados/'+this.key)
          .set({
            calidad: this.calidad, 
            comentario: this.comentario
        
         });
      

       
  
      if (errores == 0)
        this.subidaExitosa("Se guardaron los datos.");
      else
        this.subidaErronea("Error al modificar.");

  }


  async subidaExitosa(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'success',
      showCloseButton: false,
      position: 'top',
      closeButtonText: 'Done',
      duration: 2000
    });

    toast.present();
    
  }

  async subidaErronea(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'danger',
      showCloseButton: false,
      position: 'bottom',
      closeButtonText: 'Done',
      duration: 2000
    });

    toast.present();
  }

  

}
