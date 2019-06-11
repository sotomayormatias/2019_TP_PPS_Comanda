import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-encuesta-empleado',
  templateUrl: './encuesta-empleado.page.html',
  styleUrls: ['./encuesta-empleado.page.scss'],
})
export class EncuestaEmpleadoPage implements OnInit {

 

  ordenGeneral: number = 10;
  destacado: {
    puestoTrabajo: boolean,
    comunicacion: boolean, 
    companerismo: boolean, 
    instalaciones: boolean, 
    atencion: boolean
  } = {
      puestoTrabajo: false, 
      comunicacion: false, 
      companerismo: false, 
      instalaciones: false, 
      atencion: false
    };
  recomienda: string = "si";
  limpieza: string = "impoluto";
  comentarios: string = "";
  ingreso: number = 0;

  constructor(
    private dbService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {

  }


  enviar() {
    
    
    let usuario = JSON.parse(sessionStorage.getItem("usuario")).correo;
  
    // ESTOY ENTRANDO 
    if (this.ingreso == 0 ) 
    {
      this.dbService.addItem("encuestasEmpleados", {
        "ordenGeneral": this.ordenGeneral,
        "destacado": this.destacado,
        "recomienda": this.recomienda,
        "limpieza": this.limpieza,
        "comentarios": this.comentarios,
        "usuario": usuario,
        "fecha": new Date().toLocaleDateString(),
        "movimiento": "ENTRADA"
      });
  

      this.router.navigateByUrl('/home');
      this.ingreso = this.ingreso + 1;
      this.comentarios = "";

    }
    else 
    {
      this.dbService.addItem("encuestasEmpleados", {
        "ordenGeneral": this.ordenGeneral,
        "destacado": this.destacado,
        "recomienda": this.recomienda,
        "limpieza": this.limpieza,
        "comentarios": this.comentarios,
        "usuario": usuario,
        "fecha": new Date().toLocaleDateString(),
        "movimiento": "SALIDA"
      });
  
      this.router.navigateByUrl('/');
      this.ingreso = 0;
    }
    
    
    
  }

}

