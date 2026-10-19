import { DatePipe, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular/standalone';
import { ChangePasswordPage } from 'src/app/pages/change-password/change-password.page';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  userDetails: any;
  userInitials = "";
  userLoginDate = "";
  popoverdismiss: boolean = true;

  constructor(public globalObjects: GlobalObjectsService, private modalController: ModalController, private router: Router, private events: Events, public lhs_lib: LhsLibService,
    private datePipe: DatePipe, private canvasModal: CanvasModalService,private sqlServ: SqlLiteService,@Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.userInitials;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    const rawSysDate = this.globalObjects.sysdateTime;
    this.globalObjects.sysdateTime = this.datePipe.transform(rawSysDate, "dd-MMM-yyyy hh:mm:ss a");
    console.log(this.userDetails);
    let a = this.userDetails.first_login_time;
    this.userDetails.first_login_time_formatted = this.datePipe.transform(a, 'yyyy-MM-dd HH:mm:ss');
    this.getUserInitials();
    if (this.globalObjects.frameFlag) {
      return applyLoggingDecorator(this, "user-login")
    }
  }

  ngOnInit() { }

  loginTIme() {
    let a = this.userDetails.first_login_time;
    let b = new Date(a);
  }

  logout() {
    this.globalObjects.fabMannualMode = false;
    this.globalObjects.notiBellMannualMode = false;
    // this.sqlServ.deleteDatabase();
    // this.globalObjects.destroyLocalData("dbId");
    this.events.publish("logOut");
    this.modalController.dismiss();
              if (isPlatformServer(this.platformId)) return;
    window.location.reload();
    this.popDismiss();
  }

  async openChangePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordPage,
    });
    modal.onDidDismiss().then(() => {
    });
    return await modal.present();
  }

  ChangeLoginParameter() {
    if (this.lhs_lib.dynamicTabs.length == 0) {
      // this.router.navigate(['usersetting'])
      // this.popDismiss()
      this.popoverdismiss = false;
      this.canvasModal.popDismiss("ChangeLoginParameter")
    } else {
      alert("Please closed all tabs before change login parameter.")
    }

  }
  async ChangepasswordLinks() {
    this.canvasModal.popDismiss("ChangepasswordLinks")
    //  let id = 'offcanvasRightChangepasswordlink';
    //   let cssClass = 'offcanvasRight';
    //   let title = ""
    //   let componentProps = {
    //     test: "Change password"
    //   }
    //   await this.canvasModal.openoffCanvas(ChangePasswordPage, componentProps, id, cssClass, title)
  }
  getUserInitials() {
    let name = this.userDetails.wma_user_name;
    // let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
    // let initials: any = [...name.matchAll(rgx)] || [];
    let rgx = /(\p{L})\p{L}+/gu;
    let initials:any = [...(name?.matchAll(rgx) ?? [])];
    initials = (
      (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase();
    console.log(initials);
    this.userInitials = initials;

    this.setUserLoginDateFormat();
  }
  setUserLoginDateFormat() {
    // formatDate
    let stringDate = this.userDetails.first_login_time_formatted
    this.userLoginDate = this.globalObjects.formatDate(stringDate, "dd-MMM-yyyy hh:mm:ss a");
  }

  popDismiss() {
    this.popoverdismiss = false;
    this.canvasModal.popDismiss("")
  }
  ngOnDestroy() {
    console.clear()
  }
  resetLocalDb() {
    this.sqlServ.deleteAllObject();
    this.canvasModal.popDismiss("resetLocalDb")
  }
}
