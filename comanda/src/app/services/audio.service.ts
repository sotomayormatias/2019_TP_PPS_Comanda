import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioType: string = 'html5';
  sounds: any = [];

  constructor(public nativeAudio: NativeAudio, platform: Platform) {
    // if (platform.is('cordova')) {
    //   this.audioType = 'native';
    // }
  }

  public preload(key, asset) {
    // if (this.audioType === 'html5') {
      let audio = {
        key: key,
        asset: asset,
        type: 'html5'
      };
      this.sounds.push(audio);
    // } else {
    //   this.nativeAudio.preloadSimple(key, asset);
    //   let audio = {
    //     key: key,
    //     asset: asset,
    //     type: 'native'
    //   };
    //   this.sounds.push(audio);
    // }
  }

  public play(key) {
    // console.log("key: " + key)
    let audio = this.sounds.find((sound) => {
      return sound.key === key;
    });
    // console.log("sounds: " + JSON.stringify(this.sounds));
    // if (audio.type === 'html5') {
      let audioAsset = new Audio(audio.asset);
      audioAsset.play();
    // } else {
    //   this.nativeAudio.play(audio.key).then((res) => {
    //     console.log(res);
    //   }, (err) => {
    //     console.log(err);
    //   });
    // }
  }
}
