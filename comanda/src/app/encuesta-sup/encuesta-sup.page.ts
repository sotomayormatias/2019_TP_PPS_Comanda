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

  constructor(private baseService: FirebaseService,
              public modalController: ModalController) {
    this.traerEmpleados();
   }

  ngOnInit() {
  }
  traerEmpleados(){
    this.baseService.getItems('empleados').then(employed => {
      this.empleados = employed

    });
  }

  async muestraModal(){
 
    const modal = await this.modalController.create({
      component: ModalPagePage
      // componentProps: { value: 123 }
      });
    return await modal.present();

  

  }

  

}
