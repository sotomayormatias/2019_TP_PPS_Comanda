import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from "../services/firebase.service";
import { ToastController } from '@ionic/angular';


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
  preciototal: any;

  constructor(private scanner: BarcodeScanner,
              private baseService: FirebaseService,
              private toastcontroler: ToastController
              // private alertCtrl: AlertController

  ) { }

  ngOnInit() {

    // tomardatosPedido();
  }

  
  doScan() {
    this.scanner.scan().then((data) => {
      this.datosEscaneados = data;
      this.parsedDatosEscaneados = JSON.parse(this.datosEscaneados.text);
    
    
      this.mostrarInfo();
    }, (err) => {
      console.log("Error: " + err);
    });
  }

  mostrarInfo(){

    

    this.baseService.getItems('pedidos').then(pedidos => {
      // let cliente = pedido.cliente;
      // alert(JSON.stringify(pedidos));
      
      let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));

   
        this.pedidoCliente = pedidos.find(client => client.cliente == usuarioLogueado.correo);
      
      // alert(JSON.stringify(usuarioLogueado));
      
       
        // alert(JSON.stringify(this.pedidoCliente));
        // alert("Datosescaneados.text: "+this.datosEscaneados.text)

        
        switch (this.datosEscaneados.text) {
          case "20":
            this.propina = "20";
            this.pedidoCliente.preciototal += (this.pedidoCliente.preciototal * this.propina)/100;
            break;
          case "15":
              this.propina = "15";
              this.pedidoCliente.preciototal += (this.pedidoCliente.preciototal *  this.propina)/100;
            break;
          case "10":
              this.propina = "10";
              this.pedidoCliente.preciototal += (this.pedidoCliente.preciototal *  this.propina)/100;
            break;
          case "5":
              this.propina = "5";
              this.pedidoCliente.preciototal += (this.pedidoCliente.preciototal *  this.propina)/100;
        
          default:
            this.subidaErronea("Error con el precio del producto.");
            break;
          


        }

        // alert("Propina: "+this.propina + "PreciototalPedido: " + this.pedidoCliente.preciototal);
            firebase.database().ref('pedidos/'+this.pedidoCliente.key)
            .set({
              preciototal: this.pedidoCliente.preciototal
              //GUARDO PROPINA TAMBIEN?
              
          
           });

           this.subidaExitosa("Muchas gracias por elegirnos! =)");
      
     
    });

  }

  async subidaExitosa(mensaje) {
    const toast = await this.toastcontroler.create({
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
    const toast = await this.toastcontroler.create({
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



