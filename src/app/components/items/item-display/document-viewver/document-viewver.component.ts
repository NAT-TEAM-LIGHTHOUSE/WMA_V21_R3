// import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
// import { Platform } from '@ionic/angular/standalone';
// import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
// import { File } from '@awesome-cordova-plugins/file/ngx';
// import { DataService } from 'src/app/services/data.service';
// import { applyLoggingDecorator } from 'src/app/services/decorator-application';
// import { GlobalObjectsService } from 'src/app/services/global-objects.service';


// export class DocumentViewverComponent implements OnInit {

//   docName : any;
//   documentUrl: string ="";

//   document: any;
//   viewDocument=false;
//   @Input() doc: any;
//   docFile:any;

//   @ViewChild('pdfIframe') pdfIframe: ElementRef;
//   @Input() streamEvent: any
//   sanitizedUrl: SafeResourceUrl | undefined;

//   constructor(private sanitizer: DomSanitizer,private file : File,private fileOpener : FileOpener, private globalObject: GlobalObjectsService,private dataService: DataService,private iab : InAppBrowser,public platform : Platform) {
//     if(this.globalObject.itemFlag){
//       return applyLoggingDecorator(this,"document-viewver")
//     }
//   }

//   ngOnInit(): void {
//     this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.documentUrl);
//     // this.openPDF(t)
//     if(this.platform.is('android')){
//       this.download();
//     }
//   }




//   async openPDFInBrowser(base64Data: string) {
//   const mimeType = 'application/pdf';
//   const pdfBase64 = `data:${mimeType};base64,${base64Data}`;

//   // InAppBrowser opens the PDF as a data URI
//   this.iab.create(pdfBase64, '_blank', {
//     location: 'no',
//     zoom: 'yes',
//     toolbar: 'yes'
//   });
// }

// async openPDF(pdfBlob: Blob) {
//   if (this.platform.is('android')) {
//     try {
//       const fileName = 'temp_' + Date.now() + '.pdf';
//       await this.file.writeFile(
//         this.file.externalDataDirectory,
//         fileName,
//         pdfBlob,
//         { replace: true }
//       );

//       const filePath = this.file.externalDataDirectory + fileName;

//       // Open with FileOpener instead of InAppBrowser
//       await this.fileOpener.open(filePath, 'application/pdf');
//       console.log('PDF opened with default app');
//     } catch (err) {
//       console.error('Error saving/opening PDF', err);
//     }
//   } else {
//     // Web / iOS fallback
//     const url = URL.createObjectURL(pdfBlob) + '#toolbar=0';
//     this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
//   }
// }
// extractPdfDocumentId(blob: Blob): string {
//   if (this.platform.is('android')) {
//     this.openPDF(blob); // Opens with FileOpener
//     return ''; // No iframe
//   }
//   const blobUrl = URL.createObjectURL(blob);
//   return blobUrl.length > 0 ? blobUrl + '#toolbar=0' : '';
// }

// async download() {
//   let type = await this.globalObject.getMIMEtype(this.document[1].split(".")[1]);
//   this.base64ToArrayBuffer(this.docFile).then((res: any) => {
//     let blob = new Blob([res], { type });

//     if (this.platform.is('android')) {
//       // Open directly, no iframe
//       this.openPDF(blob);
//     } else {
//       // Browser/iOS
//       const url = this.extractPdfDocumentId(blob);
//       this.documentUrl = url;
//       this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
//     }
//   });
// }

//   showDocument() {

//     this.viewDocument=true;
//     console.log(this.document);
//     let doc = this.document[0];
 

// if (doc) {
//       // console.log("path : "+doc);
//       if(doc.split("#")[0].toUpperCase().includes("FILEPATH")){
//         let filepath=doc.split("#")[1];
//         // console.log("path valueddfd : "+filepath);
//         let url = 'getFileDataFromPath?path=' + encodeURIComponent(filepath);
//         this.dataService.getData(url)
//           .then(res => {
//             var data: any = res;
//             if (data.status == 'success') {
//               console.log("data after executing query : ");
//               console.log(data);
//               this.docFile = data.img;
//               this.download();
//             }
//           }, err => {
//             this.document = null;
//           })
//       }else{
//         // /   console.log("path : "+doc);
//       let url = 'getItemImage?query=' + encodeURIComponent(doc);
//         this.dataService.getData(url)
//           .then(res => {
//             var data: any = res;
//             if (data.status == 'success') {
//               console.log("data after executing query : ");
//               console.log(data);
//               this.docFile = data.img;
//               this.download();
//             }
//           }, err => {
//             this.document = null;
//           })
//       }
      
//       }

    



//   }
//   // async download() {

//   //   let type = await this.globalObject.getMIMEtype(this.document[1].split(".")[1]);
//   //   this.base64ToArrayBuffer(this.docFile).then((res: any) => {
//   //     let blob = new Blob([res], { type: type });
//   //     const url = this.extractPdfDocumentId(blob);
//   //     this.documentUrl=url;
//   //     this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.documentUrl);
//   //   })
//   // }

//   base64ToArrayBuffer(base64) {
//     return new Promise((resolve, reject) => {
//       var binaryString = window.atob(base64);
//       var binaryLen = binaryString.length;
//       var bytes = new Uint8Array(binaryLen);
//       for (var i = 0; i < binaryLen; i++) {
//         var ascii = binaryString.charCodeAt(i);
//         bytes[i] = ascii;
//       }
//       resolve(bytes);
//     })
//   }


//   loadDocument(){
    
//     if(this.doc.value){
//       console.log("query value "+this.doc.value);
//       this.document = this.doc.value.split('~');
//       console.log("document[0]"+this.document[0]);
//       console.log("document[0]"+this.document[1]);
//       this.docName= this.document[1];
//       this.showDocument();
//     }
//   }

//   getSize(blob: Blob) {
//     const sizeInBytes = blob.size;
//     const sizeInKB = (sizeInBytes / 1024).toFixed(2);
//     const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
//   }

// }




//    // if (doc) {
//     //   console.log("path : "+doc);
//     //   let url = 'getItemImage?query=' + encodeURIComponent(doc);
//     //     this.dataService.getData(url)
//     //       .then(res => {
//     //         var data: any = res;
//     //         if (data.status == 'success') {
//     //           console.log("data after executing query : ");
//     //           console.log(data);
//     //           this.docFile = data.img;
//     //           this.download();
//     //         }
//     //       }, err => {
//     //         this.document = null;
//     //       })
//     //   }







//       //openPDF(pdfBlob: Blob) {
//   //const url = URL.createObjectURL(pdfBlob);
//   //const browser = this.iab.create(url, '_self', { location: 'no', zoom: 'no' });
// //}

//   // isBlobUrl(url): boolean {
//   //   return url.startsWith('blob:');
//   // }

//   // loadUrl(url) {
//   //   this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#toolbar=0');
//   // }

//   // loadPdf(blobData) {
//   //   const url = this.extractPdfDocumentId(blobData);
//   //   this.documentUrl=url;
//   //   if (url != '') {
//   //     this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.documentUrl);
//   //   } else {
//   //     this.documentUrl = undefined;
//   //   }
//   // }
//   //extractPdfDocumentId(blob): string {
//     //if(this.platform.is('android')){
//     //this.openPDF(blob);
//     //return;
//     //}
//     //var blobUrl = URL.createObjectURL(blob);
//     //const dvblobUrl = blobUrl + '#toolbar=0';
//     //return blobUrl.length > 0 ? dvblobUrl : '';
//   //}
//   // setUrl() {
//   //   console.log("document url : " + this.documentUrl);
//   //   this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.documentUrl);
//   // }

//   // check() {
//   //   alert("check");
//   // }

//   // loadpdfValue(val) {
//   //   if (this.isBlobUrl(val)) {
//   //     this.loadPdf(val);
//   //   } else {
//   //     this.loadUrl(val);
//   //   }
//   // }


import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular/standalone';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { isPlatformServer } from '@angular/common';


@Component({
standalone : true,
  selector: 'app-document-viewver',
  templateUrl: './document-viewver.component.html',
  styleUrls: ['./document-viewver.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class DocumentViewverComponent implements OnInit {

  @Input() doc: any;
  @Input() streamEvent: any;

  docName: string = '';
  document: any;
  docFile: string;
  documentUrl: string = '';
  sanitizedUrl: SafeResourceUrl;
  viewDocument = false;
plt :any;
  constructor(
    private sanitizer: DomSanitizer,
    private file: File,private cdr : ChangeDetectorRef,
    private fileOpener: FileOpener,
    public globalObject: GlobalObjectsService,
    private dataService: DataService,
    private iab: InAppBrowser,
    public platform: Platform,@Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.globalObject.itemFlag) {
      return applyLoggingDecorator(this, 'document-viewver');
    }
  }

  ngOnInit(): void {
         if ( this.platform.is('android')) {
      this.plt = 'android';
    } else if (this.platform.is('ios')) {
      this.plt = 'ios';
    }else{
      this.plt = 'browser';
    }
    this.loadDocument();
  }

  /** Load the document when the value changes */
  loadDocument() {
    if (this.doc.value) {
      this.document = this.doc.value.split('~');
      this.docName = this.document[1] || '';

      this.showDocument();
    }
  }

  /** Fetch the document file from API */
  showDocument() {
    if (!this.document || !this.document[0]) return;

    const doc = this.document[0];

    let url: string;
    if (doc.split("#")[0].toUpperCase().includes("FILEPATH")) {
      const filepath = doc.split("#")[1];
      url = 'getFileDataFromPath?path=' + encodeURIComponent(filepath);
    } else {
      url = 'getItemImage?query=' + encodeURIComponent(doc);
    }

    this.dataService.getData(url).then(
      (res: any) => {
        if (res.status === 'success') {
          this.docFile = res.img;
          this.download();
        }
      },
      () => {
        this.document = null;
      }
    );
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
  async download() {
    let type = await this.globalObject.getMIMEtype(
      this.document[1].split(".")[1]
    );
    // this.base64ToArrayBuffer(this.docFile).then((res: Uint8Array) => {
    this.base64ToArrayBuffer(this.docFile).then((res: any) => {
      const blob = new Blob([res], { type });

      if (this.platform.is('android')) {
        // Android → open with default app
        this.openPDF(blob);
      } else {
        // Browser/iOS → show in iframe
        const url = URL.createObjectURL(blob) + '#toolbar=0';
        this.documentUrl = url;
        this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.cdr.detectChanges();
        this.viewDocument = true;
      }
    });
  }
downloadBase64Pdf(base64Data: string, fileName: string) {
  // Convert base64 to binary array
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  // Create PDF Blob
  const blob = new Blob([byteArray], { type: "application/pdf" });

  // Create Blob URL for download
  const blobUrl = URL.createObjectURL(blob);

  // Create download link
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName || "document.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(blobUrl);
}



downloadFile() {
  if (!this.docFile) return;

  this.downloadBase64Pdf(this.docFile, this.docName);
}


  /** Open PDF in Android default viewer */
  async openPDF(pdfBlob: Blob) {
    try {
      const fileName = `temp_${Date.now()}.pdf`;
      const filePath = this.file.externalCacheDirectory || this.file.externalDataDirectory;

      await this.file.writeFile(filePath, fileName, pdfBlob, { replace: true });
      await this.fileOpener.open(filePath + fileName, 'application/pdf');
      console.log('PDF opened with default viewer');
    } catch (err) {
      console.error('Error opening PDF on Android', err);
    }
  }
}
