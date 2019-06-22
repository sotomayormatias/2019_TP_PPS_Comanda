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
  
  spinner: boolean;
  listaRecorreAux: any;


  listIdPedidosAceptados: any;
  listProductos: string[] = [] ; 

  pedidosMostrar: string[] = [] ; 
  pedidosMostrarFil: string[] = [];
  productosPerfil: any;
  cantidadPedidos = 1;
  TEstimado = '';
  selected = ['', '', ''];

  tpedido: any ;
  pedidoEnLocal: any = null;
  pedidoDelivery: any = null;
  pedidoDetalle: any[] = [];
  hayPedidoDelivery: boolean = false;
  hayPedidoEnLocal: boolean = false;

  constructor(private baseService: FirebaseService) { 
    // this.traerPedidosPerfil();
    // this.traerProductosPerfil();
    // this.traerPedidosActivosPorPerfil();
  }

  ngOnInit() {
    this.traerPedidosPerfil();
    this.traerProductosPerfil();
    this.traerPedidosActivosPorPerfil();
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
      // console.log("Productos perfil: ", this.productosPerfil);
      
      // localStorage.setItem("listProductos", "" ); 
      
      localStorage.removeItem("listProductos"); 
      localStorage.setItem("listProductos", JSON.stringify(this.listProductos) ); 
      
      // console.log("List Productos: ", this.listProductos);
    });

  }

  traerPedidosPerfil() {

    // this.pedidosMostrar = [];
    // while (this.pedidosMostrar.length) { this.pedidosMostrarFil.pop(); }
    this.pedidosMostrar = [] ; 

    // TRAIGO PEDIDOS Y ME QUEDO CON LOS ACEPTADOS
    this.baseService.getItems('pedidos').then(ped => {
    
      this.pedidos = ped;
      // console.log("Todos Pedidos: ", this.pedidos);
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "aceptado" || pedido.estado == "preparacion" );
      this.listIdPedidosAceptados =  this.pedidos;
      // console.log("Pedidos Aceptados: ", this.listIdPedidosAceptados);
    });

    this.baseService.getItems('pedidosDelivery').then(ped => {

      this.pedidos = ped;
      // console.log("Todos Pedidos: ", this.pedidos);
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "aceptado" || pedido.estado == "preparacion"  );
      
      this.pedidos.forEach(pedido =>  {
        pedido.delivery = true ;
        this.listIdPedidosAceptados.push(pedido) ;
      } );
      // this.listIdPedidosAceptadosBar.add(JSON.stringify(this.pedidos)) ;
      console.log("Pedidos Aceptados2: ", this.listIdPedidosAceptados);
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
                // tslint:disable-next-line:variable-name

                let pedido_detalle = {
                  'id_pedido': producto.id_pedido ,
                  'producto': producto.producto,
                  'precio': producto.precio,
                  'cantidad': producto.cantidad,
                  'estado': producto.estado,
                  'tiempo': producto.tiempo,
                  'delivery': idDetalle.delivery,
                  'key': producto.key
                };
                // INSERTO EN EL ARRAY LOS PEDIDOS PENDIENTES
                this.pedidosMostrar.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
              }
           
            }
            
            
          );

        });

      // console.log("Pedidos a mostrar: ",  this.pedidosMostrar ) ;   
      
      // localStorage.setItem("listaPedidosAceptados", "" );  
      localStorage.removeItem("listaPedidosAceptados"); 
      localStorage.setItem("listaPedidosAceptados", JSON.stringify(this.pedidosMostrar) );  
      });
      
 

    }

    traerPedidosActivosPorPerfil() {
      this.pedidosMostrarFil = [];

      let listaRecorre = localStorage.getItem("listaPedidosAceptados").toString();

      let listaProductos = localStorage.getItem("listProductos");
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
                    'tiempo': idDetalle.tiempo,
                    'delivery': idDetalle.delivery,
                    'key': idDetalle.key
                  };
                  console.log("Pedido detalle: ", pedido_detalle);
                  this.pedidosMostrarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                }
              

              }
        });
      this.spinner = false;
      console.log("Lista Filtrada: ", this.pedidosMostrarFil);
      }
    


    traerPedidosActivosPorPerfilPrepara(pedidoDet) {

        this.pedidosMostrarFil = [];
        let listaRecorre = localStorage.getItem("listaPedidosAceptados").toString();
  
        let listaProductos = localStorage.getItem("listProductos");
        let listaProductosParsed = JSON.parse(listaProductos);
  
        JSON.parse(listaRecorre).forEach(idDetalle => {
  
          for (const iterator of listaProductosParsed) {
            
            if ( idDetalle.producto == iterator && idDetalle.id_pedido == pedidoDet.id_pedido &&  idDetalle.producto == pedidoDet.producto ) {
              
                    // tslint:disable-next-line:variable-name
                    let pedido_detalle = {
                      'id_pedido': idDetalle.id_pedido ,
                      'producto': idDetalle.producto,
                      'precio': idDetalle.precio,
                      'cantidad': idDetalle.cantidad,
                      'estado': "preparacion",
                      'delivery': idDetalle.delivery,
                      'tiempo': this.TEstimado ,
                      'key': idDetalle.key
                    };
                    console.log("Pedido detalle modificado: ", pedido_detalle);
                    this.pedidosMostrarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                  } else if ( idDetalle.producto == iterator) {
              
                    // tslint:disable-next-line:variable-name
                    let pedido_detalle = {
                      'id_pedido': idDetalle.id_pedido ,
                      'producto': idDetalle.producto,
                      'precio': idDetalle.precio,
                      'cantidad': idDetalle.cantidad,
                      'delivery': idDetalle.delivery,
                      'estado': idDetalle.estado,
                      'tiempo': idDetalle.tiempo,
                      'key': idDetalle.key
                    };
                    console.log("Pedido detalle: ", pedido_detalle);
                    this.pedidosMostrarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                  }
  
                }
          });
        this.spinner = false;
        console.log("Lista Prepara: ", this.pedidosMostrarFil);
        }

        traerPedidosActivosPorPerfilTermina(pedidoDet) {

          this.pedidosMostrarFil = [];
          let listaRecorre = localStorage.getItem("listaPedidosAceptados").toString();
    
          let listaProductos = localStorage.getItem("listProductos");
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
                        'delivery': idDetalle.delivery,
                        'estado': "finalizado",
                        'key': idDetalle.key
                      };
                      console.log("Pedido detalle modificado: ", pedido_detalle);
                      this.pedidosMostrarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                    } else if ( idDetalle.producto == iterator) {
                
                      // tslint:disable-next-line:variable-name
                      let pedido_detalle = {
                        'id_pedido': idDetalle.id_pedido ,
                        'producto': idDetalle.producto,
                        'precio': idDetalle.precio,
                        'cantidad': idDetalle.cantidad,
                        'estado': idDetalle.estado,
                        'delivery': idDetalle.delivery,
                        'key': idDetalle.key
                      };
                      console.log("Pedido detalle: ", pedido_detalle);
                      this.pedidosMostrarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                    }
    
                  }
            });
          this.spinner = false;
          console.log("Lista Prepara: ", this.pedidosMostrarFil);
          }

  // GESTION


  prepararPedido(pedidoDet) {
    this.spinner = true;
    console.log("Pedido det: ", pedidoDet) ;
    let pedidoAceptado = pedidoDet ;
    let pedidoKey = pedidoAceptado.key ;

    console.log("Pedido key: ", pedidoDet.key) ;
    
    delete pedidoAceptado.key;
    pedidoAceptado.tiempo = this.TEstimado;
    pedidoAceptado.estado = 'preparacion';
    this.baseService.updateItem('pedidoDetalle', pedidoKey, pedidoAceptado);

    this.actualizoPedido (pedidoDet);
    setTimeout(() => this.traerPedidosPerfil() , 1300);  
    setTimeout(() => this.traerPedidosActivosPorPerfilPrepara(pedidoDet) , 1000);  
    }
  

    actualizoPedido(pedidoDet) {
      console.log("PedidoDet: ", pedidoDet);
      console.log("Lista Aceptados: ", this.listIdPedidosAceptados);
      let pedidoAceptado: any = this.listIdPedidosAceptados.find(pedido => pedido.id == pedidoDet.id_pedido);
      console.log("Pedido encontrado: ", pedidoAceptado);
      let key: string = pedidoAceptado.key;
      delete pedidoAceptado.key;
      pedidoAceptado.estado = 'preparacion';
  
      
      this.baseService.getItems('pedidos').then(ped => {
  
        this.pedidoEnLocal = ped.find(pedido => pedido.id == pedidoDet.id_pedido);
        console.log("Pedido en local: ", this.pedidoEnLocal);
        this.hayPedidoEnLocal = this.pedidoEnLocal != undefined;
        console.log("Hay Pedido en local: ", this.hayPedidoEnLocal);
        
        if (this.hayPedidoEnLocal)
        this.baseService.updateItem('pedidos', key, pedidoAceptado);
      });
  
      this.baseService.getItems('pedidosDelivery').then(ped => {
        this.pedidoDelivery = ped.find(pedido =>  pedido.id == pedidoDet.id_pedido);
        console.log("Pedido Delivery: ", this.pedidoDelivery);
        this.hayPedidoDelivery = this.pedidoDelivery != undefined;
        console.log("Hay Pedido Delivery: ", this.hayPedidoDelivery);
  
        if (this.hayPedidoDelivery)
  
        this.baseService.updateItem('pedidosDelivery', key, pedidoAceptado);
      });
      // this.baseService.updateItem('pedidos', key, pedidoAceptado);
      this.traerPedidosPerfil();
    }
    
    actualizoPedidoFin(pedidoDet) {
     
      // SUMARLE 1 AL CONTADOR DE PEDIDO
      // VERIFICAR SI SON = CON EL cantDet para actualizar con el listoEntrega
      let pedidoAceptado: any = this.listIdPedidosAceptados.find(pedido => pedido.id == pedidoDet.id_pedido);
      console.log("Pedido encontrado: ", pedidoAceptado);
      let key: string = pedidoAceptado.key;
      delete pedidoAceptado.key;
      pedidoAceptado.estado = 'listoEntrega';
  
      this.baseService.getItems('pedidos').then(ped => {
  
        this.pedidoEnLocal = ped.find(pedido => pedido.id == pedidoDet.id_pedido);
        console.log("Pedido en local: ", this.pedidoEnLocal);
        this.hayPedidoEnLocal = this.pedidoEnLocal != undefined;
        console.log("Hay Pedido en local: ", this.hayPedidoEnLocal);
        
        if (this.hayPedidoEnLocal)
        this.baseService.updateItem('pedidos', key, pedidoAceptado);
      });
  
      this.baseService.getItems('pedidosDelivery').then(ped => {
        this.pedidoDelivery = ped.find(pedido =>  pedido.id == pedidoDet.id_pedido);
        console.log("Pedido Delivery: ", this.pedidoDelivery);
        this.hayPedidoDelivery = this.pedidoDelivery != undefined;
        console.log("Hay Pedido Delivery: ", this.hayPedidoDelivery);
  
        if (this.hayPedidoDelivery)
  
        this.baseService.updateItem('pedidosDelivery', key, pedidoAceptado);
      });
      // this.baseService.updateItem('pedidos', key, pedidoAceptado);
      this.traerPedidosPerfil();
    }
  
  terminarPedido(pedidoDet) {
    this.spinner = true;
    console.log("Pedido det: ", pedidoDet) ;
    let pedidoAceptado = pedidoDet ;
    let pedidoKey = pedidoAceptado.key ;

    console.log("Pedido key: ", pedidoDet.key) ;
    
    delete pedidoAceptado.key;
    pedidoAceptado.estado = 'finalizado';
    this.baseService.updateItem('pedidoDetalle', pedidoKey, pedidoAceptado);
    
    this.actualizoPedidoFin(pedidoAceptado);
    setTimeout(() => this.traerPedidosPerfil() , 1300);  
    setTimeout(() => this.traerPedidosActivosPorPerfilTermina(pedidoDet) , 1000);  
  
  }
}
