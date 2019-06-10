import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';



@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {

  @Input("key") key:any;
  empleados: any[];
  clientes: any[];


  //DATOS EMPLEADO
  nombre;
  apellido;
  dataCambia;
  dni;
  labelD;





  constructor( public modalController: ModalController,
               private baseService: FirebaseService,) { }

  ngOnInit() {
    // alert(this.key);

    //Guardo los datos del empleado seleccionado
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

    this.baseService.getItems('clientes').then(client => {
      this.clientes = client
      let clienteElegido = this.clientes.find(client => client.key == this.key);
      var preNomb = JSON.stringify(clienteElegido.nombre);
      this.nombre = preNomb.substr(1,preNomb.length-2);
      var preApe = JSON.stringify(clienteElegido.apellido);
      this.apellido = preApe.substr(1,preApe.length-2);
      this.labelD = "CORREO";
      var preData = JSON.stringify(clienteElegido.correo);
      this.dataCambia = preData.substr(1,preData.length-2);
      this.dni = JSON.stringify(clienteElegido.dni);
  
  
      });

    
  }

  async cerrar(){
  //   const { data } = await modal.onDidDismiss();
  //   console.log(data);
  //   // Dismiss the top modal returning some data object
  //   modalController.dismiss({
  //     'result': value
  //   })

        this.modalController.dismiss();
  }

  

}
