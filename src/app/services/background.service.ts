import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from './global-objects.service';
import { DataService } from './data.service';
import { applyLoggingDecorator } from './decorator-application';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  public isTracking: boolean = false;
  public data: any = [];
  public dataTosend: any = [];
  public appVersion: any = "1.1:20200406";
  public activity = "Fore Ground";

  public timestamp: any = "";
  longitude: any;
  latitude: any;
  message: any;
  batteryLevel: any;
  deviceId = '';
  deviceName = '';


  interval: any;
  intervalTimeout: number = 60;
  count: number = 1;
  l_obj: any;
  appStateListener: any;

  backgroundInterval: any;
  foregroundInterval: any;
  // userCode: string;
  userDetails: any;
  bgmode: boolean = false;

  constructor(public http: HttpClient,
    private toastCtrl: ToastController, public platform: Platform,
    private dataService: DataService, public globalObjects: GlobalObjectsService) {

    // this.gpsEntry();
    if(this.globalObjects.serviceFlag){
      return applyLoggingDecorator(this,"background-service")
    }
  }

  ngOnInit() {
    this.initializeDeviceContext();
    this.updateBatteryLevel();
    this.getLocation();
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  async initializeDeviceContext() {
    try {
      const [id, info] = await Promise.all([Device.getId(), Device.getInfo()]);
      this.deviceId = id.identifier || '';
      this.deviceName = info.model || info.name || 'unknown';
    } catch {
      this.deviceId = 'unknown';
      this.deviceName = 'unknown';
    }
  }

  async updateBatteryLevel() {
    try {
      const info = await Device.getBatteryInfo();
      this.batteryLevel = typeof info.batteryLevel === 'number' ? Math.round(info.batteryLevel * 100) : '';
    } catch {
      this.batteryLevel = '';
    }
  }

  startgpsEntry() {
    this.isTracking = true;
    this.gpsEntry();
  }

  endgpsEntry() {
    this.stop();
  }

  start(interval_time:any) {
    this.globalObjects.setDataLocally("locationTrackingStarted", true);
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.intervalTimeout = interval_time;

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.globalObjects.getLocallData('locationTrackingStarted') == true ? this.runAtInterval() : '';
    }, this.intervalTimeout * 60 * 1000);

    if (!this.appStateListener) {
      App.addListener('appStateChange', ({ isActive }) => {
        this.activity = isActive ? 'Fore Ground' : 'Back Ground';
        if (!isActive && this.globalObjects.getLocallData('locationTrackingStarted') == true) {
          this.runAtInterval();
        }
      }).then((listener) => {
        this.appStateListener = listener;
      });
    }

    this.isTracking = true;
  }


  moveToBackgroundLTStart() {
    this.activity = 'Back Ground';
  }

  gpsEntry() {
    this.getLocation();

    clearInterval(this.backgroundInterval);
    clearInterval(this.foregroundInterval);
    this.backgroundInterval = setInterval(() => {
      if (this.globalObjects.getLocallData('locationTrackingStarted') == true) {
        this.runAtInterval();
      }
    }, 20000);

  }


  runAtInterval() {
    this.updateBatteryLevel();

    if (this.latitude && this.longitude) {
      this.dataTosend.push({
        date: new Date().getTime(),
        "activity": this.activity,
        timestamp: this.timestamp,
        latitude: this.latitude,
        longitude: this.longitude,
        message: this.message,
        appVersion: this.appVersion,
        batteryLevel: this.batteryLevel
      });
      this.sendToserver();
      this.getLocation();
    } else {
      var options = {
        enableHighAccuracy: true,
        timeout: (this.intervalTimeout * 60 * 1000 / 2) / 2,
        //timeout: 5000

      };
      // let geo_object: any = {};
      Geolocation.getCurrentPosition(options as any).then((pos) => {
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
        this.timestamp = pos.timestamp;
        this.message = "geoLocation";
        // alert(pos);
        this.dataTosend.push({
          date: new Date().getTime(),
          "activity": this.activity,
          timestamp: this.timestamp,
          latitude: this.latitude,
          longitude: this.longitude,
          message: this.message,
          appVersion: this.appVersion,
          batteryLevel: this.batteryLevel
        });
        this.sendToserver();
        this.getLocation();
      }).catch((error) => {

        var options = {
          enableHighAccuracy: true,
          timeout: ((this.intervalTimeout * 60 * 1000 / 2) - 5),
          maximumAge: 36000
        };
        navigator.geolocation.getCurrentPosition(position => {

          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.timestamp = position.timestamp;
          this.message = "navigator.geolocation"

          this.dataTosend.push({
            date: new Date().getTime(),
            "activity": this.activity,
            timestamp: this.timestamp,
            latitude: this.latitude,
            longitude: this.longitude,
            message: this.message,
            appVersion: this.appVersion,
            batteryLevel: this.batteryLevel
          });
          this.sendToserver();
          this.getLocation();

        }, () => { }, options)
      });
    }

  }

  sendToserver() {

    if (this.dataTosend.length > 0) {
      let reqData: any = {};
      reqData.dataTosend = this.dataTosend;
      let url = "Apptracking?deviceId=" + encodeURIComponent(this.deviceId || 'unknown') + "&deviceName=" + encodeURIComponent(this.deviceName || 'unknown')
        + "&seqNo=108&userCode=" + this.userDetails.user_code + "&dataTosend=" + encodeURIComponent(JSON.stringify(this.dataTosend));

      this.dataService.postData(url, reqData).then(res => {
        let resobj: any = res;
        if (resobj.status == 'success') {
          this.dataTosend = [];
        }
      }).catch(err => {
      })
    }
  }

  async displayToast(msg:any) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  stop() {
    this.globalObjects.setDataLocally("locationTrackingStarted", false);
    clearInterval(this.interval);
    clearInterval(this.backgroundInterval);
    clearInterval(this.foregroundInterval);
    if (this.appStateListener?.remove) {
      this.appStateListener.remove();
      this.appStateListener = undefined;
    }
    this.isTracking = false;
  }

  getLocation() {
    var options = {
      enableHighAccuracy: true,
      timeout: (this.intervalTimeout * 60 * 1000 / 2) / 2,
    };
    Geolocation.getCurrentPosition(options as any).then((pos) => {
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
      this.timestamp = pos.timestamp;
      this.message = "geoLocation";
    }).catch((error) => {

      this.latitude = "";
      this.longitude = "";
      this.timestamp = "";
      this.message = error.message;
      this.getNavigator();
    });
  }

  getNavigator() {
    var options = {
      enableHighAccuracy: true,
      timeout: ((this.intervalTimeout * 60 * 1000 / 2) - 5),
      maximumAge: 36000
    };
    navigator.geolocation.getCurrentPosition(position => {

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.timestamp = position.timestamp;
      this.message = "navigator.geolocation"

    }, () => { }, options)
  }

}

