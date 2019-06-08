import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {

  constructor( public modalController: ModalController) { }

  ngOnInit() {
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
