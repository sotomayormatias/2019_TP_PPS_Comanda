import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ToastController, ModalController } from "@ionic/angular";
import { ModalPedidoPage } from "../modal-pedido/modal-pedido.page";

declare var google;
var map;
var markers = [];

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

  clienteLogueado: any;
  mesaDelPedido: any;
  existePedidoAbierto: boolean;
  productosCocina: any;
  productosBartender: any;
  spinner: boolean = true ;
  totalPedido: any = 0;

  cart = [];
  items = [];

  sliderConfig = {
    slidesPerView: 1.2,
    spaceBetween: 5,
    centeredSlides: false,
    zoom: false
  };

  constructor(public baseService: FirebaseService,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController) {
    this.traerProductos();
  }

  ngOnInit() {
    this.cargarMapa();
    this.traerProductos();
  }

  traerProductos() {
    this.spinner = true;
    this.baseService.getItems('productos').then(prods => {
      this.productos = prods;
      this.productos.forEach(producto => {
        producto.cantidad = 0;
      });
      this.productosBartender = this.productos.filter(producto => producto.quienPuedever == "bartender" );
      this.productosCocina = this.productos.filter(producto => producto.quienPuedever == "cocinero" );
      this.spinner = false;
    });
  }

  restarProducto(key: string) {
    let producto = this.productos.find(prod => prod.key == key);
    if (producto.cantidad > 0) {
      producto.cantidad -= 1;
    } else {
      producto.cantidad = 0 ;
    }

    let productosPedidos = this.productos.filter(prod => prod.cantidad > 0);
    this.totalPedido = this.calcularPrecioTotal(productosPedidos);
  }

  sumarProducto(key: string) {
    let producto = this.productos.find(prod => prod.key == key);
    producto.cantidad += 1;

    let productosPedidos = this.productos.filter(prod => prod.cantidad > 0);
    this.totalPedido = this.calcularPrecioTotal(productosPedidos);
 
  }

  generarPedido() {
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
        'cantDet': productosPedidos.length,
        'cantEnt': 0,
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
    precioTotal += 20;
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
    map = new google.maps.Map(elementoMapa, {
      center: { lat: -34.6623821, lng: -58.3645907 },
      zoom: 12
    });

    map.addListener('click', function (e) {
      markers.forEach(mark => {
        mark.setMap(null);
      });
      var marker = new google.maps.Marker({
        position: e.latLng,
        map: map
      });
      markers.push(marker);
      map.panTo(e.latLng);
      
      new google.maps.Geocoder().geocode({'location': e.latLng}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            var direccion = <HTMLInputElement>document.getElementById('direccion');
            direccion.value = results[0].formatted_address;
          } else {
           alert('No results found');
          }
        } else {
          alert('Geocoder failed due to: ' + status);
        }
      });
    });
  }

  buscarDireccion() {
    this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({ 'address': this.direccion }, function (results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        map.setZoom(16);
        var marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          title: 'Tu ubicación'
        });

        // Cargo las coordenadas en hiddens para despues obtenerlas para guardar en firebase
        var latitud = (<HTMLInputElement>document.getElementById('latitud'));
        var longitud = (<HTMLInputElement>document.getElementById('longitud'));
        latitud.value = results[0].geometry.location.lat();
        longitud.value = results[0].geometry.location.lng();
       
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

}
