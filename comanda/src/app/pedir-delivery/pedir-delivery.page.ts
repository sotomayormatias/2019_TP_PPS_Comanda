import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ToastController, ModalController } from "@ionic/angular";
import { ModalPedidoPage } from "../modal-pedido/modal-pedido.page";

declare var google;

@Component({
  selector: 'app-pedir-delivery',
  templateUrl: './pedir-delivery.page.html',
  styleUrls: ['./pedir-delivery.page.scss'],
})
export class PedirDeliveryPage implements OnInit {

  productos: any;
  direccion: string = "";
  geocoder: any;
  mapa: any;

  constructor(public baseService: FirebaseService,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController) {
    this.traerProductos();
  }

  ngOnInit() {
    this.cargarMapa();
  }

  traerProductos() {
    this.baseService.getItems('productos').then(prods => {
      this.productos = prods;
      this.productos.forEach(producto => {
        producto.cantidad = 0;
      });
    });
  }

  restarProducto(key: string) {
    let producto = this.productos.find(prod => prod.key == key);
    if (producto.cantidad > 0)
      producto.cantidad -= 1;
  }

  sumarProducto(key: string) {
    let producto = this.productos.find(prod => prod.key == key);
    producto.cantidad += 1;
  }

  generarPedido() {
    // Se genera una copia de la lista de productos
    let productosPedidos = this.productos.filter(prod => prod.cantidad > 0);

    if (productosPedidos.length > 0 && this.direccion != "") {
      let id = Date.now();

      var latitud = (<HTMLInputElement>document.getElementById('latitud'));
      var longitud = (<HTMLInputElement>document.getElementById('longitud'));

      let pedido = {
        'id': id,
        'cliente': JSON.parse(sessionStorage.getItem('usuario')).correo,
        'fecha': (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString(),
        'preciototal': this.calcularPrecioTotal(productosPedidos),
        'direccion': this.direccion,
        'latitud': latitud.value,
        'longitud': longitud.value,
        'estado': 'creado'
      };
      this.baseService.addItem('pedidosDelivery', pedido);

      productosPedidos.forEach(producto => {
        let pedido_detalle = {
          'id_pedido': id,
          'producto': producto.nombre,
          'precio': producto.precio,
          'cantidad': producto.cantidad,
          'estado': 'creado'
        };
        this.baseService.addItem('pedidoDetalle', pedido_detalle);
      });
      this.presentToast("Pedido generado.");
      sessionStorage.setItem('pedido', id.toString());
    } else {
      alert('Faltan datos');
    }
  }

  calcularPrecioTotal(pedido: any[]) {
    let precioTotal: number = 0;
    pedido.forEach(producto => {
      precioTotal += (producto.precio * producto.cantidad);
    });

    return precioTotal;
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: 'success',
      showCloseButton: false,
      position: 'bottom',
      closeButtonText: 'Done',
      duration: 2000
    });
    toast.present();
  }

  async muestraModal() {
    let pedido = '0';
    if (sessionStorage.getItem('pedido')) {
      pedido = sessionStorage.getItem('pedido');
    }

    const modal = await this.modalCtrl.create({
      component: ModalPedidoPage,
      componentProps: {
        pedido: pedido,
      }
    });
    return await modal.present();
  }

  cargarMapa() {
    const elementoMapa: HTMLElement = document.getElementById('mapa');
    this.mapa = new google.maps.Map(elementoMapa, {
      center: { lat: -34.706458, lng: -58.384059 },
      zoom: 12
    });
  }

  buscarDireccion() {
    this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({ 'address': this.direccion }, function (results, status) {
      if (status == 'OK') {
        var latitud = (<HTMLInputElement>document.getElementById('latitud'));
        var longitud = (<HTMLInputElement>document.getElementById('longitud'));
        latitud.value = results[0].geometry.location.lat();
        longitud.value = results[0].geometry.location.lng();
        const elementoMapa: HTMLElement = document.getElementById('mapa');
        this.mapa = new google.maps.Map(elementoMapa, {
          center: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() },
          zoom: 16
        });
        var marker = new google.maps.Marker({
          position: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() },
          map: this.mapa,
          title: 'Tu ubicación'
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

}
