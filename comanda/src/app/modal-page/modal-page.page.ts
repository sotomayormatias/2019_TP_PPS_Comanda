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
  @Input("data") data:any;

  guardokey:any;
  // ingreso:any;
  // @Input("propsData") propsData:any;
  // @Input("") propsData:any;




  // key = this.data.key;
  // type = this.data.type;


 

  //creo los dos arrays de empleado/cliente
  empleados: any[];
  encuestaEmp: any [];
  encuestaCli: any [];
  clientes: any[];
  empleadoElegido;

  spinner:boolean ; 



  //DATOS EMPLEADO/CLIENTE
  nombre = "";
  apellido;
  dataCambia;
  dni;
  labelD;
  valoracion: number = 10;
  comentario: string = "";
  recomendado: string = "si";
  habitue: string = "si";
  puntualidad: string = "puntual";

  comensales: string = "1";


  constructor( public modalController: ModalController,
               public toastController: ToastController,
               private baseService: FirebaseService) {

               
                  // let usuario = JSON.parse(sessionStorage.getItem("cliente")).perfil;

                  // this.tomodatosCliente();
                
                  // this.tomodatosEmpleado();

                  // this.dividoTipo();
              
              
                  this.spinner = true; 
                  setTimeout(() => this.spinner = false , 2000);
                
               
                
                
                }

  ngOnInit() {
 
  
   this.tomodatosEmpleado();
   this.tomodatosCliente();
  
    
                
    


    
    
  }

  async cerrar(){
    
        // var nombreApellido = {
        //   "nombre": this.nombre,
        //   "apellido": this.apellido
        // }
        this.modalController.dismiss();
  }

  guardar(label:any){

      // alert(label);
      let errores: number = 0;


        //  MODIFICO LOS DATOS EN LA BASE DE DATOS DE EMPLEADO
        //  var db = firebase.database();
        //  db.ref("empleados/"+this.key).update({ 
        //    nombre: this.nombre, 
        //    apellido: this.apellido,
        //    cuil: this.dataCambia,
        //    dni: this.dni }                                       
        //  );

      if(label == "CUIL")
      {
        firebase.database().ref('encuestasSupervisor/'+this.key)
        .set({
          valoracion: this.valoracion, 
          comentarios: this.comentario,
          tipo: "empleado",
          recomendado: this.recomendado,
          puntualidad: this.puntualidad

      
       });

      }
      else{
        firebase.database().ref('encuestasSupervisor/'+this.key)
        .set({
          valoracion: this.valoracion, 
          comentarios: this.comentario,
          tipo: "cliente",
          habitue: this.habitue,
          comensales: this.comensales

      
       });
      }
     




 
        //  //GUARDO LOS OTROS DATOS EN LA OTRA TABLA
        //  firebase.database().ref('encuestasEmpleados/'+this.key)
        //    .set({
        //      calidad: this.calidad, 
        //      comentario: this.comentario
         
        //   });
      
     
        //MODIFICO LOS DATOS EN LA BASE DE DATOS DE CLIENTE
        // var db = firebase.database();
        // db.ref("clientes/"+this.key).update({ 
        //   nombre: this.nombre, 
        //   apellido: this.apellido,
        //   correo: this.dataCambia,
        //   dni: this.dni }                                       
        // );

        //GUARDO LOS OTROS DATOS EN LA OTRA TABLA
        // firebase.database().ref('ecuestasCliente/'+this.key)
        //   .set({
        //     calidad: this.calidad, 
        //     comentarios: this.comentario
        
        //  });

      

     

       
  
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


  // dividoTipo(){

  //   var tipo = "";
    
  //   this.baseService.getItems('empleados').then(employed => {
    
  //     this.empleados = employed;
  //     this.empleadoElegido = this.empleados.find(emp => emp.key == this.key);
  //     if(this.empleadoElegido.perfil == "clientes ")
  //     {

  //     } 
     
  //     });

  // }

   tomodatosEmpleado(){
    //LEVANTO LOS DATOS DEL EMPLEADO MATCHEANDO POR KEY
   
    this.baseService.getItems('empleados').then(employed => {
    
      this.empleados = employed;
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

      this.baseService.getItems('encuestasSupervisor').then(employEn => {
        this.encuestaEmp = employEn;
        var encuestaEmpleadoElegido = this.encuestaEmp.find(enc => enc.key == this.key);
          
        this.valoracion = encuestaEmpleadoElegido.valoracion;

        // var preComent = JSON.stringify(encuestaEmpleadoElegido.comentario);
        
        var preComent = JSON.stringify(encuestaEmpleadoElegido.comentarios);
        this.comentario = preComent.substr(1,preComent.length-2);

        var preReco = JSON.stringify(encuestaEmpleadoElegido.recomendado);
        this.recomendado = preReco.substr(1,preReco.length-2);
      
        var prePunt = JSON.stringify(encuestaEmpleadoElegido.puntualidad);
        this.puntualidad = prePunt.substr(1,prePunt.length-2);

      }
      
      );

      // alert(this.guardokey);
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

  this.baseService.getItems('encuestasSupervisor').then(clientEn => {
    this.encuestaCli = clientEn;
    var encuestaClienteElegido = this.encuestaCli.find(enc => enc.key == this.key);
      
    this.valoracion = encuestaClienteElegido.valoracion;

    // var preComent = JSON.stringify(encuestaEmpleadoElegido.comentario);
    
    var preComent = JSON.stringify(encuestaClienteElegido.comentarios);
    this.comentario = preComent.substr(1,preComent.length-2);

    var preReco = JSON.stringify(encuestaClienteElegido.habitue);
    this.habitue = preReco.substr(1,preReco.length-2);
  
    var prePunt = JSON.stringify(encuestaClienteElegido.comensales);
    this.comensales = prePunt.substr(1,prePunt.length-2);

  }
  
  );

  }

  // habitue: string = "si";
  // puntualidad: string = "puntual";

  // comensales: string = "1";

}
