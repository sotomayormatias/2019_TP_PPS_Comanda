import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.page.html',
  styleUrls: ['./encuesta-cliente.page.scss'],
})
export class EncuestaClientePage implements OnInit {

  conformidad: number = 10;
  destacado: {
    servicio: boolean,
    comida: boolean, 
    bebida: boolean, 
    instalaciones: boolean, 
    atencion: boolean
  } = {
      servicio: false, 
      comida: false, 
      bebida: false, 
      instalaciones: false, 
      atencion: false
    };
  recomienda: string = "si";
  limpieza: string = "impoluto";
  comentarios: string = "";

  constructor(
    private dbService: FirebaseService
  ) { }

  ngOnInit() {
  }

  enviar() {
    // console.log(this.destacado);
    let usuario = JSON.parse(sessionStorage.getItem("usuario")).correo;
    this.dbService.addItem("ecuestasCliente", {
      "conformidad": this.conformidad,
      "destacado": this.destacado,
      "recomienda": this.recomienda,
      "limpieza": this.limpieza,
      "comentarios": this.comentarios,
      "usuario": usuario,
      "fecha": new Date().toLocaleDateString()
    })
  }

}
