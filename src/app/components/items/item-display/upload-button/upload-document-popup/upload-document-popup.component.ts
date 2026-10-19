import { Component,ElementRef,OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular/standalone';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-upload-document-popup',
  templateUrl: './upload-document-popup.component.html',
  styleUrls: ['./upload-document-popup.component.scss'],
})
export class UploadDocumentPopupComponent implements OnInit{

  sanitizedUrl
  constructor(public platform: Platform,public sanitizer: DomSanitizer) { }
  docData:any=""
  isNoPreview=false
  fileNames
  isVideo=false
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  ngOnInit() {
    if(!this.isNoPreview){
      this.docData=this.sanitizer.bypassSecurityTrustResourceUrl(this.sanitizedUrl);
    console.log("documentPopup",this.docData)
      if(this.isVideo){
        //  let videoUrl = URL.createObjectURL(this.sanitizedUrl);
          // Optional cleanup when video finishes loading
      this.videoPlayer?.nativeElement.addEventListener('loadeddata', () => {
        URL.revokeObjectURL(this.docData!);
      });
      }
        
      

    }
  }
  download(){
    const a = document.createElement("a");
    a.href = this.sanitizedUrl;
    a.download =this.fileNames;
    a.click();
    URL.revokeObjectURL(this.sanitizedUrl);
  }
  disableRightClick(event){
    event.preventDefault();
  }

}