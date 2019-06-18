import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: 'app-list-pedidos-cocina',
  templateUrl: './list-pedidos-cocina.page.html',
  styleUrls: ['./list-pedidos-cocina.page.scss'],
})
export class ListPedidosCocinaPage implements OnInit {

  pedidos: any;
  detalle: any;

  listIdPedidosAceptados: any;
  pedidosMostrar: string[] = [] ; 
  // pedidosMostrar: any ; 
  pedidosMostrarFil: any;

  constructor(private baseService: FirebaseService) { 
    this.traerPedidosAConfirmar();
  }

  ngOnInit() {
  }

  traerPedidosAConfirmar() {

    // TRAIGO PEDIDOS
    this.baseService.getItems('pedidos').then(ped => {

      this.pedidos = ped;
      console.log("Todos Pedidos: ", this.pedidos);
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "aceptado" || pedido.estado == "preparacion" );
      this.listIdPedidosAceptados =  this.pedidos;
      console.log("Pedidos Aceptados: ", this.listIdPedidosAceptados);
    });

    // DETALLE POR ID
    this.baseService.getItems('pedidoDetalle').then(detalle => {
      
      this.detalle = detalle;
      console.log("Pedidos Detalles: ", this.detalle);
      // this.detalle = this.detalle.filter(detalle => detalle.estado == "aceptado" || detalle.estado == "preparacion" );
    
      // let productosPedidos = this.productos.filter(prod => prod.cantidad > 0);

      this.detalle.forEach(producto => {

        console.log("Pedido detalle Analizado: ", producto);

        this.listIdPedidosAceptados.forEach(idDetalle => { 

          console.log("ID LISTA PED Analizado: ", idDetalle);


          if ( idDetalle.id == producto.id_pedido ) {

            // tslint:disable-next-line:variable-name
            let pedido_detalle = {
              'id_pedido': producto.id_pedido ,
              'producto': producto.producto,
              'precio': producto.precio,
              'cantidad': producto.cantidad,
              'estado': producto.estado
            };

            // CONVIERTO PARA RECORRER
            this.pedidosMostrar.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
          }
        });
        


        
      });
      // this.pedidosMostrar = JSON.pars
      // localStorage.setItem('pedidosMostrar', JSON.stringify(this.pedidosMostrar) ) ;
      console.log("Pedidos a mostrar: ",  this.pedidosMostrar ) ;      
      });

    // this.pedidosMostrarFil = JSON.parse( this.pedidosMostrar ) ;
     // PRODUCTOS PARA QUIENPUEDEVER

    // console.log("Pedidos a mostrar FIL: ",  this.pedidosMostrarFil ) ;
    }
  


  aceptarPedido(mesa: string) {
    let pedidoAceptado: any = this.pedidos.find(pedido => pedido.mesa == mesa);
    let key: string = pedidoAceptado.key;
    delete pedidoAceptado.key;
    pedidoAceptado.estado = 'aceptado';
    this.baseService.updateItem('pedidos', key, pedidoAceptado);
    this.traerPedidosAConfirmar();
  }

}
