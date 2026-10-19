import { ApplicationConfig } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withHashLocation, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { LoadingController, ToastController, Platform, ModalController } from '@ionic/angular/standalone';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { BatteryStatus } from '@awesome-cordova-plugins/battery-status/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { SearchFilterRawPipe } from './pipes/search-filter-raw-pipe';
import { FormatMaskPipe } from './pipes/format-mask-pipe';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Market } from '@awesome-cordova-plugins/market/ngx';
import { DatePipe } from '@angular/common';

import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { InputFormatMaskPipe } from './pipes/input-format-mask.pipe';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { MergeLevel5Pipe } from './pipes/merge-level5-pipe';
// import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideHttpClient() ,
    BarcodeScanner,Geolocation,Device,SpeechRecognition,File,AndroidPermissions,Network,SQLite,Market,FirebaseX,SplashScreen,StatusBar,FileOpener,
    BatteryStatus,NativeAudio,LocationAccuracy,EmailComposer,Camera,MediaCapture,SearchFilterRawPipe,InAppBrowser,
    PhotoViewer, DocumentViewer, FilePath, SocialSharing,ModalController,DatePipe, NativeGeocoder,
    provideRouter(routes, withPreloading(PreloadAllModules),withHashLocation()) ,
    provideClientHydration(withEventReplay()),
    provideIonicAngular({
      innerHTMLTemplatesEnabled: true
    }),InputFormatMaskPipe,  MergeLevel5Pipe // 👈 This makes it safely injectable anywhere!
  ],
};