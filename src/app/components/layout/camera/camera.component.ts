import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
iframeUrl:any;
  @Input() dataObj: string;
    private destroy$ = new Subject<void>();
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
     if (this.dataObj) {
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dataObj);
      console.log("Received URL:", this.dataObj);
    }
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        // 1. Security: Only listen to your trusted iframe domain
        // filter(event => event.origin === 'https://your-iframe-domain.com'),
        // 2. Filter for the specific "close" action
        filter(event => event.data.action === 'CLOSE_MODAL'),
        // 3. Clean up when component is destroyed
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closePopup();
      });
  }
   closePopup() {
    const canvas = document.querySelectorAll("#openCameraPopover")
    const event: any = new Event('click');
    let dispatchCanvas = canvas[canvas.length - 1]
    event.isOffcanvasClose = true
    dispatchCanvas.dispatchEvent(event)
    // this.canvasModal.popDismiss(); // Or your specific logic to hide the popup
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
