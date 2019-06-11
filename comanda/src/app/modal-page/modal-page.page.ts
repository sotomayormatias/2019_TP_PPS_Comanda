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
  // @Input("key") key:any;
  @Input("key") key:any;
  @Input() value:any;



  // key = this.data.key;
  // type = this.data.type;


 

  //creo los dos arrays de empleado/cliente
  empleados: any[];
  encuestaEmp: any [];
  encuestaCli: any [];
  clientes: any[];
  empleadoElegido;


  //DATOS EMPLEADO/CLIENTE
  nombre = "";
  apellido;
  dataCambia;
  dni;
  labelD;
  calidad: number = 10;
  comentario: string = "";

  constructor( public modalController: ModalController,
               public toastController: ToastController,
               private baseService: FirebaseService) {

                alert(this.value);
                if(this.value == "empleado")
                {
                  this.tomodatosEmpleado();

                }
                else if(this.value == "cliente")
                {
                  this.tomodatosCliente();
                }

              
                
                
               
                
                
                }

  ngOnInit() {
 

    

    
    
  }

  async cerrar(){
    
        // var nombreApellido = {
        //   "nombre": this.nombre,
        //   "apellido": this.apellido
        // }
        this.modalController.dismiss(this.empleadoElegido);
  }

  guardar(){

      let errores: number = 0;

      if(this.value == "empleado")
      {
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
      }
      else if(this.value == "cliente"){
        //MODIFICO LOS DATOS EN LA BASE DE DATOS DE CLIENTE
        var db = firebase.database();
        db.ref("clientes/"+this.key).update({ 
          nombre: this.nombre, 
          apellido: this.apellido,
          correo: this.dataCambia,
          dni: this.dni }                                       
        );

        //GUARDO LOS OTROS DATOS EN LA OTRA TABLA
        firebase.database().ref('ecuestasCliente/'+this.key)
          .set({
            calidad: this.calidad, 
            comentarios: this.comentario
        
         });

      }

     

       
  
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

   tomodatosEmpleado(){
    //LEVANTO LOS DATOS DEL EMPLEADO MATCHEANDO POR KEY

    this.baseService.getItems('empleados').then(employed => {
      this.empleados = employed
      this.empleadoElegido = this.empleados.find(emp => emp.key == this.key);
      //creo un preNomb previo, porque sino me trae el string con ""
      var preNomb = JSON.stringify(this.empleadoElegido.nombre);
      this.nombre = preNomb.substr(1,preNomb.length-2);
      var preApe = JSON.stringify(this.empleadoElegido.apellido)
      this.apellido = preApe.substr(1,preApe.length-2);
      this.labelD = "CUIL";
      this.dataCambia = this.empleadoElegido.cuil;
      this.dni = this.empleadoElegido.dni;
      });

      this.baseService.getItems('encuestasEmpleados').then(employEn => {
        this.encuestaEmp = employEn
        var encuestaEmpleadoElegido = this.encuestaEmp.find(enc => enc.key == this.key);
        this.calidad = encuestaEmpleadoElegido.calidad;

      
        var preComent = JSON.stringify(encuestaEmpleadoElegido.comentario);
        this.comentario = preComent.substr(1,preComent.length-2);

      });
  }
 

   tomodatosCliente(){
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

  this.baseService.getItems('ecuestasCliente').then(clientEn => {
    this.encuestaCli = clientEn
    var encuestaClienteElegido = this.encuestaCli.find(enc => enc.key == this.key);
    this.calidad = encuestaClienteElegido.calidad;

  
    var preComent = JSON.stringify(encuestaClienteElegido.comentarios);
    this.comentario = preComent.substr(1,preComent.length-2);

  });

  }

  

}
