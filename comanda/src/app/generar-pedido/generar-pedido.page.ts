import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { ModalPedidoPage } from "../modal-pedido/modal-pedido.page";
import { AudioService } from "../services/audio.service";
// import { HttpClient } from '@angular/common/http';
// import { Headers, RequestOptions } from '@angular/http';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-generar-pedido',
  templateUrl: './generar-pedido.page.html',
  styleUrls: ['./generar-pedido.page.scss'],
})
export class GenerarPedidoPage implements OnInit {
  productos: any;
  clienteLogueado: any;
  mesaDelPedido: any;
  existePedidoAbierto: boolean;
  productosCocina: any;
  productosBartender: any;
  spinner: boolean = true;
  totalPedido: any = 0;

  cart = [];
  items = [];

  // categorias = ['cocinero' , 'bartender'];

  sliderConfig = {
    slidesPerView: 1.2,
    spaceBetween: 5,
    centeredSlides: false,
    zoom: false
  };

  apiFCM = 'https://fcm.googleapis.com/fcm/send';


  constructor(private baseService: FirebaseService,
              public toastController: ToastController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public http: Http,
              public httpClient: HttpClient,
              public audioService: AudioService) {
    this.traerProductos();
    this.traerDatosCliente();
    this.traerMesa(JSON.parse(sessionStorage.getItem('usuario')).correo);
  }

  ngOnInit() {
    this.traerProductos();
  }

  envioPost(pedido) {
    // console.log("estoy en envioPost. Pedido: ", pedido);
    // console.log("estoy en envioPost. Pedido cliente: ", pedido.cliente);

    let tituloNotif = "Pedido Creado - Mesa: " + pedido.mesa ;

    
    let idRecortado = pedido.id.toString() ;
    idRecortado = idRecortado.substr(10, pedido.id.length );

    let bodyNotif = "Tiene " + pedido.cantDet + " nuevo/s producto/s para preparar. Pedido NRO: " + idRecortado + " Cliente: " + pedido.cliente + "EN ESPERA DE APROBACION POR EL MOZO" ; 

    let header = this.initHeaders();
    let options = new RequestOptions({ headers: header, method: 'post'});
    let data =  {
      "notification": {
        "title": tituloNotif   ,
        "body": bodyNotif ,
        "sound": "default",
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "icon": "fcm_push_icon"
      },
      "data": {
        "landing_page": "home",
        "price": "$3,000.00"
      },
        "to": "/topics/notificacionPedido",
        "priority": "high",
        "restricted_package_name": ""
    };

    console.log("Data: ", data);
   
    return this.http.post(this.apiFCM, data, options).pipe(map(res => res.json())).subscribe(result => {
      console.log(result);
    });

               
  }
  

 private initHeaders(): Headers {
    let apiKey = 'key=AAAA2wftesY:APA91bHz-jR4toOu4DkoWYMARt9hfF8sR9YoV0dzGCdS3SGw30JlgFFiVB7-seK3Yll9yC2Rqf22CGwoPhh-7D7rWKdM2N2gT-CgNbk7GGv9VVwx_5Ut48qjWNEItZTIXclH-mnw8St1' ;
    var headers = new Headers();
    headers.append('Authorization', apiKey);
    headers.append('Content-Type', 'application/json');
    return headers;
 }

 private handleError(error: any): Observable<any> {
     return Observable.throw(error.message || error);
 }             


  
  addToCart(product) {
    // this.cartService.addProduct(product);
  }

openCart() {
    // this.router.navigate(['cart']);
  }

traerProductos() {
    this.spinner = true;
    this.baseService.getItems('productos').then(prods => {
      this.productos = prods;
      this.productos.forEach(producto => {
        producto.cantidad = 0;
      });
      this.productosBartender = this.productos.filter(producto => producto.quienPuedever == "bartender");
      this.productosCocina = this.productos.filter(producto => producto.quienPuedever == "cocinero");
      this.spinner = false;
    });
  }

restarProducto(key: string) {
    let producto = this.productos.find(prod => prod.key == key);
    if (producto.cantidad > 0) {
      producto.cantidad -= 1;
    } else {
      producto.cantidad = 0;
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

pedir() {
    if (sessionStorage.getItem('pedido')) {
      this.baseService.getItems('pedidos').then(pedidos => {
        let idPedido = sessionStorage.getItem('pedido');
        this.existePedidoAbierto = !(typeof pedidos.find(pedido => pedido.id == idPedido && pedido.estado != 'cerrado') === 'undefined');
        if (this.existePedidoAbierto) {
          // ACTUALIZO PEDIDO

          let pedidoAceptado = pedidos.find(pedido => pedido.id == idPedido);
          let productosPedidos = this.productos.filter(prod => prod.cantidad > 0);
          // console.log("Pedido encontrado: ", pedidoAceptado);
          let key: string = pedidoAceptado.key;
          delete pedidoAceptado.key;
          pedidoAceptado.cantDet = productosPedidos.length;
          pedidoAceptado.cantEnt = 0;
          this.baseService.updateItem('pedidos', key, pedidoAceptado);
          //  ACTUALIZO DETALLE
          this.baseService.getItems('pedidoDetalle').then(productos => {
            let pedidoEnPreparacion: boolean = false;
            productos.forEach(prod => {
              if (prod.id_pedido == idPedido && prod.estado == 'preparacion') {
                pedidoEnPreparacion = true;
              }
            });
            if (pedidoEnPreparacion) {
              this.presentAlertPedidoEnProceso();
            } else {
              this.actualizarPedido();
            }
          });
        } else {
          this.generarPedido();
        }
      });
    } else {
      this.generarPedido();
    }
  }

traerDatosCliente(): any {
    this.clienteLogueado = JSON.parse(sessionStorage.getItem('usuario'));
  }

calcularPrecioTotal(pedido: any[]) {
    let precioTotal: number = 0;
    pedido.forEach(producto => {
      precioTotal += (producto.precio * producto.cantidad);
    });

    return precioTotal;
  }

traerMesa(correo: string): any {
    this.baseService.getItems('mesas').then(mesas => {
      this.mesaDelPedido = mesas.find(mes => mes.cliente == correo);
      this.cargarPedidoExistente();
    });
  }

async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'success',
      showCloseButton: false,
      position: 'bottom',
      closeButtonText: 'Done',
      duration: 2000
    });
    toast.present();
  }

async presentAlertSinMesa() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Cliente sin mesa',
      message: 'Usted no está asignado a ninguna mesa.',
      buttons: ['OK']
    });
    await alert.present();
  }

async presentAlertPedidoEnProceso() {
    const alert = await this.alertCtrl.create({
      subHeader: 'El pedido no puede modificarse',
      message: 'El pedido ya se encuentra en preparación.',
      buttons: ['OK']
    });
    await alert.present();
  }

generarPedido() {
    // Se genera una copia de la lista de productos
    let productosPedidos = this.productos.filter(prod => prod.cantidad > 0);

    if (productosPedidos.length > 0) {
      if (typeof this.mesaDelPedido === 'undefined') {
        this.presentAlertSinMesa();
      } else {
        let id = Date.now();

        let pedido = {
          'id': id,
          'cliente': this.clienteLogueado.correo,
          'fecha': (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString(),
          'preciototal': this.calcularPrecioTotal(productosPedidos),
          'mesa': this.mesaDelPedido.nromesa,
          'estado': 'creado',
          'cantDet': productosPedidos.length,
          'cantEnt': 0,
          'juegoDescuento': false,
          'juegoBebida': false,
          'juegoComida': false
        };
        this.baseService.addItem('pedidos', pedido);

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
        this.audioService.play('mmm');
        this.envioPost(pedido);
        this.presentToast("Pedido generado.");
        sessionStorage.setItem('pedido', id.toString());
        // ENVIO PUSH NOTIFICATION
        
      
      }
    }
  }

// sendPostRequest() {
//     let headers = new Headers();
//     headers.append("Accept", 'application/json');
//     headers.append('Content-Type', 'application/json' );
//     const requestOptions = new RequestOptions({ headers: headers });

//     let postData = {
//             "name": "Customer004",
//             "email": "customer004@email.com",
//             "tel": "0000252525"
//     };

//     this.httpClient	.post("http://127.0.0.1:3000/customers", postData, requestOptions)
//       .subscribe(data => {
//         console.log(data['_body']);
//        }, error => {
//         console.log(error);
//       });
//   }



actualizarPedido() {
    let idPedido = sessionStorage.getItem('pedido');
    this.baseService.getItems('pedidoDetalle').then(productos => {
      // Se borran los productos existentes
      let detalle: any[] = [];
      detalle = productos.filter(producto => producto.id_pedido == idPedido);
      detalle.forEach(prod => {
        let key = prod.key;
        this.baseService.removeItem('pedidoDetalle', key);
      });

      // Se agregan los nuevos productos
      let productosPedidos = this.productos.filter(prod => prod.cantidad > 0);

      if (productosPedidos.length > 0) {
        productosPedidos.forEach(producto => {
          let pedido_detalle = {
            'id_pedido': idPedido,
            'producto': producto.nombre,
            'precio': producto.precio,
            'cantidad': producto.cantidad,
            'estado': 'creado'
          };
          this.baseService.addItem('pedidoDetalle', pedido_detalle);
        });
        this.presentToast("Pedido actualizado.");
      }
    });
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

cargarPedidoExistente() {
    this.baseService.getItems('pedidos').then(pedidos => {
      this.existePedidoAbierto = !(typeof pedidos.find(pedido => pedido.mesa == this.mesaDelPedido.nromesa && pedido.estado != 'cerrado') === 'undefined');
      if (this.existePedidoAbierto && !sessionStorage.getItem('pedido')) {
        sessionStorage.setItem('pedido', pedidos.find(pedido => pedido.mesa == this.mesaDelPedido.nromesa && pedido.estado != 'cerrado').id);
      }
    });
  }

}
