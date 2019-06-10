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

  async muestraModal(key: string){
 
    const modal = await this.modalController.create({
      component: ModalPagePage,
      componentProps: { key: key }
      });
    return await modal.present();

  

  }

  

}
