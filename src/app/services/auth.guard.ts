import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Events } from './events';
import { GlobalObjectsService } from './global-objects.service';
import { applyLoggingDecorator } from './decorator-application';
import { NavController } from '@ionic/angular/standalone';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private globalObject: GlobalObjectsService,
    private events: Events,
    private navCtrl: NavController,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.globalObject.serviceFlag) {
      return applyLoggingDecorator(this, "auth-gard-service")
    }
  }

  // canActivate(): boolean {
  //   // Return true on server-side rendering to avoid browser API calls
  //   if (isPlatformServer(this.platformId)) {
  //     return true;
  //   }

  //   // Only attempt to access browser APIs when on browser platform
  //   if (!isPlatformBrowser(this.platformId)) {
  //     return false;
  //   }

  //   try {
  //     let user = this.globalObject.getLocallData("userDetails");
  //     let loginflag = this.globalObject.getLocallData("loginFlag");
  //     let ssoFlag = this.globalObject.getLocallData("ssoAppFlag");

  //     if (ssoFlag == "true") {
  //       this.navCtrl.navigateRoot('logout-sso');
  //       return false;
  //     }
  //     else if (user && loginflag) {
  //       return true;
  //     } else {
  //       this.events.publish("logOut");
  //       this.router.navigateByUrl('/appkey-validation', { replaceUrl: true });
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error('AuthGuard error:', error);
  //     this.events.publish("logOut");
  //     this.router.navigateByUrl('/appkey-validation', { replaceUrl: true });
  //     return false;
  //   }
  // }

  
  canActivate(): boolean  {
    let user = this.globalObject.getLocallData("userDetails");
    let loginflag = this.globalObject.getLocallData("loginFlag");
    let ssoFlag=this.globalObject.getLocallData("ssoAppFlag");
    if(ssoFlag=="true"){
      this.navCtrl.navigateRoot('logout-sso');

    }
    else if(user && loginflag){
      return true;
    }else{
      this.events.publish("logOut");
      return false;
    }
   }

}
