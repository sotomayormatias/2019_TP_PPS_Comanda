import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";


@Component({
  selector: 'app-list-pedidos-bartender',
  templateUrl: './list-pedidos-bartender.page.html',
  styleUrls: ['./list-pedidos-bartender.page.scss'],
})
export class ListPedidosBartenderPage implements OnInit {

  
  pedidos: any;
  detalle: any;
  
  spinner: boolean;
  listaRecorreAux: any;


  listIdPedidosAceptadosBar: any;
  listProductosBar: string[] = [] ; 

  pedidosMostrarBar: string[] = [] ; 
  pedidosMostrarBarFil: string[] = [];
  productosPerfilBar: any;
  cantidadPedidos = 1;

  constructor(private baseService: FirebaseService) { 
    // this.traerPedidosPerfilBar();
    // this.traerProductosPerfilBar();
    // this.traerPedidosActivosPorPerfilBar();
  }

  ngOnInit() {
    this.traerPedidosPerfilBar();
    this.traerProductosPerfilBar();
    this.traerPedidosActivosPorPerfilBar();
  }

  traerProductosPerfilBar() {
    // TRAIGO PEDIDOS Y ME QUEDO CON LOS ACEPTADOS
    this.baseService.getItems('productos').then(prod => {
      this.productosPerfilBar = prod;
      // console.log("Todos Pedidos: ", this.pedidos);
      this.productosPerfilBar = this.productosPerfilBar.filter(producto => producto.quienPuedever == "bartender");
      
      this.productosPerfilBar.forEach
      ( 
        productoActivo => { 
        // ARMO EL DETALLE DE LOS PEDIDOS ACEPTADOS
            let nombreProducto = productoActivo.nombre; 
            this.listProductosBar.push( nombreProducto ); 
            
          }
        );
      // console.log("Productos perfil: ", this.productosPerfilBar);
      
      // localStorage.setItem("listProductosBar", "" ); 
      
      localStorage.removeItem("listProductosBar"); 
      localStorage.setItem("listProductosBar", JSON.stringify(this.listProductosBar) ); 
      
      // console.log("List Productos: ", this.listProductosBar);
    });

  }

  traerPedidosPerfilBar() {

    // this.pedidosMostrarBar = [];
    // while (this.pedidosMostrarBar.length) { this.pedidosMostrarBarFil.pop(); }
    this.pedidosMostrarBar = [] ; 

    // TRAIGO PEDIDOS Y ME QUEDO CON LOS ACEPTADOS
    this.baseService.getItems('pedidos').then(ped => {
    
      this.pedidos = ped;
      // console.log("Todos Pedidos: ", this.pedidos);
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "aceptado" || pedido.estado == "preparacion" );
      this.listIdPedidosAceptadosBar =  this.pedidos;
      // console.log("Pedidos Aceptados: ", this.listIdPedidosAceptadosBar);
    });

    // RECORRO DETALLE DE PEDIDOS POR ID
    this.baseService.getItems('pedidoDetalle').then(detalle => {
      
      this.detalle = detalle;
      // console.log("Pedidos Detalles: ", this.detalle);
    
      // HAGO MATCH DE LOS PEDIDOS ACEPTADOS Y SU DETALLE
      this.detalle.forEach(producto => {

        // console.log("Pedido detalle Analizado: ", producto);

        this.listIdPedidosAceptadosBar.forEach
        ( 
          idDetalle => { 
           
          // ARMO EL DETALLE DE LOS PEDIDOS ACEPTADOS
            if ( idDetalle.id == producto.id_pedido ) {
                // tslint:disable-next-line:variable-name

                let pedido_detalle = {
                  'id_pedido': producto.id_pedido ,
                  'producto': producto.producto,
                  'precio': producto.precio,
                  'cantidad': producto.cantidad,
                  'estado': producto.estado,
                  'key': producto.key
                };
                // INSERTO EN EL ARRAY LOS PEDIDOS PENDIENTES
                this.pedidosMostrarBar.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
              }
           
            }
            
            
          );

        });

      // console.log("Pedidos a mostrar: ",  this.pedidosMostrarBar ) ;   
      
      // localStorage.setItem("listaPedidosAceptadosBar", "" );  
      localStorage.removeItem("listaPedidosAceptadosBar"); 
      localStorage.setItem("listaPedidosAceptadosBar", JSON.stringify(this.pedidosMostrarBar) );  
      });
      
 

    }

    traerPedidosActivosPorPerfilBar() {
      this.pedidosMostrarBarFil = [];

      let listaRecorre = localStorage.getItem("listaPedidosAceptadosBar").toString();

      let listaProductos = localStorage.getItem("listProductosBar");
      let listaProductosParsed = JSON.parse(listaProductos);

      JSON.parse(listaRecorre).forEach(idDetalle => {


        for (const iterator of listaProductosParsed) {
          if ( idDetalle.producto == iterator ) {
            
                  // tslint:disable-next-line:variable-name
                  let pedido_detalle = {
                    'id_pedido': idDetalle.id_pedido ,
                    'producto': idDetalle.producto,
                    'precio': idDetalle.precio,
                    'cantidad': idDetalle.cantidad,
                    'estado': idDetalle.estado,
                    'key': idDetalle.key
                  };
                  console.log("Pedido detalle: ", pedido_detalle);
                  this.pedidosMostrarBarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                }
              

              }
        });
      this.spinner = false;
      console.log("Lista Filtrada: ", this.pedidosMostrarBarFil);
      }
    


    traerPedidosActivosPorPerfilBarPrepara(pedidoDet) {

        this.pedidosMostrarBarFil = [];
        let listaRecorre = localStorage.getItem("listaPedidosAceptadosBar").toString();
  
        let listaProductos = localStorage.getItem("listProductosBar");
        let listaProductosParsed = JSON.parse(listaProductos);
  
        JSON.parse(listaRecorre).forEach(idDetalle => {
  
          for (const iterator of listaProductosParsed) {
            
            if ( idDetalle.producto == iterator && idDetalle.id_pedido == pedidoDet.id_pedido  &&  idDetalle.producto == pedidoDet.producto) {
              
                    // tslint:disable-next-line:variable-name
                    let pedido_detalle = {
                      'id_pedido': idDetalle.id_pedido ,
                      'producto': idDetalle.producto,
                      'precio': idDetalle.precio,
                      'cantidad': idDetalle.cantidad,
                      'estado': "preparacion",
                      'key': idDetalle.key
                    };
                    console.log("Pedido detalle modificado: ", pedido_detalle);
                    this.pedidosMostrarBarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                  } else if ( idDetalle.producto == iterator) {
              
                    // tslint:disable-next-line:variable-name
                    let pedido_detalle = {
                      'id_pedido': idDetalle.id_pedido ,
                      'producto': idDetalle.producto,
                      'precio': idDetalle.precio,
                      'cantidad': idDetalle.cantidad,
                      'estado': idDetalle.estado,
                      'key': idDetalle.key
                    };
                    console.log("Pedido detalle: ", pedido_detalle);
                    this.pedidosMostrarBarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                  }
  
                }
          });
        this.spinner = false;
        console.log("Lista Prepara: ", this.pedidosMostrarBarFil);
        }

  // GESTION
aceptarPedido(mesa: string) {
    let pedidoAceptado: any = this.pedidos.find(pedido => pedido.mesa == mesa);
    let key: string = pedidoAceptado.key;
    delete pedidoAceptado.key;
    pedidoAceptado.estado = 'aceptado';
    this.baseService.updateItem('pedidos', key, pedidoAceptado);
    this.traerPedidosPerfilBar();
  }

  prepararPedido(pedidoDet) {
    this.spinner = true;
    console.log("Pedido det: ", pedidoDet) ;
    let pedidoAceptado = pedidoDet ;
    let pedidoKey = pedidoAceptado.key ;

    console.log("Pedido key: ", pedidoDet.key) ;
    
    delete pedidoAceptado.key;
    pedidoAceptado.estado = 'preparacion';
    this.baseService.updateItem('pedidoDetalle', pedidoKey, pedidoAceptado);
     
    setTimeout(() => this.traerPedidosPerfilBar() , 1300);  
    setTimeout(() => this.traerPedidosActivosPorPerfilBarPrepara(pedidoDet) , 1000);  
  
  }

}
