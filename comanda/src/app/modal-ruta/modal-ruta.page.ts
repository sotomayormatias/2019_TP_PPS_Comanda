import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ModalController } from '@ionic/angular';
import * as firebase from "firebase";

declare var google;

@Component({
  selector: 'app-modal-ruta',
  templateUrl: './modal-ruta.page.html',
  styleUrls: ['./modal-ruta.page.scss'],
})
export class ModalRutaPage implements OnInit {
  @Input("pedido") pedido: any;
  pedidoDelivery: any;
  pedidoDetalle: any[] = [];
  mapa: any;
  cliente: any;

  constructor(public baseService: FirebaseService,
    public modalCtrl: ModalController) {
    this.traerPedido();
    this.traerPedidoDetalle();
  }

  ngOnInit() {
    this.calcularRuta();
  }

  traerPedido() {
    this.baseService.getItems('pedidosDelivery').then(ped => {
      this.pedidoDelivery = ped;
      this.pedidoDelivery = this.pedidoDelivery.find(pedido => pedido.id == this.pedido);
      this.baseService.getItems('clientes').then(clients => {
        this.cliente = clients.find(cli => cli.correo == this.pedidoDelivery.cliente);
        let promise = this.traerFoto(this.cliente.nombre);
        Promise.resolve(promise)
          .then(url => {
            this.cliente.foto = url;
          });
      });
    });
  }

  traerPedidoDetalle() {
    this.baseService.getItems('pedidoDetalle').then(ped => {
      this.pedidoDetalle = ped;
      this.pedidoDetalle = this.pedidoDetalle.filter(pedido => pedido.id_pedido == this.pedido);
    });
  }

  async cerrar() {
    this.modalCtrl.dismiss();
  }

  calcularRuta() {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    var lat = parseFloat(this.pedidoDelivery.latitud);
    var lng = parseFloat(this.pedidoDelivery.longitud);
    
    var request = {
      origin: { lat: -34.706458, lng: -58.384059 },
      destination: new google.maps.LatLng(lat, lng),
      travelMode: 'DRIVING'
    };

    directionsService.route(request, function (result, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
      }
    });

    const elementoMapa: HTMLElement = document.getElementById('mapa');
    this.mapa = new google.maps.Map(elementoMapa, {
      center: { lat: -34.706458, lng: -58.384059 },
      zoom: 12
    });

    directionsDisplay.setMap(this.mapa);
  }

  traerFoto(nombre: string): any {
    nombre = nombre.replace(' ', '_');
    let storageRef = firebase.storage().ref();
    const imageRef = storageRef.child('clientes/' + nombre + '.jpg');
    return imageRef.getDownloadURL();
  }
}
