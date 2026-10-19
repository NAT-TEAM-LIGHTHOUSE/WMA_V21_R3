import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[...STANDALONE_IMPORTS],
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
@Input() newMess: string;
@Input() dataObj: any;
public passFlag 
  resetForm: FormGroup;
  resetPass:any;
  showError = false;
  showSuccess = false;
  newPassword = '';
  userDetails:any;
confirmPassword = '';
passwordMismatch = false;
oldpassword:any='';
passwordComplexity: string = 'simple'; // 'simple' or 'complex'
passwordValidationErrors: any = {
  newPassword: [],
  confirmPassword: [],
  oldPassword: ''
};
  ngOnInit(): void {
    console.log("message",this.dataObj);
 
     this.userDetails = this.globalObjects.getLocallData('userDetails');
    if(this.dataObj){
         this.passFlag = this.dataObj.passFlag,
      this.newMess=this.dataObj.message;
    }
  }
  constructor(private encrypt : EncryptionService,private popOverCtrl : PopoverController,private globalObjects : GlobalObjectsService,private fb: FormBuilder, private navCtrl: NavController,private router : Router,private popoverController : PopoverController,public dataService:DataService) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    const enteredPassword = this.resetForm.value.password;

    // Replace with real API check
    if (enteredPassword === 'secret123') {
      this.showSuccess = true;
      this.showError = false;
      setTimeout(() => this.navCtrl.navigateForward('/home'), 1000);
    } else {
      this.showError = true;
      this.showSuccess = false;
    }
  }

  close() {
    this.popoverController.dismiss();
  }


passwordVisibility = {
  prev: false,
  new: false,
  confirm: false
};

toggleVisibility(field: 'prev' | 'new' | 'confirm') {
  this.passwordVisibility[field] = !this.passwordVisibility[field];
}
  redirectToUser(){
    this.router.navigate(['/usersetting']);
  }




  async checkPasswords() {
    // First validate user to determine password complexity
    const complexity = await this.validateUser();
    this.passwordComplexity = complexity;

    this.passwordValidationErrors = {
      newPassword: [],
      confirmPassword: [],
      oldPassword: ''
    };

    // Validate new password based on complexity
    if (!this.newPassword) {
      this.passwordValidationErrors.newPassword.push('New password is required');
    } else {
      this.validatePasswordComplexity();
    }

    // Validate confirm password
    if (!this.confirmPassword) {
      this.passwordValidationErrors.confirmPassword.push('Confirm password is required');
    } else if (this.newPassword !== this.confirmPassword) {
      this.passwordValidationErrors.confirmPassword.push('Passwords do not match');
    }

    // If old password is required, validate it
    if (this.passFlag !== 'T' && !this.oldpassword) {
      this.passwordValidationErrors.oldPassword = 'Previous password is required';
    }

    // If there are errors, display them
    if (this.passwordValidationErrors.newPassword.length > 0 || 
        this.passwordValidationErrors.confirmPassword.length > 0 || 
        this.passwordValidationErrors.oldPassword) {
      this.showError = true;
      this.showSuccess = false;
      return;
    }

    // If all validations pass, proceed with password change
    this.passwordMismatch = false;
    this.submitPasswordChange();
  }

  validatePasswordComplexity() {
    const password = this.newPassword;

    if (this.passwordComplexity === 'complex') {
      // Complex password requirements
      if (password.length < 8) {
        this.passwordValidationErrors.newPassword.push('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(password)) {
        this.passwordValidationErrors.newPassword.push('Password must contain at least one uppercase letter (A-Z)');
      }
      if (!/[a-z]/.test(password)) {
        this.passwordValidationErrors.newPassword.push('Password must contain at least one lowercase letter (a-z)');
      }
      if (!/[0-9]/.test(password)) {
        this.passwordValidationErrors.newPassword.push('Password must contain at least one number (0-9)');
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        this.passwordValidationErrors.newPassword.push('Password must contain at least one special character (!@#$%^&* etc.)');
      }
    } else {
      // Simple password requirements
      if (this.newPassword !== this.confirmPassword) {
        this.passwordValidationErrors.newPassword.push('Passwords do not match');
      }
    }
  }

  submitPasswordChange() {
    let url = "changePassword"
    const user = {

      "oldPassword": this.encrypt.encryptData(this.oldpassword),
      "newPassword": this.encrypt.encryptData(this.newPassword),
      "cnfPassword": this.encrypt.encryptData(this.confirmPassword),
      // "user_type":this.userDetails.user_type,
      "wma_user_code": this.dataObj.userCode,
      "actual_code": this.dataObj.userCode

    }

    console.log("Encrypted Data:");
    console.log(user);
    const data = { parameters: user };
    console.log(data)
    this.dataService.postData(url, data).then(async (data: any) => {
      console.log(data);
      if (data && data.responseStatus == "success") {
        this.showSuccess = true;
        this.showError = false;
        this.globalObjects.presentAlert("Password reset successfully");
        setTimeout(() => {
          this.navCtrl.navigateRoot('/login');
          location.reload();
        }, 1500);
      } else if (data && data.responseStatus == "error") {
        this.showError = true;
        this.showSuccess = false;
        if (data && data.responseMsg || data.responseMsg.includes("Q#")) {
          alert(data.responseMsg);
            this.popOverCtrl.dismiss();
        }
        else {
          if (data && data.responseMsg.includes("Q#")) {
            let resMessage = data.responseMsg.split("#")[1];
            alert(resMessage);
          }
        }
      }
    });

    console.log('Passwords match. Proceed...');
  }


get passwordsDoNotMatch(): boolean {
  return this.confirmPassword.length > 0 && this.newPassword !== this.confirmPassword;
}
  



  validateUser(): Promise<string> {
    return new Promise((resolve) => {
      let url; 
      let appKey = "";
      if (this.globalObjects.simpleLoginProcess) {
        appKey = this.globalObjects.getLocallData("appKey");
      } else {
        appKey = this.globalObjects.getLocallData("parentAppkey");
      }

      let value = this.dataObj.userCode;
      console.log("User code for validation:", value);
      url = 'validateUserID?userId=' + value + '&appKey=' + appKey;

      this.dataService.getData(url).then(async (data: any) => {
        console.log(data);

        if (data.responseStatus == "success") {
          if (data.responseMsg.includes("#PC")) {
            this.resetPass = 'complex';
            resolve('complex');
          } else if (data.responseMsg.includes("#PS")) {
            this.resetPass = 'simple';
            resolve('simple');
          } else {
            // Default to simple if no indicator
            this.resetPass = 'simple';
            resolve('simple');
          }
          console.log("Password Complexity:", this.resetPass);
        } else {
          // On failure, default to simple
          this.resetPass = 'simple';
          resolve('simple');
        }
      }).catch(() => {
        // On error, default to simple
        this.resetPass = 'simple';
        resolve('simple');
      });
    });
  }
}