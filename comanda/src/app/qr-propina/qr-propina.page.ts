import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from "../services/firebase.service";
import { ToastController } from '@ionic/angular';
import { AlertController } from "@ionic/angular";


import * as firebase from "firebase";


@Component({
  selector: 'app-qr-propina',
  templateUrl: './qr-propina.page.html',
  styleUrls: ['./qr-propina.page.scss'],
})
export class QrPropinaPage implements OnInit {
  datosEscaneados: any;
  parsedDatosEscaneados: any;
  pedidoCliente: any;
  propina : any;
  key: any;
  preciototalAnterior: any;
  totalFinal: any;

  constructor(private scanner: BarcodeScanner,
              private baseService: FirebaseService,
              // private alertcontroler: AlertController,
              private toastcontroler: ToastController,
              private alertCtrl: AlertController

  ) { }

  ngOnInit() {

    // tomardatosPedido();
  }

  
  doScan() {
    this.scanner.scan().then((data) => {
      this.datosEscaneados = data;
      this.propina = JSON.parse(this.datosEscaneados.text);
    
      this.baseService.getItems('pedidos').then(pedidos => {
     
      let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
    
      this.pedidoCliente = pedidos.find(client => client.cliente == usuarioLogueado.correo);

   
      this.key = this.pedidoCliente.key;
     
      this.preciototalAnterior = this.pedidoCliente.preciototal;
    
      this.totalFinal = this.pedidoCliente.preciototal + this.propina;
    
      this.muestroAlert();

    });

    }, (err) => {
      console.log("Error: " + err);
    });
  }


 

  async muestroAlert()
  {
   

    const alert = await this.alertCtrl.create({
      header: 'Propina seleccionada: '+ this.propina,
      subHeader: '¿Confirma propina?',
      message: 'Precio pedido: $'+ JSON.stringify(this.preciototalAnterior) +' Desea agregar $'+ this.propina + ' ? Precio final: $'+ this.totalFinal,
    
      buttons: [
        {
        
          text: 'Confirmar',
          handler: () => {

            this.cargarenlaBD();
            this.subidaCorrecta();
           
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          // icon: 'close',
          handler: () => {
           
          }
        }
      ]
    });

    await alert.present();

  }

  async subidaCorrecta() {
    const toast = await this.toastcontroler.create({
    
      message: 'Precio Final: $'+ this.totalFinal,
      color: 'success',
      showCloseButton: true,
      position: 'middle',
      closeButtonText: 'OK',
      // duration: 3000
    });

    toast.present();
  }

  async subidaErronea(mensaje: string) {
    const toast = await this.toastcontroler.create({
    
      message: mensaje,
      color: 'danger',
      showCloseButton: false,
      position: 'top',
      closeButtonText: 'Done',
      duration: 3000
    });

    toast.present();
  }


  cargarenlaBD()
  {
    // this.baseService.getItems('pedidos').then(pedidos => {
      // let cliente = pedido.cliente;
      // alert(JSON.stringify(pedidos));
      
      // let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));

   
      //   this.pedidoCliente = pedidos.find(client => client.cliente == usuarioLogueado.correo);
      //  let key = this.pedidoCliente.key;
      //  alert(key);
        
        // switch (this.datosEscaneados.text) {
        //   case "20":
        //     this.propina = "20";
          //   this.pedidoCliente.preciototal += (this.pedidoCliente.preciototal * this.propina)/100;
          //  alert(this.pedidoCliente.precioTotal);
          //   break;
          // case "15":
          //     this.propina = "15";
            //  this.pedidoCliente.preciototal += (this.pedidoCliente.preciototal *  this.propina)/100;
          //   break;
          // case "10":
          //     this.propina = "10";
           //   this.pedidoCliente.preciototal += (this.pedidoCliente.preciototal *  this.propina)/100;
          //   break;
          // case "5":
          //     this.propina = "5";
           //   this.pedidoCliente.preciototal += (this.pedidoCliente.preciototal *  this.propina)/100;
        
        //   default:
        //     this.subidaErronea("Error con el precio del producto.");
        //     break;
          


        // }         
      
     
    // });
    
    // alert(this.key);
    // alert(this.totalFinal);

    firebase.database().ref('pedidos/'+ this.key)
    .update({
      preciototal: this.totalFinal
      //GUARDO PROPINA TAMBIEN?
      
  
   });
  }
}



