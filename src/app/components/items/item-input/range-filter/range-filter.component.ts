import { Component, OnInit,Input} from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { SingleSelectLovPage } from 'src/app/pages/single-select-lov/single-select-lov.page';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[STANDALONE_IMPORTS],
  selector: 'app-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss'],
})
export class RangeFilterComponent implements OnInit {
  @Input() rFilter: any;
  @Input() itemData:any;
  @Input() parentComponent: any;
  wscp: any = {};
  userDetails:any;

  min=0
  max=0
  range: number =0;
  
  current_page_parameter: any = {};
  constructor(private globalObjects: GlobalObjectsService,  public dataService: DataService,public modalCtrl: ModalController) {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"range-filter")
    }
   }

  ngOnInit() {
    this.rFilter.item_sub_type = 'M';
    let itemfilterData = JSON.parse(JSON.stringify(this.itemData))
    let countData=[]
    for (let x of itemfilterData) {
      for (let y of x) {
        if (y.Level5[0].item_name == this.rFilter.item_name && y.Level5[0].value) {
          countData.push( y.Level5[0].value)
        }
      }
    }
    let dc=[...new Set(countData)]
    this.min=Math.min(...dc)
    this.max=Math.max(...dc)
    this.range =this.max;
  }
 
  getrangedata(){
    let wsdp = [];
    if (this.rFilter.item_enable_flag && (!(this.rFilter.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.rFilter.item_enable_flag == 'F'))) {
      return false;
    } else {
    
      let col = {};
      if (this.parentComponent.frame.tableRows) {
        for (let itemGroup of this.parentComponent.frame.tableRows[0]) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues
              } else {
                col[item.apps_item_seqid] = item.value
              }
            }
          }
        }
      } else {
        for (let itemGroup of this.parentComponent.frame) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues
              } else {
                col[item.apps_item_seqid] = item.value
              }
            }
          }
        }
      }
      wsdp.push(col);
    }
    this.getPageInfo(wsdp) 
  }
  


  getPageInfo(wsdp) {
    this.globalObjects.showLoading();
    this.wscp.service_type = "get_lov_data";
    this.wscp.apps_page_no = this.rFilter.apps_page_no;
    this.wscp.apps_page_frame_seqid = this.rFilter.apps_page_frame_seqid;
    this.wscp.apps_item_seqid = this.rFilter.apps_item_seqid;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.wscp["object_code"] = this.rFilter.object_code;
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": this.wscp,
      "wsdp": wsdp
    }
    this.dataService.postData("S2U", reqData).then(res => {
      
      
      let data: any = res;
      //console.log("data in rangefilter",res);
      // if (data.responseStatus == "success") {
      //   this.object_arr = data.responseData
      //   let objData = this.globalObjects.setPageInfo(data.responseData);
      //   this.objectList = objData.Level1;
      //   this.Object_code = objData.Level1[0];
      //   delete this.Object_code['Level2'];
      //   // this.objectList = this.object_arr.Level1;
      //   for (let code in this.Object_code) {
      //     this.keyList.push(code);
      //   }
      // }
    }).catch(err => {
      
      this.globalObjects.presentToast("4 Something went wrong please try again later!");
    })
  }
  
  async openLov() {
    if (this.rFilter.item_enable_flag && (!(this.rFilter.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.rFilter.item_enable_flag == 'F'))) {
      return false;
    } else {
      let wsdp = [];
      let col = {};
      if (this.parentComponent.frame.tableRows) {
        for (let itemGroup of this.parentComponent.frame.tableRows[0]) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues
              } else {
                col[item.apps_item_seqid] = item.value
              }
            }
          }
        }
      } else {
        for (let itemGroup of this.parentComponent.frame) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues
              } else {
                col[item.apps_item_seqid] = item.value
              }
            }
          }
        }
      }
      wsdp.push(col);

      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: SingleSelectLovPage,
          componentProps: { paramValue: this.rFilter, wsdp: wsdp, prompt_name: this.rFilter.prompt_name }
        });
      modal.onDidDismiss().then((detail: OverlayEventDetail) => {
        if (detail) {
          this.rFilter.codeOfValues = detail.data.codeOfValues;
          this.rFilter.value = detail.data.value;
        }
      });
      await modal.present();
    }
  }
  onIonChange(event) {
    console.log('ionChange emitted value:',event.detail.value);
    this.range=event.detail.value
    let datakey = [];
    datakey.push(event.detail.value)
    this.rFilter.value = datakey.toString();
    this.rFilter.codeOfValues = datakey.toString();
  }
}
