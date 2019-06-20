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
    this.traerPedidosPerfilBar();
    this.traerProductosPerfilBar();
    this.traerPedidosActivosPorPerfilBar();
  }

  ngOnInit() {

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
      
      localStorage.setItem("listProductosBar", "" ); 
      localStorage.setItem("listProductosBar", JSON.stringify(this.listProductosBar) ); 
      
      // console.log("List Productos: ", this.listProductosBar);
    });

  }

  traerPedidosPerfilBar() {



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
      this.pedidosMostrarBar = [] ; 
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
     
      localStorage.setItem("listaPedidosAceptadosBar", JSON.stringify(this.pedidosMostrarBar) );  
      });
      
 

    }

    traerPedidosActivosPorPerfilBar() {
      // this.spinner = true;
      setTimeout(() => this.spinner = true, 4000);

      // this.pedidosMostrarBarFil = [] ;
      let listaRecorre = localStorage.getItem("listaPedidosAceptadosBar");
      // let listaRecorreParsed = JSON.parse(listaRecorre);
      // console.log("Lista recorre", listaRecorre);

      let listaProductos = localStorage.getItem("listProductosBar");
      let listaProductosParsed = JSON.parse(listaProductos);

      // console.log("Lista de Productos ", listaProductosParsed);

      JSON.parse(listaRecorre).forEach(idDetalle => {

        // console.log("Pedido detalle Analizado: ", idDetalle);
            

        for (const iterator of listaProductosParsed) {
          // console.log("Iterator:", iterator);
          
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
                  this.pedidosMostrarBarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                }

              }
        });
      setTimeout(() => this.spinner = false, 4000);
      console.log("Lista Filtrada: ", this.pedidosMostrarBarFil);
    
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
    // let pedidoKey: any = this.pedidosMostrarBarFil.find(pedido => pedido.id_pedido == pedidoDet.id_pedido && pedido.producto = pedidoDet.producto);
    let pedidoAceptado = pedidoDet ;
    let pedidoKey = pedidoDet.key ;

    console.log("Pedido key: ", pedidoDet.key) ;
    // let key: string = pedidoAceptado.key;

    delete pedidoAceptado.key;
    pedidoAceptado.estado = 'preparacion';
    this.baseService.updateItem('pedidoDetalle', pedidoKey, pedidoAceptado);
    
    // localStorage.clear();
    // setTimeout(() => this.traerPedidosPerfilBar() , 1300); 
   
    setTimeout(() => this.traerProductosPerfilBar() , 1300);  
    setTimeout(() => this.traerPedidosActivosPorPerfilBar() , 1000);  

    
  }

}
