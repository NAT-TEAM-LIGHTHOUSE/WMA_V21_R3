import { Component, OnInit, EventEmitter, Input, Output, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonPopover, ModalController, Platform } from '@ionic/angular/standalone';
import { ImagePreviewPage } from 'src/app/pages/image-preview/image-preview.page';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { UploadDocumentPopupComponent } from './upload-document-popup/upload-document-popup.component';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { isPlatformServer } from '@angular/common';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Component({
  standalone: true,
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
  imports: [STANDALONE_IMPORTS]
})
export class UploadButtonComponent implements OnInit {

  @Input() button: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() parentComponent: any;
  @ViewChild('fileTypeModal', { static: true }) modal!: IonPopover;
  acceptParameter: any = "";
  seq: any;
  num: number = 0;
  itemGrp: any;
  fileNames = [];
  files = [];
  isDragOver: boolean = false;
  imgData: any;
  fileFormat = ['pdf', 'xlsx', "*"];
  fileSize = "500MB";
  attachType = [
    { name: "Desktop", enable: "T" },
    { name: "Cloud", enable: "F" },
    { name: "Documents", enable: "F" }]

  singleImgData = ""
  isOpenFileTypeOption = false
  g_file_viewer_url
  constructor(private cdengine : CdEngineService,private dataService: DataService, private modalCtrl: ModalController, private platform: Platform, public globalObjects: GlobalObjectsService, public sanitizer: DomSanitizer, private lhs_lib: LhsLibService, private modalGlobal: CanvasModalService, @Inject(PLATFORM_ID) private platformId: Object) {
    if (this.globalObjects.itemFlag) {
      return applyLoggingDecorator(this, "upload-button")
    }
    let userDetails = this.globalObjects.getLocallData("userDetails")
    this.g_file_viewer_url = userDetails.g_file_viewer_url
  }

  ngOnInit() {
    if ((this.button.data_required_flag && (this.button.data_required_flag == 'T' || (this.button.prompt_name && this.button.prompt_name[this.button.prompt_name.length - 1]) == '*'))) {
      if (this.button.value || this.button.from_value || this.button.to_value) {
        this.button.from_value
        if (this.button.input_pattern) {
          
        } else {
          this.button.isValid = true;
        }
      } else {
        this.button.isValid = false;
        this.button.vadidateMsg = "Please enter " + this.button.prompt_name;
      }
    }

    //.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel
    if (this.button.item_sub_type) {
      this.button.files = [];
      if (this.button.item_sub_type == 'ATTACH' && this.button.value) {

        if (this.button.value == '#') {
          this.button.value = '';
        }
        if (this.button.converToBase64imgData && this.button.value) {
          this.button.imgData = this.sanitizer.bypassSecurityTrustResourceUrl(this.button.converToBase64imgData);
          this.imgData = this.button.converToBase64imgData
          this.button.isImage = false;
          this.button.isFile = false;
          let ext = this.button.file_name.split(".")[1].toLowerCase();
          if (ext == "jpeg" || ext == "jpg" || ext == "png" || ext == "gif") {
            this.button.isImage = true

          } else {
            // if (ext == "doc" || ext == "ppt" || ext == "pptx") {
            //   this.notPpopupShow = true
            // }
            this.button.isFile = true
            this.imgDataFile = this.imgData
          }
          if (ext == "doc" || ext == "docx") {
            this.button.FileImage = "./assets/imgs/wordnfile.png"
          } else if (ext == "xlsx" || ext == "xls") {
            this.button.FileImage = "./assets/imgs/excelnfile.png"
          } else if (ext == "txt") {
            this.button.FileImage = "./assets/imgs/txtFile.png"
          } else if (ext == "pdf") {
            this.button.FileImage = "./assets/imgs/pdfnfile.png"
          }
        } else {
          let filename = this.button.value.split("#")[1]
          let ext = filename.split(".")[1].toLowerCase();
          if (ext == "jpeg" || ext == "jpg" || ext == "png" || ext == "gif") {
            // if ((this.button.value.includes('jpeg') || this.button.value.includes('jpg') || this.button.value.includes('png') || this.button.value.includes('gif'))) {
            // this.button.imgData = this.sanitizer.bypassSecurityTrustUrl(data);
            this.button.file_name = this.button.value.split("~")[1].split("#")[1]
            this.showItemImage(this.button.value.split("~")[1].split("#")[0]);
            this.button.isImage = true
          } else if (this.button.value) {
            this.button.isFile = true
            this.button.file_name = this.button.value.split("~")[1].split("#")[1]
            this.showfile(this.button.value.split("~")[1].split("#")[0])
          }
        }

      } else {
        let acceptPara = this.button.item_sub_type;
        this.button.item_sub_type = acceptPara.split("#")[0];
        let paraArr = acceptPara.indexOf("#") > -1 ? acceptPara.split("#")[1].split("~") : [];
        if (paraArr.length > 0) {
          for (let p of paraArr) {
            this.acceptParameter = this.acceptParameter ? this.acceptParameter + "," + this.globalObjects.getMIMEtype(p) : this.globalObjects.getMIMEtype(p);
          }

        } else {
          this.acceptParameter = "*";
        }
      }

    }
    if (this.button.input_pattern) {
      let option = this.button.input_pattern.split(";")
      console.log(option)
      for (let op of option) {
        let name = op.split("=")
        if (name[0].toUpperCase() == "F") {
          let format = name[1].toLowerCase().split(",")
          this.fileFormat = format
        } else if (name[0].toUpperCase() == "S") {
          this.fileSize = name[1].toUpperCase()
        }
      }
    }
  }

  showItemImage(val) {
    this.imgData = '/assets/imgs/no_image.png';
    if (val) {
      let url = 'getItemImage?query=' + encodeURIComponent(val);
      if (val) {
        this.dataService.getData(url)
          .then(res => {
            var data: any = res;
            if (data.status == 'success') {
              this.imgData = 'data:image/png;base64,' + data.img;
              this.button.imgData = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgData);
              this.cdengine.mark(this.button.apps_page_frame_seqid);
              console.log("this.button.imgData", this.button.imgData)
            } else {
              this.button.imgData = this.sanitizer.bypassSecurityTrustUrl(this.imgData);
              this.cdengine.mark(this.button.apps_page_frame_seqid);
              console.log("this.button.imgData", this.button.imgData)
            }
          }, err => {
            this.imgData = null;
          })
      }

    }
  }

  imgDataFile: any = ""
  notPpopupShow = false
  isDocx = false
  onOpen = ""
  isVideo = false
  async showfile(val) {
    let url: string;
    url = 'getItemImage?query=' + encodeURIComponent(val);
    if (val) {
      // let ext = this.button.file_name.split(".")[1].toLowerCase()
         let  ext = this.getFileExtension(this.button.file_name);
      let type = await this.globalObjects.getMIMEtype(ext);
      // if (ext == "doc" || ext == "ppt" || ext == "pptx") {
      //   this.notPpopupShow = true
      // }
      if (ext == "docx" || ext == "xlsx" || ext == "xls" || ext == "doc" || ext == "ppt" || ext == "pptx" || ext == "csv") {
        this.isDocx = true
      }
      if (ext == "doc" || ext == "docx") {
        this.button.FileImage = "./assets/imgs/wordnfile.png"
      } else if (ext == "xlsx" || ext == "xls") {
        this.button.FileImage = "./assets/imgs/excelnfile.png"
      } else if (ext == "txt") {
        this.button.FileImage = "./assets/imgs/txtFile.png"
      } else if (ext == "pdf") {
        this.button.FileImage = "./assets/imgs/pdfnfile.png"
      } else if (ext == "ppt") {
        this.button.FileImage = "./assets/imgs/pptfile.png"
      } else if (ext == "zip") {
        this.button.FileImage = "./assets/imgs/zipfile.png"
      } else if (ext == "rar") {
        this.button.FileImage = "./assets/imgs/rarfile.png"
      } else if (ext == "csv") {
        this.button.FileImage = "./assets/imgs/csvfile.png"
      }
      if (ext == "mp4" || ext == "avi" || ext == "webm" || ext == "mov" || ext == "wmv") {
        this.isVideo = true
        this.button.FileImage = "./assets/imgs/videofile.png"
      }
      this.dataService.getData(url).then(res => {
        var data: any = res;
        if (data.status == 'success') {
          this.imgDataFile = `data:${type};base64,` + data.img;
          
          this.download(type, data.img);
          this.cdengine.mark(this.button.apps_page_frame_seqid);
          // this.button.imgData = this.sanitizer.bypassSecurityTrustUrl(this.imgData);
        } else {
          this.button.imgData = this.sanitizer.bypassSecurityTrustUrl(this.imgData);
          this.cdengine.mark(this.button.apps_page_frame_seqid);
        }
      }, err => {
        this.imgData = null;
      })
    }
  }

  readFile(event) {
    this.button.files = [];

    if (this.button.item_sub_type == 'S') {
      this.fileNames = [];
    }
    for (let f of event.target.files) {
      let ext = f.name.split(".")[1].toLowerCase()
      if (ext == "doc" || ext == "docx") {
        f.FileImage = "./assets/imgs/wordnfile.png"
      } else if (ext == "xlsx" || ext == "xls") {
        f.FileImage = "./assets/imgs/excelnfile.png"
      } else if (ext == "txt") {
        f.FileImage = "./assets/imgs/txtFile.png"
      } else if (ext == "pdf") {
        f.FileImage = "./assets/imgs/pdfnfile.png"
      } else if (ext == "ppt") {
        f.FileImage = "./assets/imgs/pptfile.png"
      } else if (ext == "zip") {
        f.FileImage = "./assets/imgs/zipfile.png"
      } else if (ext == "rar") {
        f.FileImage = "./assets/imgs/rarfile.png"
      } else if (ext == "csv") {
        f.FileImage = "./assets/imgs/csvfile.png"
      } else if (f.type.startsWith('video/')) {
        f.FileImage = "./assets/imgs/videofile.png"
      }
      this.fileNames.push(f);
    }

    this.button.files = this.fileNames;
    this.button.target = event.target;


    this.emitPass.emit(this.button);
  }

  itemTypeAttch(input) {
    this.previewDocdata = ""
    this.isVideo = false
    this.fileNames = [];
    let gettype = input.files[0].type
    if (gettype == "image/png" || gettype == "image/jpg" || gettype == "image/jpeg" || gettype == "image/gif") {
      this.button.isImage = true
      this.button.isFile = false
    } else {
      this.button.isImage = false
      this.button.isFile = true
    }
    let ext = input.files[0].name.split(".")[1].toLowerCase()
    this.notPpopupShow = false;
    // if (ext == "doc" || ext == "ppt" || ext == "pptx") {
    //   this.notPpopupShow = true
    // }
    if (ext == "doc" || ext == "docx") {
      this.button.FileImage = "./assets/imgs/wordnfile.png"
    } else if (ext == "xlsx" || ext == "xls") {
      this.button.FileImage = "./assets/imgs/excelnfile.png"
    } else if (ext == "txt") {
      this.button.FileImage = "./assets/imgs/txtFile.png"
    } else if (ext == "pdf") {
      this.button.FileImage = "./assets/imgs/pdfnfile.png"
    } else if (ext == "ppt") {
      this.button.FileImage = "./assets/imgs/pptfile.png"
    } else if (ext == "zip") {
      this.button.FileImage = "./assets/imgs/zipfile.png"
    } else if (ext == "rar") {
      this.button.FileImage = "./assets/imgs/rarfile.png"
    } else if (ext == "csv") {
      this.button.FileImage = "./assets/imgs/csvfile.png"
    } else if (input.files[0].type.startsWith('video/')) {
      this.button.FileImage = "./assets/imgs/videofile.png"
    }
    delete this.button['imgData']
    this.button.file_name = input.files[0].name;

    //     if(this.platform.is('android') || this.platform.is('ios')){

    //       for (let f of input.files) {
    //         this.fileNames.push(f);
    //       }
    //     }else{

    //     }
    //     for (let f of input.files) {
    //   const lastDotIndex = f.name.lastIndexOf('.');

    //   const modifiedName = lastDotIndex > -1
    //     ? f.name.substring(0, lastDotIndex).replace(/\./g, '_') + f.name.substring(lastDotIndex)
    //     : f.name.replace(/\./g, '_');

    //   const renamedFile = new File(
    //     [f],
    //     modifiedName,
    //     {
    //       type: f.type,
    //       lastModified: f.lastModified
    //     }
    //   );

    //   renamedFile['FileImage'] = f['FileImage'];

    //   this.fileNames.push(renamedFile);
    //   this.fileNames.push(f);
    // }
    for (let f of input.files) {
          this.fileNames.push(f);
        }



    this.button.files = this.fileNames;
    this.button.target = input;
    this.emitPass.emit(this.button);
  }
  isOpenFile = false
  setOnOpenFile(name) {
    this.onOpen = name
    this.isOpenFile = true
    this.isOpenFileTypeOption = false
    if (this.preViewFile) {
      this.previewShowA(this.preViewFile)

    } else {

      this.uploadPopupshowA()
    }
    this.isFileSizeOver = false
  }
  // open() {
  //   this.isOpenFile = true
  //   this.isOpenFileTypeOption = false
  //   if (this.preViewFile) {
  //     this.previewShowA(this.preViewFile)
  //   } else {
  //     this.uploadPopupshowA()
  //   }
  // }
  cancel() {
    this.isOpenFile = false
    this.isOpenFileTypeOption = false
    this.onOpen = ""
    this.preViewFile = ""
    this.isFileSizeOver = false
  }
  // Dismiss and send value back
  dismissPopover(value?: string) {
    this.modal.dismiss(value);
  }

  // Handle dismissal
  onWillDismiss(event: any) {
    const value = event.detail?.data;
    if (value) {
      if (value == "cancel") {
        this.cancel()
      } else {
        this.setOnOpenFile(value)
      }
    }
  } 
  isFileSizeOver = false
  async uploadPopupshow() {
    let ext = this.button.file_name.split(".")[1].toLowerCase()
    if (ext != "docx" && ext != "xlsx" && ext != "xls" && ext != "csv" && ext != "doc" && ext != "ppt" && ext != "pptx") {
      this.uploadPopupshowA()
    } else {
      // this.isOpenFileTypeOption = true;
      await this.modal.present();
      let fileSize = ""
      if (this.previewDocdata) {
        fileSize = this.previewDocdata.length
      } else {
        fileSize = this.button.files[0].size
      }
      let isOpen: any = this.previewFileSizeCheck(fileSize, this.button.file_name)
      if (!isOpen) {
        this.isFileSizeOver = true
      }

    }

  }
  preViewFile = ""
  async previewShow(file) {
    let ext = file.name.split(".")[1].toLowerCase()
    if (ext != "docx" && ext != "xlsx" && ext != "xls" && ext != "csv" && ext != "doc" && ext != "ppt" && ext != "pptx") {
      this.previewShowA(file)
    } else {
      // this.isOpenFileTypeOption = true
      await this.modal.present();
      this.preViewFile = file
      let isOpen: any = this.previewFileSizeCheck(file.size, file.name)
      if (!isOpen) {
        this.isFileSizeOver = true
      }
    }

  }
  async uploadPopupshowA() {
    if (!this.notPpopupShow) {
      let isNoPreview = false
      let isImage = false
      let showFile = ""
      let ext = this.button.file_name.split(".")[1].toLowerCase()
      if (this.button.files && this.button.files.length > 0) {
        const file = this.button.files[0];
        let ext = file.name.split(".")[1].toLowerCase()
        // DOCX Preview
        // if (ext != "docx" && ext != "xlsx" && ext != "xls" && ext != "doc" && ext != "ppt" && ext != "pptx") {
        if (file instanceof File) {

          let url = URL.createObjectURL(file);
          // if (ext == "pdf") {
          //   url = url + '#toolbar=0'
          // }
          this.imgData = url;
          isImage = true
          if (ext == "zip" || ext == "rar") {
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);
            isNoPreview = true
          }
          // }
          if (file.type.startsWith('video/')) {
            this.isVideo = true
          }
        }

      } else {

        if (ext == "zip" || ext == "rar") {
          const a = document.createElement("a");
          a.href = this.imgData;
          a.download = this.button.file_name;
          a.click();
          URL.revokeObjectURL(this.imgData);
          isNoPreview = true
        }
      }
      if (ext == "docx" || ext == "xlsx" || ext == "xls" || ext == "doc" || ext == "ppt" || ext == "pptx" || ext == "csv") {

        if (this.onOpen == "download") {
          const a = document.createElement("a");
          a.href = this.imgData;
          a.download = this.button.file_name;
          a.click();
          URL.revokeObjectURL(this.imgData);
          return
        } else {
          const formData = new FormData();
          if (this.previewDocdata) {
            let type = await this.globalObjects.getMIMEtype(
              ext
            );
            const blob = new Blob([this.previewDocdata], {
              type: type
            });

            formData.append('file', blob, this.button.file_name);

          } else {
            const file = this.button.files[0];
            if (file instanceof File) {

              formData.append('file', file);

            }
          }
          // 🔹 Call ConvertAPI endpoint
          let result: any = await this.callApiGeturl(formData, this.button.file_name, ext)
          if (result) {
            showFile = result
          } else {
            return;
          }
        }
      }

      let component = UploadDocumentPopupComponent
      let componentProps = {
        sanitizedUrl: showFile ? showFile : this.imgData,
        fileNames: this.button.file_name,
        // file: !isImage && this.button.files[0],
        // resDoc: this.isDocx && this.previewDocdata,
        isNoPreview: isNoPreview,
        isVideo: this.isVideo
        // openOn: this.onOpen
      }
      let id = "UploadDocumentPopupComponent"
      let cssClass = ""
      let title = this.button.file_name
      this.modalGlobal.openModal(component, componentProps, id, '', cssClass, "", "", "", title).then((detail) => {
        if (this.isDocx) {
          this.isDocx = false
        }
      })
    }


  }

  async previewShowA(file) {
    let newFile: any = file
    let isNoPreview = false
    let filename = ""
    let showFile: any = ""
    let isVideo = false
    if (file instanceof File) {
      let ext = file.name.split(".")[1].toLowerCase()
      let url = URL.createObjectURL(newFile);
      // if (ext == "pdf") {
      //   url = url + '#toolbar=0'
      // }
      this.imgData = url;
      filename = newFile.name
      if (ext == "zip" || ext == "rar") {
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
        isNoPreview = true
      }
      if (file.type.startsWith('video/')) {
        isVideo = true
      }
    }
    let ext = filename.split(".")[1].toLowerCase()
    if (ext == "docx" || ext == "xlsx" || ext == "xls" || ext == "doc" || ext == "ppt" || ext == "pptx" || ext == "csv") {

      if (this.onOpen == "download") {
        const a = document.createElement("a");
        a.href = this.imgData;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(this.imgData);
        return
      } else {
        const formData = new FormData();

        formData.append('file', file);
        let result: any = await this.callApiGeturl(formData, file.name, ext)
        if (result) {
          showFile = result
        } else {
          return;
        }

      }
    }
    let component = UploadDocumentPopupComponent
    let componentProps = {
      sanitizedUrl: showFile ? showFile : this.imgData,
      fileNames: filename,
      // file: this.isDocx && newFile,
      isNoPreview: isNoPreview,
      isVideo
      // openOn: this.onOpen
    }
    let id = "UploadDocumentPopupComponent"
    let cssClass = ""
    let title = filename
    this.modalGlobal.openModal(component, componentProps, id, '', cssClass, "", "", "", title).then((detail) => {
      if (this.isDocx) {
        this.isDocx = false
      }
      this.preViewFile = ""
    })
    // this.uploadPopupshow()
  }



  // downloadFile() {
  //   console.log("chekk download file", this.button)
  //   if(this.button.item_enable_flag=='T'){
  //     console.log("download file", this.button.imgData)
  //     if (this.button.imgData) {
  //       if (this.button.imgData) {
  //         let data: any = ""
  //         if (this.button.isFile) {
  //           data = this.imgDataFile
  //         } else {
  //           data = this.button.imgData.changingThisBreaksApplicationSecurity
  //         }
  
  //         if (data.startsWith("data:")) {
  //           // base64 case
  //           const a = document.createElement("a");
  //           a.href = data;
  //           a.download = this.button.file_name || "downloaded_file";
  //           a.click();
  //         } else {
  //           // Server path case
  //           const url = data.includes("http")
  //             ?.data;
  //           const a = document.createElement("a");
  //           a.href = url;
  //           a.target = "_blank";
  //           a.download = this.button.file_name || "downloaded_file";
  //           a.click();
  //         }
  //       }
  //       else {
  //         this.globalObjects.presentAlert("Download not available");
  //       }
  //       return
  //     } else if (this.button.files && this.button.files.length > 0) {
  //       console.log("else part download file", this.button.files)
  //       const file = this.button.files[0];
  
  //       if (file instanceof File) {
  //         const url = URL.createObjectURL(file);
  //         const a = document.createElement("a");
  //         a.href = url;
  //         a.download = file.name;
  //         a.click();
  //         URL.revokeObjectURL(url);
  //       }
  //       // Case 2: File came from backend (stored as value / base64 string / server path)
  //       // else if (this.button.value) {
  //       //   if (this.button.value.startsWith("data:")) {
  //       //     // base64 case
  //       //     const a = document.createElement("a");
  //       //     a.href = this.button.value;
  //       //     a.download = file.name || "downloaded_file";
  //       //     a.click();
  //       //   } else {
  //       //     // Server path case
  //       //     const url = this.button.value.includes("http") 
  //       //       ?. this.button.value ;
  //       //     const a = document.createElement("a");
  //       //     a.href = url;
  //       //     a.target = "_blank";
  //       //     a.download = file.name || "downloaded_file";
  //       //     a.click();
  //       //   }
  //       // } 
  
  
  //       else {
  //         this.globalObjects.presentAlert("Download not available");
  //       }
  //       return;
  //     }
  //     this.globalObjects.presentAlert("No file available to download");
  //   }
  // }


async downloadFile() {
  console.log('check download file', this.button);

  if (this.button.item_enable_flag !== 'T') {
    return;
  }

  try {
    let data: any = '';

    if (this.button.imgData) {

      if (this.button.isFile) {
        data = this.imgDataFile;
      } else {
        data = this.button.imgData.changingThisBreaksApplicationSecurity;
      }

    } else if (this.button.files?.length > 0) {

      const file = this.button.files[0];

      if (file instanceof File) {
        data = await this.fileToDataUrl(file);
      } else {
        this.globalObjects.presentAlert('Download not available');
        return;
      }

    } else {
      this.globalObjects.presentAlert('No file available to download');
      return;
    }

    // Desktop/Web
    if (!Capacitor.isNativePlatform()) {
      const a = document.createElement('a');
      a.href = data;
      a.download = this.button.file_name || 'downloaded_file';
      a.click();
      return;
    }

    // Android/iOS APK
    if (data.startsWith('data:')) {

      const base64 = data.split(',')[1];

      const fileName =
        this.button.file_name || `download_${Date.now()}`;

      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents
      });

      console.log('File downloaded:', fileName);

      this.globalObjects.presentAlert(
        `File downloaded successfully: ${fileName}`
      );

    } else {

      // Server URL
      console.log('Server URL:', data);

      // If server URL, fetch it first and save the response
      const response = await fetch(data);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();

      const base64 = await this.blobToBase64(blob);

      const fileName =
        this.button.file_name || `download_${Date.now()}`;

      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents
      });

      console.log('File downloaded:', fileName);

      this.globalObjects.presentAlert(
        `File downloaded successfully: ${fileName}`
      );
    }

  } catch (error) {
    console.error('Download error:', error);
    this.globalObjects.presentAlert('Unable to download file');
  }
}


private fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}


private blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}


  convertFile(files) {

    return new Promise((resolve, reject) => {
      let blobFiles: any = [];

      if (files.length > 0) {
        for (let f of files) {

          this.globalObjects.converToBase64(f).then((data: any) => {
            let file: any;
            file = data.split(",")[1];
            file = file + "~" + f.name.replace(/\s/g, '_');
            if (this.button.item_sub_type == 'M') {
              file = file + '#' + this.button.apps_item_seqid;
            }
            blobFiles.push(file);
            if (files.length == blobFiles.length) {
              resolve(blobFiles)
            }
          }, (error) => {
            this.globalObjects.presentAlert("Error while reading file...");
            reject();
          });
        }
      } else {
        this.globalObjects.presentAlert("No file selected...");
        reject();
      }
    })
  }

  removeItem(index) {
    this.fileNames.splice(index, 1);
    this.button.files = [];
    if (this.button.item_sub_type == 'S') {
      this.fileNames = [];
    }
    this.button.files = this.fileNames;
    this.button.value = "";
    this.button.imgData = "";

    if (this.button.file_name) {
      delete this.button['file_name']
    }
    this.button.isImage = false;
    this.button.isFile = false;

    this.imgData = null;
    this.singleImgData = null
    // item.value = "";
    //   item.imgData = null;
    //   item.files = [];

    // let itm = JSON.parse(JSON.stringify(this.button));

    // itm.post_events_str = "";
    // itm.itemClicked = "pre";
    // let itemName = "'" + this.button.apps_page_frame_seqid + '.SYS_DOC_DELETE' + "'";
    // itm.click_events_str = `app_execute_item(${itemName} ,'click_events_str','current_record');`

    // this.emitPass.emit(itm);
  }


  removeAttach(index) {
    // this.fileNames.splice(index, 1);

    let itemName = this.button.apps_page_frame_seqid + '.SYS_DOC_DELETE';

    let item = this.lhs_lib.get_item(itemName, this.button.indexcount);
    if (item) {
      item.itemClicked = "pre";
      this.emitPass.emit(item);
    } else {
      this.removeItem(index);
    }
  }


  showDeveloperData() {

  }

  openPreviewOnMobile() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.photoview();   // only open modal on Android/iOS
    } else {
      this.uploadPopupshow()

    }
    // do nothing on web
  }

  async photoview() {
    const modal = await this.modalCtrl.create({
      component: ImagePreviewPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img: this.button.imgData
      }
    });
    modal.present();
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: any) {
    event.preventDefault();
    this.isDragOver = false;
    const input = event.dataTransfer as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileCheck(input)
      // if (event.dataTransfer?.files) {
      //   this.addFiles(event.dataTransfer.files);
      // }
    }
  }
  // onFileSelected(event: any) {
  //   this.button.files = [];
  //   const selectedFiles = event.target.files;
  //   this.addFiles(selectedFiles);
  // }


  fileCheck(input) {
    //  const input = event.target as HTMLInputElement;
    //   if (input.files && input.files.length > 0) {
    console.log("check file", input.files[0])
    let format = ""
    if (this.fileSize.includes("KB")) {
      format = "KB";
    } else if (this.fileSize.includes("MB")) {
      format = "MB";
    } else if (this.fileSize.includes("GB")) {
      format = "GB";
    }

    const file = input.files[0];

    let size = 0;
    if (format == "KB") {
      size = file.size / 1024
    } else if (format == "MB") {
      const sizeInKB = file.size / 1024;
      size = sizeInKB / 1024;
    } else if (format == "GB") {
      const sizeInKB = file.size / 1024;
      const sizeInMB = sizeInKB / 1024;
      size = sizeInMB / 1024;
    }


    let sizeStr = '';

    sizeStr = `${size.toFixed(2)}${format}`;


    const fileExtension = file.name.split('.').pop(); // Get file extension

    let fileData = {
      name: file.name,
      size: sizeStr,
      type: file.type,
      format: fileExtension,
      lastModifiedDate: new Date(file.lastModified).toLocaleString()
    };

    /* Check file formate type*/
    let flag = false
    for (let fmt of this.fileFormat) {
      if (fmt == fileData.format || fmt == "*") {
        flag = true
      }
    }

    if (!flag) {
      alert(`Please select file format ${this.fileFormat.join(',')}`)
      return
    }
    // Check file size
    const fileSizeStr = fileData.size;      // e.g., "11165.2 MB"
    const allowedSizeStr = this.fileSize;   // e.g., "5 MB"

    // Extract numeric values
    const fileSizeValue = parseFloat(fileSizeStr);
    const allowedSizeValue = parseFloat(allowedSizeStr);

    // Extract units
    const getUnit = (str: string): string => {
      const unitMatch = str.toUpperCase().match(/(KB|MB|GB)/);
      return unitMatch ? unitMatch[0] : 'MB'; // Default to MB if no unit
    };

    const fileUnit = getUnit(fileSizeStr);        // e.g., "MB"
    const allowedUnit = getUnit(allowedSizeStr);  // e.g., "MB"

    // Convert everything to MB
    const convertToMB = (value: number, unit: string): number => {
      switch (unit) {
        case 'KB': return value / 1024;
        case 'MB': return value;
        case 'GB': return value * 1024;
        default: return value;
      }
    };

    const fileSizeInMB = convertToMB(fileSizeValue, fileUnit);
    const allowedSizeInMB = convertToMB(allowedSizeValue, allowedUnit);

    // Final comparison
    if (fileSizeInMB > allowedSizeInMB) {
      alert(`Your file size is ${fileData.size}. Please select a file <= ${this.fileSize}.`);
      return;
    }

    this.button.files = [];
    const selectedFiles = input.files;

    if (this.button.item_sub_type == "ATTACH") {
      this.itemTypeAttch(input)
    } else {
      this.addFiles(selectedFiles);
    }
    //  }
  }


  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileCheck(input)
    }
  }

  private addFiles(fileList: any) {

    for (let i = 0; i < fileList.length; i++) {
      let ext = fileList[i].name.split(".")[1].toLowerCase()
      if (ext == "doc" || ext == "docx") {
        fileList[i].FileImage = "./assets/imgs/wordnfile.png"
      } else if (ext == "xlsx" || ext == "xls") {
        fileList[i].FileImage = "./assets/imgs/excelnfile.png"
      } else if (ext == "txt") {
        fileList[i].FileImage = "./assets/imgs/txtFile.png"
      } else if (ext == "pdf") {
        fileList[i].FileImage = "./assets/imgs/pdfnfile.png"
      } else if (ext == "ppt") {
        fileList[i].FileImage = "./assets/imgs/pptfile.png"
      } else if (ext == "zip") {
        fileList[i].FileImage = "./assets/imgs/zipfile.png"
      } else if (ext == "rar") {
        fileList[i].FileImage = "./assets/imgs/rarfile.png"
      } else if (ext == "csv") {
        fileList[i].FileImage = "./assets/imgs/csvfile.png"
      } else if (fileList[i].type.startsWith('video/')) {
        fileList[i].FileImage = "./assets/imgs/videofile.png"
      }
      this.files.push(fileList[i]);
      this.button.files = this.files;
      this.button.target = event.target;
      this.emitPass.emit(this.button);
    }
  }

  onSingleImageSelected(event: any) {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgData = e.target.result;
        this.singleImgData = e.target.result;
        this.fileNames = [file];
        this.files = [file];
        this.button.files = [file];
        this.emitPass.emit(this.button);
      };
      reader.readAsDataURL(file);
    }
  }

  onDropImage(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgData = e.target.result;
        this.fileNames = [file];
        this.files = [file];
        this.button.files = [file];
        this.emitPass.emit(this.button);
      };
      reader.readAsDataURL(file);
    }
  }

  showmodal: boolean = false
  uploadmodal() {
    this.showmodal = !this.showmodal;
  }

  base64ToArrayBuffer(base64: string): Promise<Uint8Array> {
    return new Promise((resolve) => {
      if (isPlatformServer(this.platformId)) return;
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      resolve(bytes);
    });
  }

  /** Download and open the PDF depending on platform */
  previewDocdata: any = ""
  async download(type, data) {
    //  this.base64ToArrayBuffer(data).then((res: Uint8Array) => {
    this.base64ToArrayBuffer(data).then((res: any) => {
      const blob = new Blob([res], { type });
      if (this.isDocx) {
        this.previewDocdata = res
      }
      // Browser/iOS → show in iframe
      const url = URL.createObjectURL(blob) + '#toolbar=0';

      this.imgData = url
      this.button.imgData = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.button.converToBase64imgData = url
    });
  }
  // async callApiGeturl(formData, name , ext) {
  //   try {
  //   const res = await fetch(this.g_file_viewer_url, {
  //           method: 'POST',
  //           body: formData
  //         });
  //         if (!res.ok) {
  //           // ❌ Handle HTTP errors (404, 500, etc.)
  //           throw new Error(`Server responded with ${res.status}`);
  //         }
  //         const result = await res.json();
  //         if(result.detail){
  //              this.lhs_lib.msgbox(this.button,result.detail)
  //              return;
  //         }else{


  //         // if (this.onOpen == "system") {
  //         //   const fileUrl = result.blob_url; // real URL!

  //         //   const a = document.createElement("a");
  //         //   a.href = this.imgData;
  //         //   a.download =name;
  //         //   a.click();
  //         //   URL.revokeObjectURL(this.imgData);

  //         //   // then open in Word
  //         //   let msOpen = ""
  //         //   if (ext === 'xlsx' ||ext === 'xls' || ext === 'csv') {
  //         //     msOpen = "ms-excel"
  //         //   } else if (ext === 'pptx' || ext === 'ppt') {
  //         //     msOpen = "ms-powerpoint"
  //         //   } else if ( ext === 'doc' || ext === 'docx') {
  //         //     msOpen = "ms-word"
  //         //   }
  //         //   setTimeout(() => {
  //         //     window.location.href = `${msOpen}:ofe|u|` + encodeURIComponent(fileUrl);
  //         //   }, 2000);
  //         //   return;
  //         // } else 
  //           if (this.onOpen == "newtab") {
  //             window.open(result.viewer_url, '_blank')
  //             return;
  //           } else {
  //            return result.viewer_url
  //           }
  //             }
  //       } catch (err: any) {
  //     // ❌ Handle network or other errors
  //     // await loading.dismiss();
  //     this.lhs_lib.msgbox(this.button,err)
  //     console.error('Upload failed:', err);

  //     return;
  //   }

  // } 


  async callApiGeturl(formData, filename, ext): Promise<any> {
    try {
      this.globalObjects.ShowLoadingSide();
      if (this.globalObjects.logFlag) {
        let name = "processing fileViewer api call";
        let ws_type = "fileViewer"
        let log_name = `fileViewer_${filename}`;
        let status = "start";
        const seq = this.lhs_lib.start();
        this.lhs_lib.get_event_log_objs(name, "", filename, "", status, ws_type, log_name, seq);
      }
      const res: any = await this.dataService.fileViewerUrl(this.g_file_viewer_url, formData);
      this.globalObjects.hideLoadingSide();
      if (this.globalObjects.logFlag) {
        let name = "processing fileViewer api call";
        let ws_type = "fileViewer"
        let log_name = `fileViewer_${filename}`;
        let status = `end -With success`;
        this.lhs_lib.end();
        this.lhs_lib.get_event_log_objs(name, "", filename, "", status, ws_type, log_name);
      }
      if (this.onOpen === 'newtab') {
        if (isPlatformServer(this.platformId)) return;
        window.open(res.viewer_url, '_blank');
        return null; // nothing to return, since it's opened in new tab
      } else {
        return res.viewer_url; // ✅ this now returns to the outer function
      }
    } catch (err) {
      this.globalObjects.hideLoadingSide();
      if (err.status == 400 && err.error.detail) {
        this.lhs_lib.msgbox(this.button, err.error.detail)
      } else {
        let msg = `Server not found ${err.status}`
        this.lhs_lib.msgbox(this.button, msg)
      }
      console.log(err)
      if (this.globalObjects.logFlag) {
        let name = "processing fileViewer api call";
        let ws_type = "fileViewer"
        let log_name = `fileViewer_${filename}`;
        let status = `end -With error ${err.message} - ${err.status}`;
        this.lhs_lib.end();
        this.lhs_lib.get_event_log_objs(name, "", filename, "", status, ws_type, log_name);
      }
      return null;
    }

  }
  previewFileSizeCheck(size, name) {
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    if (+sizeMB > 25) {
      return false;
    } else {
      return true;
    }
  }






private getFileExtension(fileName: string): string {
  if (!fileName) {
    return '';
  }

  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return '';
  }

  return fileName.substring(lastDotIndex + 1).toLowerCase();
}
}
