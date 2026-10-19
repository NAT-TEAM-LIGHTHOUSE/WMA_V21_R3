import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
// changeDetection:ChangeDetectionStrategy.OnPush,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-dashboard-default',
  templateUrl: './frame-dashboard-default.component.html',
  styleUrls: ['./frame-dashboard-default.component.scss'],
})
export class FrameDashboardDefaultComponent implements OnInit,OnDestroy {
  @Input() frame: any = {};
  @Output() quickLinksemit: EventEmitter<any> = new EventEmitter<any>();
  @Input() wsdp: any = {};
   @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  userLoginDate = "";
  constructor(private globalObjects : GlobalObjectsService,private dataService : DataService,private cdr: ChangeDetectorRef,private cdEngine: CdEngineService) { }
imgData: any;
 ngOnDestroy(): void {
    this.cdEngine.unregister(this.frame.apps_page_frame_seqid);
  }
  ngOnInit() {
    this.cdEngine.register(this.frame.apps_page_frame_seqid, this.cdr);
    // alert('Default Dashboard Frame Loaded');
    // console.log(JSON.stringify(JSON.parse(this.frame)));
    this.userDetails =  this.userDetails = this.globalObjects.getLocallData("userDetails");
    let frameData = this.frame;
    for(let itemData of frameData.Level4){
      for(let items of itemData.Level5){
        if(items.item_name == 'SYS_COVER_IMAGE' && items.value){
          this.showItemImage(items);
        }
        // console.log('Item Data', items);
      }
    }

    this.setUserLoginDateFormat();
  }


    setUserLoginDateFormat() {
    // formatDate
    let stringDate = this.userDetails.first_login_time_formatted
    this.userLoginDate = this.globalObjects.formatDate(stringDate, "dd-MMM-yyyy hh:mm:ss a");
  }



    quickLinks() {
    // if(this.isLeftBarOnMobile){
      // this.canvasModal.popDismiss("","quickLinks")
    // }else{
      this.quickLinksemit.emit();
    // }
   
  }

  itemClicked(event){
    this.emitPass.emit(event)
  }

    showItemImage(displayPhoto) {
    this.imgData = '/assets/imgs/no_image.png';
    if (displayPhoto) {
      let url = 'getItemImage?query=' + encodeURIComponent(displayPhoto.value);
      if (displayPhoto.value) {
        this.dataService.getData(url)
          .then(res => {
            var data: any = res;
            if (data.status == 'success') {
              this.imgData = 'data:image/png;base64,' + data.img;
              console.log(this.imgData)
            } else {
              this.imgData = '/assets/imgs/no_image.png';
            }
          }, err => {
            this.imgData = null;
          })
      }
    }
  }
}
