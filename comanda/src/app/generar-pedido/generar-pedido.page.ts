import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: 'app-generar-pedido',
  templateUrl: './generar-pedido.page.html',
  styleUrls: ['./generar-pedido.page.scss'],
})
export class GenerarPedidoPage implements OnInit {
  productos: any;
  clienteLogueado: any;
  mesaDelPedido: any;

  constructor(private baseService: FirebaseService) {
    this.traerProductos();
    // Uso el usuario de sesion para traer los datos completos de la base
    this.traerDatosCliente(JSON.parse(sessionStorage.getItem('usuario')).correo);
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
    // Se genera una copia de la lista de productos
    let productosPedidos = this.productos.filter(prod => prod.cantidad > 0);
    let usuarioLogueado: any;
    let pedido: any;
    //TODO: validar que el cliente ya este asignado a una mesa

    this.baseService.getItems('mesas').then(mesas => {
      this.mesaDelPedido = mesas.find(mes => mes.cliente == this.clienteLogueado.key);

      pedido = {
        'cliente': this.clienteLogueado.key,
        'fecha': (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString(),
        'preciototal': this.calcularPrecioTotal(productosPedidos),
        'mesa': this.traerMesa(this.clienteLogueado.key)
      };
      this.baseService.addItem('pedidos', pedido);
    });
  }

  traerDatosCliente(correo: string): any {
    this.baseService.getItems('clientes').then(clientes => {
      this.clienteLogueado = clientes.find(cli => cli.correo == correo);
    });
  }

  calcularPrecioTotal(pedido: any[]) {
    let precioTotal: number = 0;
    pedido.forEach(producto => {
      precioTotal += producto.precio;
    });

    return precioTotal;
  }

  // traerMesa(keyUsuario: string): any {
  //   this.baseService.getItems('mesas').then(mesas => {
  //     return mesas.find(mes => mes.cliente == keyUsuario);
  //   });
  // }

  async traerMesa(keyUsuario: string) {
    let mesas = await this.baseService.getItems('mesas');
    return (mesas.find(mes => mes.cliente == keyUsuario)).nromesa;
  }
}
