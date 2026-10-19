import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonicSlides } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-img-slider',
  templateUrl: './frame-img-slider.component.html',
  styleUrls: ['./frame-img-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FrameImgSliderComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  // @ViewChild('slides') slides: IonSlides;
  userDetails: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: true,
  };

  sliderList = [];
  flag:boolean = false;

  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-img-slider")
    }
  }

  ngOnInit() {
    if(this.frame.on_frame_load_str){
      this.flag = true
      this.getData();
    } 
  }

  prev() {
    // this.slides.slidePrev();
  }
  next() {
    // this.slides.slideNext();
  }
  itemClicked(event, i) {
    delete this.frame['executing_index'];
    this.emitPass.emit(event);
  }


  getImages(query) {
    let url = 'getItemImage?query=' + encodeURIComponent(query);
    this.dataService.getData(url)
      .then(res => {
        var data: any = res;
        if (data.status == 'success') {
          this.sliderList.push(data.img);
        } else {
        }
      }, err => {
      })
  }

  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.object_code = this.frame.object_code;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
    }


    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      let data: any = res;
      if (data.responseStatus == "success") {
        let tableRows = [];
        let objData = this.globalObjects.setPageInfo(data.responseData);

        let tableData = objData.Level1;

        let tableKey = [];
        if (tableData.length > 0) {
          tableKey = Object.keys(tableData[0]);
        }
        let i = 0;
        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
          let colRow = [];
          let barRows = [];
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                  this.getImages(item.value)
                }
              }
            }
          }
          tableRows.push(barRows);
        }
      }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
    })
  }
}
