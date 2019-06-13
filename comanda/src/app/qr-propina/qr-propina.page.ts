import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FirebaseService } from "../services/firebase.service";

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
              private baseService: FirebaseService
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
      alert(JSON.stringify(pedidos));
      let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
      alert(JSON.stringify(usuarioLogueado));
      if(usuarioLogueado.perfil == "cliente")
      {
        this.pedidoCliente = pedidos.find(client => client.cliente == usuarioLogueado.key);
        alert(JSON.stringify(this.pedidoCliente));
        // switch (this.datosEscaneados.text) {
        //   case "20":
        //     this.propina = "20";
        //     this.preciototal += (this.preciototal* this.propina)/100;
        //     break;
        //   case "15":
        //       this.propina = "15";
        //       this.preciototal += (this.preciototal*  this.propina)/100;
        //     break;
        //   case "10":
        //       this.propina = "10";
        //       this.preciototal += (this.preciototal*  this.propina)/100;
        //     break;
        //   case "5":
        //       this.propina = "5";
        //       this.preciototal += (this.preciototal*  this.propina)/100;
        
        //   default:
        //     break;
        // }

      }
     

    //   firebase.database().ref('pedidos/'+cliente)
    //   .set({
    //    propina: this.propina
    
    //  });

    //   let usuarioLogueado: any = JSON.parse(sessionStorage.getItem('usuario'));
    //   if (usuarioLogueado.perfil == "cliente") {
    //     if (this.mesaEscaneada.estado == 'libre') {
    //       this.presentAlertCliente();
    //     } else {
    //       // TODO: aca hay que ver si el que escanea es el que esta ocupando la mesa
    //       this.presentAlertEmpleado();
    //     }
    //   } else {
    //     this.presentAlertEmpleado();
    //   }
    });

  }

  tomardatosPedido(){


    // this.pedidoCliente = pedido.find(client => client.cliente == cliente);

  }
}



