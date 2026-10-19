import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-change-server-setting',
  templateUrl: './change-server-setting.page.html',
  styleUrls: ['./change-server-setting.page.scss'],
})
export class ChangeServerSettingPage implements OnInit {

  authPinForm: FormGroup;

  constructor(public navCtrl: NavController, private fb: FormBuilder,private location: Location, 
              public globalObjects: GlobalObjectsService, private router: Router, public modalCtrl: ModalController) {
                this.authPinForm = this.fb.group({
                  authPin: [null, Validators.compose([Validators.required])]
                });
                if(this.globalObjects.pagesFlag){
                  return applyLoggingDecorator(this,"changeServerSetting")
                }
              }

  ngOnInit() {}

  async checkAuthPin(value) {
    if (value.authPin === '007') {
      const serverSettingModal = await this.modalCtrl.create({
        component: 'ChangeServerSettingPage',
        componentProps: { paramValue: '' }
      });
      serverSettingModal.onDidDismiss().then(fieldsData => {
        this.navCtrl.navigateRoot('LoginPage');
      });
      await serverSettingModal.present();
    } else {
      this.globalObjects.displayCordovaToast('setting saved successfully');
      this.navCtrl.navigateRoot('LoginPage');
    }
  }

  cancelPage() {
    this.navCtrl.pop();
  }
  
  goBack() {
    this.location.back();
  }

  changeAppKey() {
    this.router.navigate(['appkey-validation']);
  }

  appCollectionPage() {
    this.router.navigate(['appkey-collection']);
  }

}
