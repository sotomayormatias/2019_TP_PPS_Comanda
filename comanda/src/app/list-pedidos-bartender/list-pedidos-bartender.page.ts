import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { PickerController } from '@ionic/angular';
import { PickerOptions, PickerButton } from '@ionic/core';

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
  TEstimado = '';
  selected = ['', '', ''];
  hayLista: any;

  tpedido: any ;
  pedidoEnLocal: any = null;
  pedidoDelivery: any = null;
  pedidoDetalle: any[] = [];
  hayPedidoDelivery: boolean = false;
  hayPedidoEnLocal: boolean = false;

  
  constructor(private baseService: FirebaseService,
              private pickerCtrl: PickerController) { 
  }

  ngOnInit() {
    this.traerPedidosPerfilBar();
    // this.traerProductosPerfilBar();
    // this.traerPedidosActivosPorPerfilBar();
  }

  ionRefresh(event) {
    // console.log('Pull Event Triggered!');
    setTimeout(() => {
      // console.log('Async operation has ended');

      // complete()  signify that the refreshing has completed and to close the refresher
      event.target.complete();
      this.pedidosMostrarBarFil = [];
      this.listIdPedidosAceptadosBar = null ;
      this.listProductosBar  = [];
      this.traerPedidosPerfilBar();
    }, 2000);
    }
    ionPull(event) {
      // Emitted while the user is pulling down the content and exposing the refresher.
      // console.log('ionPull Event Triggered!');
     
    }
    ionStart(event) {
      // Emitted when the user begins to start pulling down.
      // console.log('ionStart Event Triggered!');
      // this.pedidosMostrarBarFil = [];
      // this.listIdPedidosAceptadosBar = null ;
      // this.listProductosBar  = [];
      // this.traerPedidosPerfilBar();
    }


  async traerProductosPerfilBar() {
    // TRAIGO PEDIDOS Y ME QUEDO CON LOS ACEPTADOS
    await this.baseService.getItems('productos').then(async prod => {
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
      // localStorage.removeItem("listProductosBar"); 
      // localStorage.setItem("listProductosBar", JSON.stringify(this.listProductosBar) ); 
      // await this.traerPedidosPerfilBar();
      // console.log("List Productos: ", this.listProductosBar);
    });
    await this.traerPedidosActivosPorPerfilBar();  
  }

  async traerPedidosPerfilBar() {

    this.pedidosMostrarBar = [] ; 

   
    await this.baseService.getItems('pedidos').then(ped => {
    
      this.pedidos = ped;
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "aceptado" || pedido.estado == "preparacion"  );
      this.listIdPedidosAceptadosBar =  this.pedidos;
      // console.log("Dentro de pedidos");
    });

    // console.log("Despues de pedidos");
    // console.log("listIdPedidosAceptadosBar: " , this.listIdPedidosAceptadosBar);


    await this.baseService.getItems('pedidosDelivery').then(ped => {

      this.pedidos = ped;
      
      this.pedidos = this.pedidos.filter(pedido => pedido.estado == "aceptado" || pedido.estado == "preparacion"  );
      
      this.pedidos.forEach(pedido =>  {
        pedido.delivery = true ;
        this.listIdPedidosAceptadosBar.push(pedido) ;
      } );
      // console.log("Pedidos Aceptados2: ", this.listIdPedidosAceptadosBar);
      // console.log("Dentro de pedidos Delivery");
    });

    // console.log("Despues de pedidos delivery");

    // RECORRO DETALLE DE PEDIDOS POR ID
    await this.baseService.getItems('pedidoDetalle').then(detalle => {
      
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
                  'tiempo': producto.tiempo,
                  'delivery': idDetalle.delivery,
                  'key': producto.key
                };
                // INSERTO EN EL ARRAY LOS PEDIDOS PENDIENTES
                this.pedidosMostrarBar.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
              }
            }
          );
        });
      // localStorage.removeItem("listaPedidosAceptadosBar"); 
      // localStorage.setItem("listaPedidosAceptadosBar", JSON.stringify(this.pedidosMostrarBar) );  
     
      // console.log("Dentro de pedidos detalle");
    });

    // console.log("Despues de pedidos detalle");
    await this.traerProductosPerfilBar();  
    
  }

    traerPedidosActivosPorPerfilBar() {
      this.pedidosMostrarBarFil = [];

      // let listaRecorre = localStorage.getItem("listaPedidosAceptadosBar").toString();

      // let listaProductos = localStorage.getItem("listProductosBar");
      let listaRecorre = JSON.stringify(this.pedidosMostrarBar).toString();
      
      let listaProductos = JSON.stringify(this.listProductosBar);
      let listaProductosParsed = JSON.parse(listaProductos);

      

      JSON.parse(listaRecorre).forEach(idDetalle => {

       

        for (const iterator of listaProductosParsed) {
          if ( idDetalle.producto == iterator ) {
            
              let idRecortado = idDetalle.id_pedido.toString() ;
              idRecortado = idRecortado.substr(10, idDetalle.id_pedido.length );
                  // tslint:disable-next-line:variable-name
              let pedido_detalle = {
                    'id_pedido': idDetalle.id_pedido ,
                    'idRecortado': idRecortado,
                    'producto': idDetalle.producto,
                    'precio': idDetalle.precio,
                    'cantidad': idDetalle.cantidad,
                    'estado': idDetalle.estado,
                    'tiempo': idDetalle.tiempo,
                    'delivery': idDetalle.delivery,
                    'key': idDetalle.key
                  };
                  // console.log("Pedido detalle: ", pedido_detalle);
              this.pedidosMostrarBarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                }
              

              }
        });
      this.spinner = false;

      // console.log("Lista Filtrada: ", this.pedidosMostrarBarFil);
      // console.log("Lista Recorre pedidosMostrarBar: ", listaRecorre );
      // console.log("Lista Recorre listaProductosParsed: ", listaProductosParsed ); 
      // VEO SI HAY PEDIDOS O NO
      if (this.pedidosMostrarBarFil.length == 0) {
          this.hayLista = false;
        } else {
          this.hayLista = true;
        }
        
      }
    


    traerPedidosActivosPorPerfilBarPrepara(pedidoDet) {

        this.pedidosMostrarBarFil = [];
        // let listaRecorre = localStorage.getItem("listaPedidosAceptadosBar").toString();
        let listaRecorre = JSON.stringify(this.pedidosMostrarBar).toString();
        let listaProductos = JSON.stringify(this.listProductosBar);
        // let listaProductos = localStorage.getItem("listProductosBar");
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
                      'delivery': idDetalle.delivery,
                      'tiempo': this.TEstimado ,
                      'key': idDetalle.key
                    };
                    // console.log("Pedido detalle modificado: ", pedido_detalle);
                    this.pedidosMostrarBarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
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
                    // console.log("Pedido detalle: ", pedido_detalle);
                    this.pedidosMostrarBarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                  }
  
                }
          });
        this.spinner = false;
        // console.log("Lista Prepara: ", this.pedidosMostrarBarFil);
        this.traerPedidosPerfilBar();
        }

        traerPedidosActivosPorPerfilBarTermina(pedidoDet) {

          this.pedidosMostrarBarFil = [];
          // let listaRecorre = localStorage.getItem("listaPedidosAceptadosBar").toString();
    
          let listaRecorre = JSON.stringify(this.pedidosMostrarBar).toString();
          let listaProductos = JSON.stringify(this.listProductosBar);

          // let listaProductos = localStorage.getItem("listProductosBar");
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
                      // console.log("Pedido detalle modificado: ", pedido_detalle);
                      this.pedidosMostrarBarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
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
                      // console.log("Pedido detalle: ", pedido_detalle);
                      this.pedidosMostrarBarFil.push( JSON.parse(JSON.stringify(pedido_detalle))   ); 
                    }
    
                  }
            });
          this.spinner = false;
          // console.log("Lista Prepara: ", this.pedidosMostrarBarFil);
          this.traerPedidosPerfilBar();
          }

  // GESTION
  prepararPedido(pedidoDet) {
    this.spinner = true;
    // console.log("Pedido det: ", pedidoDet) ;
    let pedidoAceptado = pedidoDet ;
    let pedidoKey = pedidoAceptado.key ;

    // console.log("Pedido key: ", pedidoDet.key) ;
    
    delete pedidoAceptado.key;
    pedidoAceptado.tiempo = this.TEstimado;
    pedidoAceptado.estado = 'preparacion';
    this.baseService.updateItem('pedidoDetalle', pedidoKey, pedidoAceptado);

    this.TEstimado = '';
    this.actualizoPedido (pedidoDet);
    // this.traerPedidosPerfilBar();
    // setTimeout(() => this.traerPedidosPerfilBar() , 1300);  
    // setTimeout(() => this.traerPedidosActivosPorPerfilBarPrepara(pedidoDet) , 1000); 
  }

  async actualizoPedido(pedidoDet) {
    // console.log("PedidoDet: ", pedidoDet);
    // console.log("Lista Aceptados: ", this.listIdPedidosAceptadosBar);
    let pedidoAceptado: any = this.listIdPedidosAceptadosBar.find(pedido => pedido.id == pedidoDet.id_pedido);
    // console.log("Pedido encontrado: ", pedidoAceptado);
    let key: string = pedidoAceptado.key;
    delete pedidoAceptado.key;
    
    // pedidoAceptado.cantEnt += 1;

    // if (pedidoAceptado.cantEnt == pedidoAceptado.cantDet ) {
    //   pedidoAceptado.estado = 'listoEntrega';
    // } else {
    pedidoAceptado.estado = 'preparacion';
    // }
    
    

    
    await this.baseService.getItems('pedidos').then(ped => {

      this.pedidoEnLocal = ped.find(pedido => pedido.id == pedidoDet.id_pedido);
      // console.log("Pedido en local: ", this.pedidoEnLocal);
      this.hayPedidoEnLocal = this.pedidoEnLocal != undefined;
      // console.log("Hay Pedido en local: ", this.hayPedidoEnLocal);
      
      if (this.hayPedidoEnLocal)
      this.baseService.updateItem('pedidos', key, pedidoAceptado);
    });

    await this.baseService.getItems('pedidosDelivery').then(ped => {
      this.pedidoDelivery = ped.find(pedido =>  pedido.id == pedidoDet.id_pedido);
      // console.log("Pedido Delivery: ", this.pedidoDelivery);
      this.hayPedidoDelivery = this.pedidoDelivery != undefined;
      // console.log("Hay Pedido Delivery: ", this.hayPedidoDelivery);

      if (this.hayPedidoDelivery)

      this.baseService.updateItem('pedidosDelivery', key, pedidoAceptado);
    });
    // this.baseService.updateItem('pedidos', key, pedidoAceptado);
    this.pedidosMostrarBarFil = [];
    this.listIdPedidosAceptadosBar = null ;
    this.listProductosBar  = [];
    this.traerPedidosPerfilBar();
  }
  
  async actualizoPedidoFin(pedidoDet) {
    // console.log("PedidoDet: ", pedidoDet);
    // console.log("Lista Aceptados: ", this.listIdPedidosAceptadosBar);
    // SUMARLE 1 AL CONTADOR DE PEDIDO
    // VERIFICAR SI SON = CON EL cantDet para actualizar con el listoEntrega
    let pedidoAceptado: any = this.listIdPedidosAceptadosBar.find(pedido => pedido.id == pedidoDet.id_pedido);
    // console.log("Pedido encontrado: ", pedidoAceptado);
    let key: string = pedidoAceptado.key;
    delete pedidoAceptado.key;
    
    pedidoAceptado.cantEnt += 1;

    // if (pedidoAceptado.cantEnt == pedidoAceptado.cantDet ) {
    //   pedidoAceptado.estado = 'listoEntrega';
    // } 

    if (pedidoAceptado.cantEnt == pedidoAceptado.cantDet ) {
      pedidoAceptado.estado = 'listoEntrega';
    } else {
      pedidoAceptado.estado = 'preparacion';
    }

    await this.baseService.getItems('pedidos').then(ped => {

      this.pedidoEnLocal = ped.find(pedido => pedido.id == pedidoDet.id_pedido);
      // console.log("Pedido en local: ", this.pedidoEnLocal);
      this.hayPedidoEnLocal = this.pedidoEnLocal != undefined;
      // console.log("Hay Pedido en local: ", this.hayPedidoEnLocal);
      
      if (this.hayPedidoEnLocal)
      this.baseService.updateItem('pedidos', key, pedidoAceptado);
    });

    await this.baseService.getItems('pedidosDelivery').then(ped => {
      this.pedidoDelivery = ped.find(pedido =>  pedido.id == pedidoDet.id_pedido);
      // console.log("Pedido Delivery: ", this.pedidoDelivery);
      this.hayPedidoDelivery = this.pedidoDelivery != undefined;
      // console.log("Hay Pedido Delivery: ", this.hayPedidoDelivery);

      if (this.hayPedidoDelivery)

      this.baseService.updateItem('pedidosDelivery', key, pedidoAceptado);
    });
    // this.baseService.updateItem('pedidos', key, pedidoAceptado);
    this.pedidosMostrarBarFil = [];
    this.listIdPedidosAceptadosBar = null ;
    this.listProductosBar  = [];
    this.TEstimado = '';
    this.traerPedidosPerfilBar();
  }

  terminarPedido(pedidoDet) {
    this.spinner = true;
    // console.log("Pedido det: ", pedidoDet) ;
    let pedidoAceptado = pedidoDet ;
    let pedidoKey = pedidoAceptado.key ;

    // console.log("Pedido key: ", pedidoDet.key) ;
    
    delete pedidoAceptado.key;
    pedidoAceptado.estado = 'finalizado';
    this.baseService.updateItem('pedidoDetalle', pedidoKey, pedidoAceptado);

   
    this.actualizoPedidoFin(pedidoAceptado);
    // setTimeout(() => this.traerPedidosPerfilBar() , 1300);  
    // setTimeout(() => this.traerPedidosActivosPorPerfilBarTermina(pedidoDet) , 1000);  
    
  }

}
