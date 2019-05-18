import { Injectable } from '@angular/core';
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() { }

  snapshotToArray = snapshot => {
    let returnArray = [];
    snapshot.forEach(element => {
      let item = element.val();
      item.key = element.key;
      returnArray.push(item);
    });
  
    return returnArray;
  }
  
  getItems(nombreReferencia: string){
    return new Promise<any>((resolve, reject) => {
      let ref = firebase.database().ref(nombreReferencia + '/');
      ref.on('value', resp => {
        resolve(this.snapshotToArray(resp));
      });
    });
  }

  addItem(nombreReferencia: string, objeto: any){
    let ref = firebase.database().ref(nombreReferencia + '/');
    let newItem = ref.push();
    newItem.set(objeto);
  }
}
