import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: 'app-generar-pedido',
  templateUrl: './generar-pedido.page.html',
  styleUrls: ['./generar-pedido.page.scss'],
})
export class GenerarPedidoPage implements OnInit {
  productos: any;

  constructor(private baseService: FirebaseService) {
    this.traerProductos();
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

  pedir(){
    // Se genera una copia de la lista de productos
    let productosPedidos = this.productos.filter(prod => prod.cantidad > 0);

   console.log(productosPedidos);
  }
}
