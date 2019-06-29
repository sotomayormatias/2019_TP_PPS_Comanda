import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from "@ionic-native/camera/ngx";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { FirebaseService } from "../app/services/firebase.service";
import { AudioService } from "../app/services/audio.service";
import { FormsModule } from '@angular/forms';
import { Calendar } from "@ionic-native/calendar/ngx";
import { NativeAudio } from "@ionic-native/native-audio/ngx";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalPagePageModule } from './modal-page/modal-page.module';
import { ModalPedidoPageModule } from "./modal-pedido/modal-pedido.module";
import { ModalRutaPageModule } from "./modal-ruta/modal-ruta.module";
import { FCM } from '@ionic-native/fcm/ngx';
import {HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    
    HttpModule,
    HttpClientModule,

    ModalPagePageModule,
    ModalPedidoPageModule,
    ModalRutaPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseService,
    AudioService,
    Camera,
    Calendar,
    BarcodeScanner,
    EmailComposer,
    FCM,
    NativeAudio,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
