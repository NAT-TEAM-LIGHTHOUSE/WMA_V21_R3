import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { Market } from '@awesome-cordova-plugins/market/ngx';
import { Platform } from '@ionic/angular/standalone';
import { GlobalObjectsService } from './global-objects.service';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import copy from 'copy-to-clipboard';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { isPlatformServer } from '@angular/common';

type AOA = any[][];

@Injectable({
  providedIn: 'root'
})

export class PluginsService {

  constructor(private documentViewer : DocumentViewer,private globalobjects : GlobalObjectsService,private filePath : FilePath,private market : Market,private emailComposer :EmailComposer,
    private nativeAudio : NativeAudio,private file : File,private platform : Platform, private socialSharing: SocialSharing,@Inject(PLATFORM_ID) private platformId: Object) { }




  playAudio(audioId: string): Promise<void> {
    return this.nativeAudio.play(audioId).then(
      () => {  },
      (err) => {
        console.error('Error playing audio:', err);
      }
    );
  }


 showCopied: any;

  copyData(data, type) {
    copy(data);
    this.showCopied = type;

    setTimeout(() => {
      this.showCopied = "";
    }, 1000);

  }




  makeXmlHttpReq(downloadUrl) {
    return new Promise((resolve, reject) => {
      let oReq = new XMLHttpRequest();
      oReq.open("GET", downloadUrl, true);
      //console.log("ResStatus: " + oReq.status);
      oReq.responseType = "blob"; // blob pls


      oReq.onreadystatechange = (oEvent) => {
        if (oReq.readyState === 4) {
          if (oReq.status === 200) {
            oReq.onload = (oEvent) => {
              resolve(oReq.response);
            }
          } else {
            reject("Error");
          }
        }
      };
      oReq.send();
    })
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'mp3': 'audio/mpeg',
      'mpeg': 'video/mpeg',
      'wav': 'audio/wav',
      'weba': 'audio/webm',
      'webm': 'video/webm',
      'wmv': 'video/x-ms-wmv',
      'mp4': 'video/mp4'

    }
    return MIMETypes[ext];
  }



  download(event) {
    // if (event.item_name == "FILE_PATH") {

    let filePath = event.obj.value.replace(/\\/g, "/").replace(/'/g, '');
    let filename = filePath.split("/").reverse()[0];
    let fileExtn = filename.split('.').reverse()[0];
    let fileMIMEType = this.getMIMEtype(fileExtn);
    let downloadUrl = this.globalobjects.getScopeUrl() + 'downloadAnyFile?file=' + filePath;
    // let downloadUrl = "http://203.193.167.118:8888/lhsws/NW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA10G/downloadFile?file=C:/ugk_w/house/invoice/NC20Y-00006.pdf";
    let path = "";
    if (this.platform.is("ios")) {
      path = this.file.documentsDirectory;
    }
    if (this.platform.is("android")) {
      path = this.file.externalRootDirectory + 'Download/';
    }


    this.globalobjects.displayCordovaToast("Please wait download started...");
    this.makeXmlHttpReq(downloadUrl).then((data: any) => {

      if (this.platform.is('ios') || this.platform.is('android')) {

        this.file.checkDir(path, 'LHSAPP').then((res) => {
          path = path + '/LHSAPP/'
          this.file.writeFile(path, filename, data, { replace: true }).then(data => {
            // alert("file saved..."+data);
            this.globalobjects.displayCordovaToast("Download complete...");
            if (this.platform.is('ios')) {
              this.documentViewer.viewDocument(path + filename, fileMIMEType, {});
            } else {

              // this.fileOpener.open(path + filename, fileMIMEType)
              //   .then(() => {
              //     //console.log('File is opened'))
              //   })
              //   .catch(e => {
              //     this.globalobjects.presentAlert("file is" + JSON.stringify(e))
              //   });
            }
          }, (error) => {
            alert('Error occured while saving file. Please check storage permission and try again.')
          });
        }, (err) => {
          this.file.createDir(path, 'LHSAPP', true).then((res) => {
            path = path + '/LHSAPP/'
            this.file.writeFile(path, filename, data, { replace: true }).then(data => {
              // alert("file saved..."+data);
              this.globalobjects.displayCordovaToast("Download complete...");
              if (this.platform.is('ios')) {
                this.documentViewer.viewDocument(path + filename, fileMIMEType, {});
              } else {

                // this.fileOpener.open(path + filename, fileMIMEType)
                //   .then(() => {
                //     //console.log('File is opened')
                //   })
                //   .catch(e => this.globalobjects.presentAlert("file is" + JSON.stringify(e)));
              }
            }, (error) => {
              alert('Error occured while saving file. Please check storage permission and try again.')
            });
          }, (err) => {
            // alert("Create err: "+JSON.stringify(err));
            path = this.file.dataDirectory;
            this.file.writeFile(path, filename, data, { replace: true }).then(data => {
              // alert("file saved..."+data);
              this.globalobjects.displayCordovaToast("Download complete...");
              if (this.platform.is('ios')) {
                this.documentViewer.viewDocument(path + filename, fileMIMEType, {});
              } else {

                // this.fileOpener.open(path + filename, fileMIMEType)
                //   .then(() => {
                //     //console.log('File is opened')
                //   })
                //   .catch(e => this.globalobjects.presentAlert("file is" + JSON.stringify(e)));
              }
            }, (error) => {
              alert('Error occured while saving file. Please check storage permission and try again.')
            });
          })
        });

      } else {
    if (isPlatformServer(this.platformId)) return;
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(data)
        a.href = objectUrl
        a.download = filename;
        a.click();
        URL.revokeObjectURL(objectUrl);
      }

    }, (err) => {
      this.globalobjects.presentAlert("File not found...");
    })
    // }
  }



  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }


  //   download_text(event, text: string, fileName: string) {
  //     // fileName = fileName.replaceAll(" ","_");
  //      console.log("Wrapper - text content:", text);
  // console.log("Wrapper - filename:", fileName);
  
  //     fileName = 'file' + JSON.stringify((Math.floor(Math.random() * (999999 - 100000)) + 100000)) + ".txt";
  //     if (!this.setting.element.dynamicDownload) {
  //       this.setting.element.dynamicDownload = document.createElement('a');
  //     }
  //     const element = this.setting.element.dynamicDownload;
  //     const fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
  //     element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(text)}`);
  //     element.setAttribute('download', fileName);
  
  
  
  //     let file = new Blob([text], { type: 'text/plain' });
  //     // alert(file);
  //     if (this.platform.is("android") || this.platform.is("ios")) {
  
  //       console.log(fileName);
  //       console.log(JSON.stringify(fileName))
  
  //       let directoryPath = "";
  //       // if (this.platform.is("ios")) {
  //       //   directoryPath = this.file.documentsDirectory;
  //       // }
  
  //       // this.globalobjects.checkStoragePermission().then((res) => {
  //         // if (this.platform.is("android")) {
  //         //   directoryPath = this.file.externalApplicationStorageDirectory.split("Android")[0] + "/Download/";
  //         //   // alert(directoryPath)
  //         // }
  //  if (this.platform.is("ios")) {
  //     directoryPath = this.file.documentsDirectory;
  //   } else if (this.platform.is("android")) {
  //     // Scoped storage-safe location
  //     directoryPath = this.file.externalRootDirectory + 'Download/';
  //     alert(directoryPath+ "android conditions");
  //   } else {
  //     // Web fallback
  //     // const element = document.createElement('a');
  //     // const fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
  //     // element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(text)}`);
  //     // element.setAttribute('download', fileName);
  //     // element.click();
  //     // return;
  //   }
  
  //         this.file.writeFile(directoryPath, fileName, file, { replace: true, append: false })
  //           .then(fileEntry => {
  //             // alert(fileName)
  //             // alert('file')
  //             this.globalobjects.displayCordovaToast("Download complete...");
  //             if (fileEntry) {
  //               // alert('directoryPath')
  //               // console.log('directoryPath')
  //               if (fileEntry.isFile) {
  //                 this.globalobjects.displayCordovaToast("File Generated");
  //                 // alert('file1')
  //               }
  
  //               this.file.checkFile(directoryPath, fileName).then((exist => {
                  
  //                 // alert(exist)
  //                 this.filePath.resolveNativePath(directoryPath + fileName).then((pathIs => {
  //                 }));
  //                    let email = {
  //                 to: '',
  //                 cc: '',
  //                 attachments: [
  //                   directoryPath + fileName
  //                 ],
  //                 subject: '',
  //                 body: '',
  //                 isHtml: true
  //               };
  //               this.emailComposer.open(email);

            
  //                 if (this.platform.is("ios")) {
  //                   this.documentViewer.viewDocument(directoryPath + fileName, 'text/plain', {});
  //                 } else {
  //                   // let mimetype = 'application/pdf';
  //                   // this.fileOpener.open(directoryPath + fileName, mimetype)
  //                   //   .then((exist) => console.log('File is opened' + JSON.stringify(exist)))
  //                   //   .catch(e => this.presentAlert("file is" + JSON.stringify(e)));
  //                 }
  //               })
  //               ).catch(err => {
  //                 // this.globalobjects.presentAlert('Directory' + JSON.stringify(err));
  //               });
  //             }
  //           })
  //           .catch(err => {
  //             this.globalobjects.presentAlert(JSON.stringify(err));
  //           });
  
  //       // });
  //     } else {
  //       saveAs(file, fileName);
  //       var events = new MouseEvent("click");
  //       element.dispatchEvent(events);
  //     }
  //   }
// download_text(event, text: string, fileName: string) {
//   console.log("Wrapper - text content:", text);
//   console.log("Wrapper - filename:", fileName);

//   // Generate a unique filename
//   // fileName = 'file_' + (Math.floor(Math.random() * 900000) + 100000) + ".txt";

//   // Create a Blob from text content
//   const fileBlob = new Blob([text], { type: 'text/plain' });
//   let directoryPath;
// if (this.platform.is("android")) {
//       this.globalobjects.checkStoragePermission().then((res) => {
//         if (res == 'success') {
//           directoryPath = this.file.externalDataDirectory
         
//         } else {
//           this.globalobjects.presentAlert("Please grant storage permission to download file.")
//         }
//       })
//     }



//    try {
//         // await this.file.createDir(directoryPath, subdirectoryName, false);
//         directoryPath = this.file.externalDataDirectory
//         this.file.createFile(directoryPath, fileName, true)
//           .then(() => {

//             this.file.writeFile(directoryPath, fileName, fileBlob, { replace: true })
//               .then(fileEntry => {
//                 if (fileEntry) {
//                   alert('fileEntry'+fileEntry)
//                   if (fileEntry.isFile) {
//                     let email = {
//                       to: '',
//                       cc: '',
//                       attachments: [
//                         // directoryPath + fileName
//                         directoryPath + fileEntry.name
//                       ],

//                       subject: '',
//                       body: '',
//                       isHtml: true
//                     };
//                     alert('fileEntry.isFile'+fileEntry.isFile)
//                     this.emailComposer.open(email);
//                     // alert('fileEntry.isFile'+fileEntry.isFile)
//                     this.globalobjects.displayCordovaToast("File Generated");
//                     this.filePath.resolveNativePath(directoryPath + fileName).then((pathIs => {

//                     }));
//                     // this.documentViewer.viewDocument(directoryPath, type, fileName);
//                   }
//                   // this.file.checkFile(directoryPath, fileName).then((exist => {
//                   //   if (this.platform.is("ios")) {
//                   //     this.document.viewDocument(directoryPath + fileName, type, {});
//                   //   } else {
//                   //   }
//                   // })
//                   // ).catch(err => {
//                   //   this.globalobjects.presentAlert('Directory' + JSON.stringify(err));
//                   // });
//                   this.globalobjects.displayCordovaToast("Download complete...");

//                   let email = {
//                     to: '',
//                     cc: '',
//                     attachments: [
//                       directoryPath + fileEntry.name
//                     ],

//                     subject: '',
//                     body: '',
//                     isHtml: true
//                   };
//                   this.emailComposer.open(email);
//                 }
//               })

//           })
//           .catch(err => {
//             this.globalobjects.presentAlert('Directory' + JSON.stringify(err));

//           });
//       } catch (error) {
//         alert('Error downloading PDF:' + error);

//       }






//   if (this.platform.is("android") || this.platform.is("ios")) {
//     let directoryPath = "";

//     if (this.platform.is("ios")) {
//       directoryPath = this.file.documentsDirectory;
//     } else if (this.platform.is("android")) {
//       // Scoped storage location on Android 11+
//       // directoryPath = this.file.externalDataDirectory ;
//     }

//     console.log("Directory Path:", directoryPath);
//     console.log("Filename:", fileName);

//     // Write the file to device storage
//     // this.file.writeFile(directoryPath, fileName, text, { replace: true })
//     //   .then(fileEntry => {
//     //     console.log("File created:", fileEntry.nativeURL);
//     //     this.globalobjects.displayCordovaToast("Download complete...");

//     //   })
//     //   .catch(err => {
//     //     console.error('File write error:', err);
//     //     this.globalobjects.presentAlert("Write failed: " + JSON.stringify(err));
//     //   });

//   } else {
//     // Fallback for browser
//     const element = document.createElement('a');
//     element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
//     element.setAttribute('download', fileName);
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   }
// }

     shareFile(file:any){
  this.socialSharing.share("", '', file)
  .then(() => console.log('Shared successfully'))
  .catch(err => console.error('Sharing failed:', err));
 }
async download_text(event, text: string, fileName: string) {
  
  if(this.platform.is('android') ) {
  this.createTextFile(event, text, fileName);
  }
  else {
    // Fallback for browser
     if (isPlatformServer(this.platformId)) return;
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', fileName);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}


  // async createTextFile() {
  //   // await this.platform.ready();

  //   const content = 'Hello, this is a text file.';
  //   const fileName = 'example.txt';
  //    try {
  //   // const path = this.file.dataDirectory;
  //       const path = this.file.externalDataDirectory; 
  //   // this.file.writeFile(path, fileName, content, { replace: true })
  //   //   .then(() => console.log('Text file created'))
  //   //   .catch(err => console.error('Error creating text file:', err));

  //        await this.file.writeFile(path, fileName, content, { replace: true });
  //        this.shareFile(path + fileName)
      
  //     } catch (err) {
  //   console.error('File save/share error:', err);
  // }
  
  // }

async createTextFile(event, text: string, fileName: string) {
  // const content = 'Hello, this is a text file.';
   if(fileName.includes("/")){
    fileName=fileName.replaceAll("/","_")
  }
  const path = this.file.externalDataDirectory;

  try {
    await this.file.writeFile(path, fileName, text, { replace: true });

    const exists = await this.file.checkFile(path, fileName);
    if (!exists) throw new Error('File not found after write');
 
    // Optionally copy to cacheDirectory to share safely:
    // const cachePath = this.file.cacheDirectory;
    // await this.file.copyFile(path, fileName, cachePath, fileName);

    await this.socialSharing.shareWithOptions({
      message: '',
      subject: '',
      files: [path + fileName],
      chooserTitle: 'Share File'
    });
    this.globalobjects.presentAlert('Shared successfully');
  } catch (err) {
   this.globalobjects.presentAlert('Shared Failed');
    console.error('File save/share error:', err);
  }
}


    openMarket(){
      if (this.platform.is('ios') || this.platform.is('android')) {
        this.market.open('com.lhs.v7newerp');
      }
    }


     getexceldetail(event) {
        return new Promise((resolve, reject) => {
          let head = [];
          let body = [];
          let tableBody = [];
          let datas: any = {};
    
          let data = [];
    
          const target: DataTransfer = <DataTransfer>(event);
          if (target.files.length !== 1) throw new Error('Cannot use multiple files');
          const reader: FileReader = new FileReader();
          // reader.readAsBinaryString(target.files[0]);
          reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
    
            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    
            /* save data */
            data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1,  raw: false }));
            console.log(data);
    
            let rows = data
    
            for (let i of rows[0]) {
              head.push(i);
            }
            body = rows;
            body.shift();
    
            for (let b of body) {
              let obj = {};
              for (let j = 0; j < b.length; j++) {
                obj[head[j]] = b[j] != undefined ? b[j].toString() : "";
              }
              tableBody.push(obj);
            }
            if (tableBody) {
              datas.head = JSON.parse(JSON.stringify(head))
              datas.tableBody = JSON.parse(JSON.stringify(tableBody));
              resolve(datas);
            }
          };
    
          reader.readAsBinaryString(target.files[0]);
        });
    
    
    
    
    
    
        // let type = file.name.split(".")[1];
    
        // if (type == 'xlsx') {
        //   readXlsxFile(file).then((rows) => {
        //     for (let i of rows[0]) {
        //       head.push(i);
        //     }
        //     body = rows;
        //     body.shift();
    
        //     for (let j of body) {
        //       tableBody.push(j);
        //     }
        //     if (tableBody) {
        //       data.head = JSON.parse(JSON.stringify(head))
        //       data.tableBody = JSON.parse(JSON.stringify(tableBody));
        //       resolve(data);
        //     }
        //   }, error => {
        //     reject(error)
        //   });
        // } else {
        //   let linesR = [];
        //   let lines = [];
        //   let reader: FileReader = new FileReader();
        //   reader.readAsBinaryString(file);
        //   reader.onload = (e) => {
        //     let csv: any = reader.result;
        //     let allTextLines = [];
        //     let allTextLinesPre = [];
        //     allTextLinesPre = csv.split(/\r|\n|\r/);
    
        //     for (let a of allTextLinesPre) {
        //       if (a) {
        //         allTextLines.push(a);
        //       }
        //     }
    
        //     //Table Headings
        //     let headers = allTextLines[0].split(';');
        //     let data = headers;
        //     let arr2 = [];
        //     for (let j = 0; j < headers.length; j++) {
        //       let arr = data[j].split(",");
        //       arr2.push(arr);
        //     }
        //     lines = arr2[0];
        //     //Pusd headings to array variable
    
        //     // Table Rows
        //     let arrl = allTextLines.length;
        //     for (let i = 1; i < arrl; i++) {
        //       if (allTextLines[i]) {
        //         let str = allTextLines[i].split(';');
        //         for (let s of str) {
        //           linesR.push(s.split(","));
        //         }
        //       }
        //     }
    
        //     // for (let j = 0; j < arrl-1; j++) {
        //     //   tarrR.push(rows[j]);
        //     // }
        //     //Push rows to array variable
        //     let datas: any = {};
        //     datas.head = JSON.parse(JSON.stringify(lines))
        //     datas.tableBody = JSON.parse(JSON.stringify(linesR));
        //     resolve(datas);
        //   }
        // }
    
    
    
      }
}

