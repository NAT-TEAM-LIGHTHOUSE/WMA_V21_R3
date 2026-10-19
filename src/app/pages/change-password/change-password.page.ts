import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { EncryptionService } from 'src/app/services/encryption.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { environment } from 'src/environments/environment';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,STANDALONE_IMPORTS]
})
export class ChangePasswordPage implements OnInit {

showPassword = false;
password = '';
passwordComplexity :any;
  user: any = {};
  userDetails: any;
  today =  new Date();
  // events: any;
  constructor(private encryption : EncryptionService,
    public platform :Platform, private router: Router,private events : Events,private globalObjects : GlobalObjectsService, private dataService: DataService, private globalService: GlobalObjectsService,
     public modalController: ModalController) {
    // this.userDetails = globalService.getLocallData('userDetails');

    if(this.globalService.pagesFlag){
      return applyLoggingDecorator(this,"Change-Password")
    }
  }

  ngOnInit() {
    this.userDetails = this.globalObjects.getLocallData('userDetails');
    this.validateUser();
    console.log(this.userDetails);
  }

  closePage() {
    this.modalController.dismiss();
  }
  //  changePassword(user) {
  //   if(user.newPassword && user.cnfPassword && user.oldPassword){
  //     if (user.newPassword != user.cnfPassword) {
  //       this.globalService.presentAlert('New password and confirm password is not matching!');
  //     } else {
  //       user.login_acc_code = this.userDetails.login_acc_code;
  //       user.userFlag = this.userDetails.login_user_flag;
  //       user.user_type = this.userDetails.user_type;
  //       user.wma_user_code = this.userDetails.wma_user_code;
  //       user.actual_code = this.userDetails.actual_code;
  //       var data = {
  //         "parameters": user
  //       }
  //       let url = "changePassword";
  //       this.dataService.postData(url, data).then(async (res) => {
  //         let data: any = res;
  //         let status = data.responseMsg.split('#')[0];
  //         await this.globalService.presentAlert(data.responseMsg);
  //         if(status != 'Q'){
  //           this.modalController.dismiss();
  //         }
  //       })
  
  //     }
  //   }
  //   else {
  //     let tot = this.today.getDate() + this.today.getMonth() + 1 ;
  //     if(parseInt(user.oldPassword) != NaN){
  //       if(tot == parseInt(user.oldPassword) && (!environment.production)){
  //         this.globalService.toggleDevloperModePro = !this.globalService.toggleDevloperModePro;
  //         this.modalController.dismiss();
  //       }else{
  //         this.globalService.presentAlert("Please enter all details...");
  //       }
  //     }else{
  //       this.globalService.presentAlert("Please enter all details...");
  //     }
  //   }
  // }

validateUser(){
  let url; 
    let appKey = "";
    if (this.globalObjects.simpleLoginProcess) {
      appKey = this.globalObjects.getLocallData("appKey");
    } else {
      appKey = this.globalObjects.getLocallData("parentAppkey");
    }



    let value = this.userDetails.user_code;
// let appKey = this.globalObjects.getLocallData("appKey");;
        url = 'validateUserID?userId=' + value + '&appKey=' + appKey;

         this.dataService.getData(url).then(async (data: any) => {
      
      console.log(data);

      if (data.responseStatus == "success") {
   if (data.responseMsg.includes("#PC")) {
  this.passwordComplexity = 'complex';
} else if (data.responseMsg.includes("#PS")) {
  this.passwordComplexity = 'simple';
}
console.log("Password Complexity:", this.passwordComplexity);
        // this.sendPassword(); 
      }
    });
    
  }


passwordErrors = {
  old: '',
  new: '',
  confirm: ''
};

// validatePasswordFields() {
//   if(this.passwordComplexity === 'complex'){
//   const { oldPassword, newPassword, cnfPassword } = this.user;
//   this.passwordErrors = { old: '', new: '', confirm: '' };

//   if (!oldPassword) {
//     this.passwordErrors.old = 'Old password is required.';
//   }

//   if (!newPassword) {
//     this.passwordErrors.new = 'New password is required.';
//   } else {
//     if (newPassword.length < 8) {
//       this.passwordErrors.new = 'Password must be at least 8 characters long.';
//     // } else if (!/[A-Z]/.test(newPassword)) {
//     //   this.passwordErrors.new = 'Password must contain an uppercase letter.';
//     // } else if (!/[a-z]/.test(newPassword)) {
//     //   this.passwordErrors.new = 'Password must contain a lowercase letter.';
//     } else if (!/[\d\W]/.test(newPassword)) {
//       this.passwordErrors.new = 'Password must contain a number or special character.';
//     } else if (newPassword === oldPassword) {
//       this.passwordErrors.new = 'New password must be different from old password.';
//     }
//   }

//   // if (!cnfPassword) {
//   //   this.passwordErrors.confirm = 'Please confirm your password.';
//   // } else if (newPassword !== cnfPassword) {
//   //   this.passwordErrors.confirm = 'Passwords do not match.';
//   // }
// }

// }
validatePasswordFields() {
  if (this.passwordComplexity === 'complex') {
    const { oldPassword, newPassword, cnfPassword } = this.user;
    this.passwordErrors = { old: '', new: '', confirm: '' };

    if (!oldPassword) {
      this.passwordErrors.old = 'Old password is required.';
    }

    if (!newPassword) {
      this.passwordErrors.new = 'New password is required.';
    } else {
      if (newPassword.length < 8) {
        this.passwordErrors.new = 'Password must be at least 8 characters long.';
      } else if (!/[\d\W]/.test(newPassword)) {
        this.passwordErrors.new = 'Password must contain a number or special character.';
      } else if (newPassword === oldPassword) {
        this.passwordErrors.new = 'New password must be different from old password.';
      }
    }
    // Add confirm password validation if needed
  } else {
    // If not complex, clear errors and skip validation
    this.passwordErrors = { old: '', new: '', confirm: '' };
  }
}
  changePassword(user) {
    console.log(user)
    // this.validatePasswordFields();
      if (this.passwordErrors.old || this.passwordErrors.new || this.passwordErrors.confirm) {
    return;
  }
  if (user.newPassword && user.cnfPassword && user.oldPassword) {
        // const password = user.newPassword;

    // const validations = [
    //   { valid: password.length >= 6, msg: 'Password must be at least 6 characters long.' },
    //   // { valid: /[A-Z]/.test(password), msg: 'Password must contain at least one uppercase letter.' },
    //   // { valid: /[a-z]/.test(password), msg: 'Password must contain at least one lowercase letter.' },
    //   { valid: /[\d\W]/.test(password), msg: 'Password must contain at least one number or special character.' },
    //   { valid: password === user.cnfPassword, msg: 'New password and confirm password do not match.' },
    //   { valid: user.oldPassword !== password, msg: 'New password must be different from old password.' }
    // ];

    // for (const v of validations) {
    //   if (!v.valid) {
    //     this.globalService.presentAlert(v.msg);
    //     return;
    //   }
    // }
    user.login_acc_code = this.userDetails.login_acc_code;
    user.userFlag = this.userDetails.login_user_flag;
    user.user_type = this.userDetails.user_type;
    user.wma_user_code = this.userDetails.wma_user_code;
    user.actual_code = this.userDetails.actual_code;
    user.oldPassword = this.encryption.encryptData(user.oldPassword);
    user.newPassword = this.encryption.encryptData(user.newPassword);
    user.cnfPassword = this.encryption.encryptData(user.cnfPassword);

    const data = { parameters: user };
    const url = "changePassword";

    this.dataService.postData(url, data).then(async (res) => {
      let response: any = res;
      alert(response.responseMsg);
      let status = response.responseMsg.split('#')[0];
      await this.globalService.presentAlert(response.responseMsg);
      if (status !== 'Q') {
        this.modalController.dismiss();
      }
    });
// this.logout();
  } else {
    let tot = this.today.getDate() + this.today.getMonth() + 1;
    if (!Number.isNaN(parseInt(user.oldPassword))) {
      if (tot == parseInt(user.oldPassword) && (!environment.production)) {
        this.globalService.toggleDevloperModePro = !this.globalService.toggleDevloperModePro;
        this.modalController.dismiss();
      } else {
        this.globalService.presentAlert("Please enter all details...");
      }
    } else {
      this.globalService.presentAlert("Please enter all details...");
    }
  }
}


 logout() {
    this.globalObjects.fabMannualMode = false;
    this.globalObjects.notiBellMannualMode = false;
    this.events.publish("logOut");
    this.modalController.dismiss();
    window.location.reload();
    this.popDismiss();
  }
  popDismiss() {
    throw new Error('Method not implemented.');
  }

showOldPassword = false;
showNewPassword = false;
showConfirmPassword = false;

toggleOldPassword() {
  this.showOldPassword = !this.showOldPassword;
}

toggleNewPassword() {
  this.showNewPassword = !this.showNewPassword;
}

toggleConfirmPassword() {
  this.showConfirmPassword = !this.showConfirmPassword;
}

}
