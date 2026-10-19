import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-embeded-link',
  templateUrl: './embeded-link.component.html',
  styleUrls: ['./embeded-link.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class EmbededLinkComponent implements OnInit {
  @Input() streamEvent: any;
  ngOnInit(): void {
    console.log(this.streamEvent);
    if (this.streamEvent && this.streamEvent.value) {
      this.loadVideo(this.streamEvent.value);
    }
    // alert("streamEvent");
  }

  videoUrl: string = '';
  videoId: string = '';
  videoUrlWithParams: SafeResourceUrl | undefined;

  constructor(private sanitizer: DomSanitizer) { }

  loadVideo(vidUrl) {
    // const videoId = this.extractVideoId(vidUrl);
    // if (videoId) {
    //   const url = `https://www.youtube.com/embed/${videoId}?disablekb=1&controls=0`;
    //   this.videoUrlWithParams = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // } else {
    //   this.videoUrlWithParams = undefined;
    // }

    if(vidUrl){
      
      const videoId = this.extractVideoId(vidUrl);
      if (videoId) {
        const url = `https://www.youtube.com/embed/${videoId}?disablekb=1&controls=0`;
        this.videoUrlWithParams = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        console.log(this.videoUrlWithParams);
      } else {
        // this.videoUrlWithParams = undefined;
        this.videoUrlWithParams = this.sanitizer.bypassSecurityTrustResourceUrl(vidUrl);
        
        console.log(this.videoUrlWithParams);
      }
    }
    
  }

  private extractVideoId(url: string): string {
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : '';
  }



//   setLink(vidUrl){
// this.videoUrl= vidUrl;
//   }



}


