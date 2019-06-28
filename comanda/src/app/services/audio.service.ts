import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioType: string = 'html5';
  sounds: any = [];
  activo: boolean = true;

  constructor(public nativeAudio: NativeAudio, platform: Platform) {

  }

  public toggleSound() {
    this.activo = !this.activo;
  }

  public preload(key, asset) {
    let audio = {
      key: key,
      asset: asset,
      type: 'html5'
    };
    this.sounds.push(audio);
  }

  public play(key) {
    let audio = this.sounds.find((sound) => {
      return sound.key === key;
    });
    let audioAsset = new Audio(audio.asset);
    if (this.activo) {
      audioAsset.play();
    }
  }
}
