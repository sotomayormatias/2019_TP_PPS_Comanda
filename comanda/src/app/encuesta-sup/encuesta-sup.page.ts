import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';


@Component({
  selector: 'app-encuesta-sup',
  templateUrl: './encuesta-sup.page.html',
  styleUrls: ['./encuesta-sup.page.scss'],
})
export class EncuestaSupPage implements OnInit {

  empleados: any[];
  clientes: any[];
  ingreso: string = "";


  constructor(private baseService: FirebaseService,
              public modalController: ModalController) {
    this.traerEmpleados();
    this.traerClientes();

   }

  ngOnInit() {
  }
  traerEmpleados(){
 
    this.baseService.getItems('empleados').then(employed => {
      this.empleados = employed

    });
  }
  traerClientes(){
   
    this.baseService.getItems('clientes').then(client => {
      this.clientes = client

    });
  }

  async muestraModal(key:string, ingreso:string){
 
  //  alert(ingreso);
    // alert(this.ingreso);
    const modal = await this.modalController.create({
      component: ModalPagePage,
      componentProps: { 
       //error no pasa el value type
          // propsData:{
            key: key
          // }
          
}
});

      // modal.onDidDismiss()
      // .then((data) => {
       
      //  const info = data['data'];
      // const posicion: number = this.empleados.length-1;
      //  this.empleados[posicion] = data['data'];
      // this.asignoInfo(info);
         
    // });
    return await modal.present();

  

  }

  // asignoInfo(info:any){
  //   console.log(info);
  //   this.empleados[0] = info[0];
  //   this.empleados[1] = info[1];
  //   this.empleados[2] = info[2];
  //   this.empleados[3] = info[3];

  // }

  

}
