import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-help-video',
  templateUrl: './help-video.component.html',
  styleUrls: ['./help-video.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class HelpVideoComponent implements OnInit {

  @Input() frame: any;
  showVideoModal: boolean = false;
  selectedVideoUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
     console.log("help chat frame",this.frame)
     for(let frm of this.frame.Level4){
      for(let item of frm.Level5){
        // for(let item of key){
          console.log("itemttttt",item.item_default_value);
        // }
      }
     }
  }

  openVideo(item: any) {
    if (item.item_default_value) {
      const embedUrl = this.getYouTubeEmbedUrl(item.item_default_value);
      this.selectedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      this.showVideoModal = true;
    }
  }

  getYouTubeEmbedUrl(url: string): string {
    let videoId = '';
    
    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url; // Already in embed format
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  closeVideo() {
    this.showVideoModal = false;
    this.selectedVideoUrl = '';
  }

}
