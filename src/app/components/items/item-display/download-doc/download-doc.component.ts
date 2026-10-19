import { Component, OnInit,EventEmitter, Input, Output, Inject, PLATFORM_ID } from '@angular/core';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { Platform } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { File } from '@awesome-cordova-plugins/file/ngx';


import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { saveAs } from 'file-saver';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { isPlatformServer } from '@angular/common';

@Component({
standalone : true,
  selector: 'app-download-doc',
  templateUrl: './download-doc.component.html',
  styleUrls: ['./download-doc.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class DownloadDocComponent implements OnInit {

  @Input() doc: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  document: any;
  docFile: any;

  constructor(private dataService: DataService, private globalObject: GlobalObjectsService, private events:Events,
    private plt: Platform, private file: File,  private filePath: FilePath,@Inject(PLATFORM_ID) private platformId: Object) { 
      if(this.globalObject.itemFlag){
        return applyLoggingDecorator(this,"download-doc")
      }
    }

  ngOnInit() {
    if(this.doc.value){
      this.document = this.doc.value.split('~');
    }
  }

  showDocument() {
    this.globalObject.displayCordovaToast("Please wait download started...");
    let doc = this.document[0];
    if (doc) {
      let url = 'getItemImage?query=' + encodeURIComponent(doc);
      if (doc) {
        this.dataService.getData(url)
          .then(res => {
            var data: any = res;
            if (data.status == 'success') {
              this.docFile = data.img;
              this.downloadFile();
            }
          }, err => {
            this.document = null;
          })
      }
    }
    else{
      this.globalObject.presentAlert("Image item query not found.")
    }
  }

  downloadFile() {
    if (this.plt.is("android")) {
      this.globalObject.checkStoragePermission().then((res)=>{
        if(res == 'success'){
          this.download();
        }else{
          this.globalObject.presentAlert("Please grant storage permission to download file.");
        }
      })
    }
    else{
      this.download();
    }
  }

  async download() {

    let type = await this.globalObject.getMIMEtype(this.document[1].split(".")[1]);
    this.base64ToArrayBuffer(this.docFile).then((res: any) => {
      let file = new Blob([res], { type: type });

      let fileName = this.document[1];
      if(!fileName){
        fileName =  JSON.stringify(Math.floor(Math.random() * (999999 - 100000)) + 100000);
      }

      if (this.plt.is("android") || this.plt.is("ios")) {


        let directoryPath = "";
        if (this.plt.is("ios")) {
          directoryPath = this.file.documentsDirectory;
        }
        if (this.plt.is("android")) {
          directoryPath = this.file.externalRootDirectory + "/LHSAPP/";
        }

        this.file.writeFile(directoryPath, fileName, file, { replace: true })
          .then(fileEntry => {

            if (fileEntry) {

              if (fileEntry.isFile) {
                this.globalObject.displayCordovaToast("File Downloaded");
              }

              this.file.checkFile(directoryPath, fileName).then((exist => {
                this.filePath.resolveNativePath(directoryPath + fileName).then((pathIs => {

                }));
                if (this.plt.is("ios")) {
                  this.document.viewDocument(directoryPath + fileName, type, {});
                } else {
                }
              })
              ).catch(err => {
                this.globalObject.presentAlert('Directory' + JSON.stringify(err));
              });
            }
            this.globalObject.displayCordovaToast("Download complete...");
          })
          .catch(err => {
            this.globalObject.displayCordovaToast("File format not supported...");
            this.globalObject.presentAlert('Directory does not exist');
          })
      } else {
        saveAs(file, fileName);
      }
    })
  }

  base64ToArrayBuffer(base64) {
                if (isPlatformServer(this.platformId)) return;
    return new Promise((resolve, reject) => {
      var binaryString = window.atob(base64);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      resolve(bytes);
    })
  }

}
