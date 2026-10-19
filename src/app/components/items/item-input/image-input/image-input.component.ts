import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalController, ActionSheetController, Platform } from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core';
import { DataService } from '../../../../services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Events } from 'src/app/services/events';
import { ModalPage } from 'src/app/pages/modal/modal.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { DomSanitizer } from '@angular/platform-browser';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss'],
})
export class ImageInputComponent implements OnInit {
  @Input() imageinput: any;
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  
  current_page_parameter: any = {};
  isVideoVisible = false;
  isVisible: boolean = false;
  imgData: any;
  platformValue: boolean = true;
  capturedImage: string | null = null;
  
  constructor(
    public modalCtrl: ModalController, 
    public dataService: DataService, private sanitizer : DomSanitizer,
    private globalObjects: GlobalObjectsService,
    private actionSheetController: ActionSheetController, 
    private events: Events,private cdRef: ChangeDetectorRef,
    public platform: Platform
  ) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"image-input")
    }
  }

  ngOnInit() {
    // Query to base64 conversion
    if(this.imageinput.value){
      this.showItemImage(this.imageinput.value);
    }

    this.current_page_parameter = this.globalObjects.current_page_parameter;
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.platformValue = false;
    }

    if (this.imageinput.data_required_flag == 'T' || (this.imageinput.prompt_name && this.imageinput.prompt_name[this.imageinput.prompt_name.length - 1]) == '*') {
      if (this.imageinput.value) {
        this.imageinput.isValid = true;
      } else {
        this.imageinput.isValid = false;
      }
    } else {
      this.imageinput.isValid = true;
    }
  }

  onChange(onChange) {
    if (this.imageinput.value) {
      this.imageinput.isValid = true;
    } else {
      if (this.imageinput.data_required_flag == 'T' || (this.imageinput.prompt_name && this.imageinput.prompt_name.indexOf('*') > -1)) {
        this.imageinput.isValid = false;
      }
    }
    this.emitOnChange.emit(this.imageinput)
  }

  showItemImage(displayPhoto) {
    this.validateInput()
    let fileName = new Date().getTime().toString() + ".jpg"
    this.imgData = '/assets/imgs/no_image.png';
    let url = 'getItemImage?query=' + encodeURIComponent(displayPhoto);
    if (displayPhoto) {
      this.dataService.getData(url)
        .then(res => {
          var data: any = res;
          this.imageinput.isValid = true;
          if (data.status == 'success') {
            this.imageinput.Dvalue =  data.img;
            this.imageinput.value = data.img + "~" + fileName;
          } else {
            this.imageinput.Dvalue = '/assets/imgs/no_image.png';
          }
        }, err => {
        })
    }
  }

  takeImage(itemDbName, flag) {
    // this.dataService.takePhoto(itemDbName, flag).then((imageData: any) => {
      //   this.imageinput.value = imageData + '~' + new Date().getMilliseconds().toString() + ".jpg";
      //   this.imageinput.Dvalue = imageData;
      
      //   console.log(this.imageinput.Dvalue);
      // },
      // (err) => {
        //   alert(JSON.stringify(err));
        
    // })
      this.dataService.takePhoto(itemDbName, flag).then((imageData: any) => {
       this.imageinput.value = imageData.split(",")[1] + '~' + new Date().getMilliseconds().toString() + ".jpg";
      // this.imageinput.value = imageData + '~' + new Date().getMilliseconds().toString() + ".jpg";
      console.log( this.imageinput.value);
      this.imageinput.Dvalue = imageData.split(",")[1];
      // this.imageinput.Dvalue = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageinput.Dvalue);
      console.log( this.imageinput.Dvalue);
      this.imageinput.isValid = true;
      this.validateInput();
      this.cdRef.markForCheck(); // Trigger change detection to update the view
    },
    
      (err) => {
        alert(JSON.stringify(err));
      })
  }

  clearImage() {
    this.imageinput.value = '';
    this.imageinput.Dvalue = '';
    this.stopCamera(); // Stop camera when clearing image
  }

  drawClear() {
    this.imageinput.value = '';
    this.imageinput.Dvalue = '';
  }

  async opensignaturePad() {
    var data = { message: 'hello world' };
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: ModalPage,
        componentProps: { values: data }
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail) {
        this.imageinput.value = detail.data.replace("data:image/png;base64,", "");
        this.imageinput.Dvalue = detail.data.replace("data:image/png;base64,", "");
      }
    });
    await modal.present();
  }

  photoview() {
    this.validateInput()
    this.imgData = 'data:image/png;base64,' + this.imageinput.value;
    this.globalObjects.viewPhoto(this.imgData);
  }

  selectFile(theme, event) {
    this.validateInput();
    let file = event.target.files[0];
    console.log(file);
    this.getBase64(file).then((data: any) => {
      this.imageinput.isValid = true;
      this.imageinput.value = data.split(",")[1] + '~' + file.name;
      this.imageinput.Dvalue = data.split(",")[1];
    });
  }

  getBase64(file) {
    this.validateInput();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async handleButtonClick() {
    this.validateInput();
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Option',
      cssClass: 'cls',
      buttons: [
        {
          text: 'CAMERA', role: 'destructive', handler: () => {
            this.takeImage(this.imageinput.item_db_name, 'CAMERA')
          }
        },
        {
          text: 'GALLERY', handler: () => {
            this.takeImage(this.imageinput.item_db_name, 'PHOTOLIBRARY')
          }
        },
        {
          text: 'DELETE', handler: () => {
            this.clearImage()
          }
        },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  validateInput() {
    if ((this.imageinput.data_required_flag && (this.imageinput.data_required_flag == 'T' || (this.imageinput.prompt_name && this.imageinput.prompt_name.indexOf('*'))))) {
      if (this.imageinput.Dvalue || this.imageinput.value) {
        if (this.imageinput.input_pattern) {
          let pattern = eval(this.imageinput.input_pattern);
          this.imageinput.isValid = pattern.test(this.imageinput.value);
          console.log("Validation Pattern Test Result: ", this.imageinput.isValid);
          if (!this.imageinput.isValid) {
            this.imageinput.vadidateMsg = this.imageinput.tool_tip ? this.imageinput.tool_tip : "Please enter valid " + this.imageinput.prompt_name;
          }
        } else {
          this.imageinput.isValid = true;
          console.log("No Validation Pattern Provided, Marking as Valid");
        }
      } else {
        this.imageinput.isValid = false;
        this.imageinput.vadidateMsg = this.imageinput.tool_tip ? this.imageinput.tool_tip : "Please enter " + this.imageinput.prompt_name;
      }
    } else {
      this.imageinput.isValid = true;
    }
  }

  // Fixed webcam functionality
  async showCamera() {
    this.validateInput();
    
    if (this.isVideoVisible) {
      // If video is visible, capture the image
      this.capture();
    } else {
      // If video is not visible, start the camera
      this.isVideoVisible = true;
      setTimeout(async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (this.videoRef && this.videoRef.nativeElement) {
            this.videoRef.nativeElement.srcObject = stream;
            this.videoRef.nativeElement.play();
          }
        } catch (error) {
          console.error('Camera access error:', error);
          this.isVideoVisible = false; // Reset on error
        }
      }, 100);
    }
  }

  capture() {
    if (!this.videoRef || !this.canvasRef) {
      console.error('Video or canvas reference not available');
      return;
    }

    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw the current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to base64 image
      this.capturedImage = canvas.toDataURL('image/png');
      
      // Update the image input values
      this.imageinput.Dvalue = this.capturedImage.split(",")[1];
      this.imageinput.value = this.imageinput.Dvalue + "~webcam_capture_" + new Date().getTime() + ".png";
      this.imageinput.isValid = true;
      
      // Stop the camera and hide video
      this.stopCamera();
      this.isVideoVisible = false;
      
      // Emit the change event
      this.emitOnChange.emit(this.imageinput);
      this.onChange(this.imageinput);
      
      console.log("Image captured successfully");
    }
  }

  stopCamera() {
    if (this.videoRef && this.videoRef.nativeElement) {
      const stream = this.videoRef.nativeElement.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        this.videoRef.nativeElement.srcObject = null;
      }
    }
    this.isVideoVisible = false;
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}