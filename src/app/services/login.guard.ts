import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalObjectsService } from './global-objects.service';
import { NavController } from '@ionic/angular/standalone';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private globalObject: GlobalObjectsService,
    private navCtrl: NavController,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    // Only attempt to access browser APIs when on browser platform
    if (!isPlatformBrowser(this.platformId)) {
      return true; // Allow access on non-browser platforms
    }

    try {
      let user = this.globalObject.getLocallData("userDetails");
      let ssoFlag = this.globalObject.getLocallData("ssoAppFlag");

      if (ssoFlag == "true") {
        this.navCtrl.navigateRoot('logout-sso');
        return false;
      }
      else if (user) {
        // User is logged in, redirect to main app
        this.router.navigateByUrl('/super', { replaceUrl: true });
        return false;
      } else {
        // No user, allow access to login page
        return true;
      }
    } catch (error) {
      console.error('LoginGuard error:', error);
      // On error, allow access to login page as fallback
      return true;
    }
  }

}
