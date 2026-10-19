import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-entry-list',
  templateUrl: './entry-list.page.html',
  styleUrls: ['./entry-list.page.scss'],
})
export class EntryListPage implements OnInit {

  erpApprDetails: any = [];
  erpApprDetails2: any = [];
  pageinfo: any = {};
  id: number = 0;
  wsdp: any = {};
  wscp: any = {};
  frame: any = {};
  userDetails: any;
  object_mast: any = {};
  wslp: any = {};
  click_events_str;
  l_url = "S2U";
  object_arr: any;
  page_no: number = 0;

  l_approvalDetails: any = [];

  isModal: any;

  Details: any = [{ heading: "Sc No", values: "scy19y-20014", head2: "head2", val2: "val2" }, { heading: "Sc No", values: "scy19y-200154" }, { heading: "Sc No", values: "scy19y-200414" }, { heading: "Sc No", values: "scy19y-20014" }];
  items: any = [{ heading: "abc", values: "scy19y-20014" }];
  Add_No: any = [{ heading: "xyz", values: "scy19y-20014" }];
  TandC: any = [{ heading: "abc", values: "scy19y-20014" }];
  Attachment: any = [{ heading: "abcd", values: "123" }];

  hide_appr_buttons: boolean = false;


  constructor(private dataService: DataService, private globalObjects: GlobalObjectsService,
    public modalCtrl: ModalController, public alertController: AlertController) {
    this.frame.apps_page_name = "";
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"entry-list-page")
    }
  }

  ngOnInit() {
    this.frame.apps_page_name = "";
    this.getData();
    this.getPageInfo();

  }
  selectTab(i) {
    this.id = i;
    this.getFrameData(i)

  }

  closeModal(flag) {
    this.modalCtrl.dismiss(flag);
  }
  
  getData() {
    this.globalObjects.showLoading();
    this.frame.apps_page_name = "";
    let wscp = this.wscp;
    if (this.wscp.click_events_str.indexOf('~') > -1) {
      let data = this.wscp.click_events_str.split('~');
      if (data.indexOf('hide_appr_buttons') > -1) {
        this.hide_appr_buttons = true;
      }
    }
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.get_tab_count_pages = 'get_tab_count_pages';
    let data = {
      "wslp": this.wslp,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    this.dataService.postData(this.l_url, data).then(res => {

      let resdata: any = res;
      let objData = this.globalObjects.setPageInfo(resdata.responseData);
      this.l_approvalDetails = objData.Level1;
      for (let item of this.l_approvalDetails) {
        this.erpApprDetails.push(item.APPS_PAGE_FRAME_NAME);
      }
      this.getFrameData(0);


    }).catch(err => {
      this.globalObjects.presentToast("get_tab_count_pages Something went wrong please try again later!");
    })
  }

  setPageData(objData, index, pagddeNo) {
    //----------------------
    let addonArr = [];
    for (let Level1 of objData.Level1) {
      let level1Str: any = JSON.parse(JSON.stringify(Level1));
      if (Level1.STR) {
        // ADDON: "Insurance~0@Freight~0@SGST~102524@UGST~@CGST~102524@IGST~0@TCS~0@Round off~0@
        var str = JSON.parse(JSON.stringify(Level1.STR.split('@')));
        let count = 0;
        for (let arr of str) {
          if (arr.split('~')[0]) {
            level1Str[("STR" + count)] = arr.split('~')[1];
            addonArr.push(arr.split('~')[0]);
          }
          count = count + 1;
        }
      }
      if (this.l_approvalDetails[index].pageDetails) {
        this.l_approvalDetails[index].pageDetails.push(level1Str)
      } else {
        this.l_approvalDetails[index].pageDetails = [];
        this.l_approvalDetails[index].pageDetails.push(level1Str)
      }
    }

    //------------------------------
    let j = 1;
    for (let Level2 of this.object_mast.Level2) {
      if (Level2.apps_page_no == this.l_approvalDetails[index].APPS_PAGE_NO) {
        for (let Level3 of Level2.Level3) {
          for (let Level4 of Level3.Level4) {
            for (let leve5 of Level4.Level5) {
              let count = 0;
              if (leve5.item_name == "STR") {
                for (let add of addonArr) {
                  let leve55 = JSON.parse(JSON.stringify(leve5));
                  leve55.item_name = ("STR" + count);
                  leve55.prompt_name = add;
                  leve55.item_visible_flag = 'T';
                  Level4.Level5.push(leve55);
                  count = count + 1;
                }
              }
            }
          }
        }
      }
      j = j + 1;
    }
    //------------------------------
  }

  getPageInfo() {
    this.globalObjects.showLoading();

    let wscp = JSON.parse(JSON.stringify(this.wscp));
    wscp.service_type = "get_object_config";
    let reqData: any = {};
    reqData = {
      "wslp": this.wslp,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    this.dataService.postData("S2U", reqData).then(res => {
      
      let data: any = res;
      if (data.responseStatus == "success") {
        this.object_arr = data.responseData
        let objData = this.globalObjects.setPageInfo(data.responseData);
        this.object_mast = objData.Level1[0];
      }
    }).catch(err => {
      this.globalObjects.presentToast("5 Something went wrong please try again later!");
    })
  }

  setPageInfo() {
    for (let page of this.object_mast.Level2) {
      for (let frame of page.Level3) {
        for (let itemGroup of frame.Level4) {
          let itemMast: any = [];
          for (let item of itemGroup.Level5Values) {
            let item1 = {};
            let count = 0;
            for (let key of itemGroup.Level5Keys) {
              item1[key] = item[count];
              count++;
            }
            itemMast.push(item1);

          }
          itemGroup.Level5 = itemMast;
          delete itemGroup['Level5Keys'];
          delete itemGroup['Level5Values'];
        }
      }
    }
  }

  get_remark(a_message, a_approveFlag) {
    this.presentAlert(a_message, a_approveFlag);
  }

  async presentAlert(a_message, a_approveFlag) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: '<strong>' + a_message + '</strong>!!!',
      inputs: [
        {
          name: 'remark',
          type: 'text',
          placeholder: 'Remark',

        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => { //takes the data 
            //console.log('ok pressed');
            this.auto_approval_process(alertData.remark, a_approveFlag);

          }    
        }
      ]
    });
    await alert.present();

  }

  auto_approval_process(a_appremark, a_approveFlag) {
    let wsdp = [];
    let index = 0;

    for (let Level3 of this.object_mast.Level2[0].Level3) {
      let dp: any = {};
      for (let Level4 of Level3.Level4) {
        for (let item of Level4.Level5) {
          if (item.item_name == 'VRNO' || item.item_name == 'ENTITY_CODE' || item.item_name == 'TCODE' || item.item_name == 'TNATURE') {
            dp[item.item_name] = this.l_approvalDetails[index].pageDetails[index][item.item_name]
          }
        }

      }
      dp.REMARK = a_appremark;
      dp.APPROVAL_FLAG = a_approveFlag;
      wsdp.push(dp);

    }

    let wscp = this.wscp;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.service_type = "APPROVE_REJECT";
    let data = {
      "wslp": this.wslp,
      "wscp": wscp,
      "wsdp": wsdp
    }
    this.dataService.postData(this.l_url, data).then(res => {
      let resdata: any = res;
      this.closeModal(true);
    }).catch(err => {
      
      this.globalObjects.presentToast("5 Something went wrong please try again later!");
    })
  }

  getFrameData(index) {
    this.globalObjects.showLoading();
    if (this.l_approvalDetails[index].pageDetails) {
    } else {
      let wscp = this.wscp;
      wscp.a_page_no = this.l_approvalDetails[index].APPS_PAGE_NO;
      let inner_data = {
        "wslp": this.wslp,
        "wscp": wscp,
        "wsdp": this.wsdp
      }
      this.dataService.postData(this.l_url, inner_data).then(res1 => {
        let data: any = res1;
       
        let itemCounr = 0;
        for (let item of this.l_approvalDetails) {
          let objData = this.globalObjects.setPageInfo(data.responseData);
          if (item.APPS_PAGE_NO == objData.Level1[0].APPS_PAGE_NO) {
            if (item.APPS_FRAME_TYPE == "STRING") {
              this.setPageData(objData, itemCounr, item.APPS_PAGE_NO);
            } else {
              for (let level1 of objData.Level1) {
                if (item.pageDetails) {
                  item.pageDetails.push(level1)
                } else {
                  item.pageDetails = [];
                  item.pageDetails.push(level1)
                }
              }
            }
          }
          itemCounr = itemCounr + 1;
        }
        // ---switch
      }).catch(err => {
        this.globalObjects.presentToast("11 Something went wrong please try again later!");
      })
    }
  }

  callObject(item, index) {}
}





