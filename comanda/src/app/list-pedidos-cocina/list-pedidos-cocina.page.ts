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
  listProductos: string[] = [] ; 

  pedidosMostrar: string[] = [] ; 
  pedidosMostrarFil: string[] = [];
  productosPerfil: any;

  constructor(private baseService: FirebaseService) { 
    this.traerPedidosPerfil();
    this.traerProductosPerfil();
    this.traerPedidosActivosPorPerfil();
  }

  ngOnInit() {
    // this.traerPedidosActivosPorPerfil();

  }

  traerProductosPerfil() {
    // TRAIGO PEDIDOS Y ME QUEDO CON LOS ACEPTADOS
    this.baseService.getItems('productos').then(prod => {
      this.productosPerfil = prod;
      // console.log("Todos Pedidos: ", this.pedidos);
      this.productosPerfil = this.productosPerfil.filter(producto => producto.quienPuedever == "cocinero");
      
      this.productosPerfil.forEach
      ( 
        productoActivo => { 
        // ARMO EL DETALLE DE LOS PEDIDOS ACEPTADOS
            let nombreProducto = productoActivo.nombre; 
            this.listProductos.push( nombreProducto ); 
            
          }
        );
      console.log("Productos perfil: ", this.productosPerfil);
      
      localStorage.setItem("listProductos", JSON.stringify(this.listProductos) ); 
      
      console.log("List Productos: ", this.listProductos);
    });

  }

  traerPedidosPerfil() {



    // TRAIGO PEDIDOS Y ME QUEDO CON LOS ACEPTADOS
    this.baseService.getItems('pedidos').then(ped => {

      this.pedidos = ped;
      // console.log("Todos Pedidos: ", this.pedidos);
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "aceptado" || pedido.estado == "preparacion" );
      this.listIdPedidosAceptados =  this.pedidos;
      // console.log("Pedidos Aceptados: ", this.listIdPedidosAceptados);
    });

    // RECORRO DETALLE DE PEDIDOS POR ID
    this.baseService.getItems('pedidoDetalle').then(detalle => {
      
      this.detalle = detalle;
      // console.log("Pedidos Detalles: ", this.detalle);
    
      // HAGO MATCH DE LOS PEDIDOS ACEPTADOS Y SU DETALLE
      this.detalle.forEach(producto => {

        // console.log("Pedido detalle Analizado: ", producto);

        this.listIdPedidosAceptados.forEach
        ( 
          idDetalle => { 
          // ARMO EL DETALLE DE LOS PEDIDOS ACEPTADOS
            if ( idDetalle.id == producto.id_pedido ) {
                let pedido_detalle = {
                  'id_pedido': producto.id_pedido ,
                  'producto': producto.producto,
                  'precio': producto.precio,
                  'cantidad': producto.cantidad,
                  'estado': producto.estado
                };
                // INSERTO EN EL ARRAY LOS PEDIDOS PENDIENTES
                this.pedidosMostrar.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
              }
            }
          );

        });

      console.log("Pedidos a mostrar: ",  this.pedidosMostrar ) ;    
      localStorage.setItem("listaPedidosAceptados", JSON.stringify(this.pedidosMostrar) );  
      });
      
 

    }

    traerPedidosActivosPorPerfil() {

      let listaRecorre = localStorage.getItem("listaPedidosAceptados");
      let listaRecorreParsed = JSON.parse(listaRecorre);
      console.log("Lista recorre", listaRecorreParsed);

      let listaProductos = localStorage.getItem("listProductos");
      let listaProductosParsed = JSON.parse(listaProductos);
      
      console.log("Lista de Productos ", listaProductosParsed);

      JSON.parse(listaRecorre).forEach(idDetalle => {

        console.log("Pedido detalle Analizado: ", idDetalle);
            

        for (const iterator of listaProductosParsed) {
          console.log("Iterator:", iterator);
          
          if ( idDetalle.producto == iterator ) 
                {
                  let pedido_detalle = {
                    'id_pedido': idDetalle.id_pedido ,
                    'producto': idDetalle.producto,
                    'precio': idDetalle.precio,
                    'cantidad': idDetalle.cantidad,
                    'estado': idDetalle.estado
                  };
                  this.pedidosMostrarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                }
              }



        
        });

      console.log("Lista Filtrada: ", this.pedidosMostrarFil);
    
      }
    


  // GESTION
aceptarPedido(mesa: string) {
    let pedidoAceptado: any = this.pedidos.find(pedido => pedido.mesa == mesa);
    let key: string = pedidoAceptado.key;
    delete pedidoAceptado.key;
    pedidoAceptado.estado = 'aceptado';
    this.baseService.updateItem('pedidos', key, pedidoAceptado);
    this.traerPedidosPerfil();
  }

}
