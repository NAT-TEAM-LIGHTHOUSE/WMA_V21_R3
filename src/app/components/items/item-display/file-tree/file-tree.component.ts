import { Component, Input, OnInit } from '@angular/core';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { Platform } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer} from '@awesome-cordova-plugins/file-transfer/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class FileTreeComponent implements OnInit {

  @Input() model: any;
  @Input() isChild: boolean;
  @Input() isMainFolder: any;
  @Input() isFile: any;
  @Input() itemData: any;
  l_url : any;
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService, private file: File
    ,private document: DocumentViewer, private ft: FileTransfer,
    public platform: Platform) { 
      if(this.globalObjects.itemFlag){
        return applyLoggingDecorator(this,"file-tree")
      }
    }

  ngOnInit() {
    if (this.isMainFolder) {
      this.getData();
    } else {
      this.model.forEach((element: any) => {
        element.isSelect ? element.toggle = 'on' : element.toggle = 'init';
      });
    }
  }

  toggleItem(item) {
    item.toggle === 'on' ? item.toggle = 'off' : item.toggle = 'on';
  }


  getData() {
   this.globalObjects.showLoading();
     this.l_url = "getFileExplorer?prentFolder=" + encodeURIComponent(this.itemData.format_mask);
    this.dataService.getData(this.l_url).then(res => {

      let data: any = res;
      if (data.responseStatus == "success") {
        this.model = [];
        this.model.push(data.responseData);
        this.model.forEach((element: any) => {
          element.isSelect ? element.toggle = 'on' : element.toggle = 'init';
        });
      }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
    })
  }


  getMIMEtype(extn){
    let ext=extn.toLowerCase();
    let MIMETypes={
      'txt' :'text/plain',
      'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc' : 'application/msword',
      'pdf' : 'application/pdf',
      'jpg' : 'image/jpeg',
      'bmp' : 'image/bmp',
      'png' : 'image/png',
      'xls' : 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf' : 'application/rtf',
      'ppt' : 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'mp3' : 'audio/mpeg',
      'mpeg' : 'video/mpeg',
      'wav' : 'audio/wav',
      'weba' : 'audio/webm',
      'webm' : 'video/webm',
      'wmv' :	'video/x-ms-wmv',
      'mp4' : 'video/mp4'

    }
    return MIMETypes[ext];
  }

  DownloadandOpenPdf(filepath, filename) {
    let fileExtn=filename.split('.').reverse()[0];
    let fileMIMEType=this.getMIMEtype(fileExtn);

    let  downloadUrl= this.globalObjects.getScopeUrl() + 'downloadFile?file=' + encodeURIComponent(filepath);
  
    let path = this.file.externalRootDirectory + "/LHSAPP/";
    const transfer = this.ft.create();
    this.globalObjects.displayCordovaToast("Please wait download started...");
    transfer.download(downloadUrl, path + filename).then(entry => {
      this.l_url = entry.toURL();
      this.globalObjects.displayCordovaToast("Download complete...");
      if (this.platform.is('ios')) {
        this.document.viewDocument(this.l_url, fileMIMEType, {});
      } else {
      }
    });
  }
}