import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
// import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx'
import { Market } from '@awesome-cordova-plugins/market/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';


@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-beta-version',
  templateUrl: './beta-version.page.html',
  styleUrls: ['./beta-version.page.scss'],
})
export class BetaVersionPage implements OnInit {

  url: any;
  fileList: any[];
  showFile: any[];
  orderByParam: any = {};
  direction: any = 0;
  fileDate: any[] =[];
  constructor(private router: Router, private alertController: AlertController, private http:HttpClient,
    private market: Market, private globalObjects: GlobalObjectsService,
    // private downloader: Downloader
  ) { 
      if(this.globalObjects.pagesFlag){
        return applyLoggingDecorator(this,"beta-version")
      }
    }

  ngOnInit() {

    this.url = "http://203.193.167.118:9003/lhsws/LW/192.168.100.173/1521/" + this.globalObjects.getLocallData('appKey') + "/"
               + this.globalObjects.getLocallData('appKey') + "/ORA10G" + "/getFileExplorer?prentFolder=" + encodeURIComponent('C:\\LHSAppStore');
    // this.url = "getFileExplorer?prentFolder=" + encodeURIComponent('E:\\APP_LIVE_FOLDER');
    this.globalObjects.showLoading();
    this.http.get(this.url).subscribe((res: any) => {
      if (res.responseStatus == 'success') {
        this.fileList = res.responseData.files;
        this.fileList = this.fileList.filter(data => {
          return data.fileName.includes("NEWERP");
        })
        this.thClick();
        this.fileList = this.fileList.slice(0, 5);

        this.fileList.filter(data =>{
          let date1 = data.fileName.split('_')[4].split('.')[0].split('');
          let date = date1[6] + date1[7] + "-" + date1[4] + date1[5] + '-' + date1[0] + date1[1] + date1[2] + date1[3];
          this.fileDate.push(date);
        });
        this.globalObjects.hideLoading()
      }
      else {
        this.globalObjects.presentAlert("Unable to process your request..");
        this.globalObjects.hideLoading()
      }

    })
  }
  closePage() {
    this.router.navigate(['super']);
  }

  downloadApk(filename, filepath) {

    let downloadUrl = this.globalObjects.getScopeUrl() + 'downloadFile?file=' + encodeURIComponent(filepath);
  
    // this.globalObjects.presentToast
    // let req: DownloadRequest = {
    //   uri: downloadUrl,
    //   title: filename,
    //   description: '',
    //   mimeType: '',
    //   visibleInDownloadsUi: true,
    //   notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
    //   destinationInExternalFilesDir: {
    //     dirType: 'Download',
    //     subPath: filename
    //   }
    // }

    // this.alertController.create({
    //   message: 'Please confirm download!!!',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       cssClass: 'secondary',
    //       handler: () => {
    //       }
    //     }, {
    //       text: 'Download',
    //       handler: () => {
    //         this.downloader.download(req).then((path) => {
    //           this.globalObjects.presentAlert("File location: " + path)
    //         }).catch((err: any) => {
    //           this.globalObjects.presentAlert("Error: " + JSON.stringify(err));
    //         })
    //       }
    //     }
    //   ]
    // }).then((alert) => { alert.present() })
  }

  openInPlayStore() {
    this.market.open('com.lhs.dhanukaerp');
  }

  thClick(): any {
    if (this.direction == 0) {
      this.fileList = this.fileList.sort((a, b): any => {
        return a.fileName.split('_')[4] > b.fileName.split('_')[4] ? -1 : 1;
      })
      this.direction = 1;
    }
    else {
      this.fileList = this.fileList.sort((a, b): any => {
        return a.fileName.split('_')[4] > b.fileName.split('_')[4] ? 1 : -1;
      })
      this.direction = 0;
    }
  }
}
