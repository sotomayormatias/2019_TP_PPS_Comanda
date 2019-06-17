import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { ToastController, AlertController } from '@ionic/angular';

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

  constructor(private baseService: FirebaseService,
    public toastController: ToastController,
    public alertCtrl: AlertController) {
    this.traerProductos();
    this.traerDatosCliente();
    this.traerMesa(JSON.parse(sessionStorage.getItem('usuario')).correo);
  }

  ngOnInit() {
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

  pedir() {
    if (sessionStorage.getItem('pedido')) {
      this.baseService.getItems('pedidos').then(pedidos => {
        let idPedido = sessionStorage.getItem('pedido');
        this.existePedidoAbierto = !(typeof pedidos.find(pedido => pedido.id == idPedido && pedido.estado != 'cerrado') === 'undefined');
        if (this.existePedidoAbierto) {
          this.actualizarPedido();
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
      precioTotal += producto.precio;
    });

    return precioTotal;
  }

  traerMesa(correo: string): any {
    this.baseService.getItems('mesas').then(mesas => {
      this.mesaDelPedido = mesas.find(mes => mes.cliente == correo);
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
          'estado': 'creado'
        };
        this.baseService.addItem('pedidos', pedido);

        productosPedidos.forEach(producto => {
          let pedido_detalle = {
            'id_pedido': id,
            'producto': producto.nombre,
            'precio': producto.precio,
            'estado': 'creado'
          };
          this.baseService.addItem('pedidoDetalle', pedido_detalle);
        });
        this.presentToast("Pedido generado.");
        sessionStorage.setItem('pedido', id.toString());
      }
    }
  }

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
              'estado': 'creado'
            };
            this.baseService.addItem('pedidoDetalle', pedido_detalle);
          });
          this.presentToast("Pedido actualizado.");
      }
    });
  }

}
