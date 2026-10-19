import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { SingleSelectLovPage } from 'src/app/pages/single-select-lov/single-select-lov.page';
import { OverlayEventDetail } from '@ionic/core/components';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { ModalController } from '@ionic/angular/standalone';
import { Events } from 'src/app/services/events';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports: [STANDALONE_IMPORTS],
  selector: 'app-ionchip-filter',
  templateUrl: './ionchip-filter.component.html',
  styleUrls: ['./ionchip-filter.component.scss'],
})
export class IonchipFilterComponent implements OnInit,OnDestroy {
  @Input() iFilter: any;
 
  @Input() parentComponent: any;
 
   @Input() itemData: any;
   @Input() item: any;
  wscp: any = {};
  
   map = new Map();
  Vlength: number;
  ValuesSelect: any = [];
  dataSet: any = [];
  range: number = 0;
  indextoAdd: number = -1;
  keyChecked = [];
 
  itemDataArr: any = [];
  current_page_parameter: any = {};
  constructor(private globalObjects: GlobalObjectsService, public modalCtrl: ModalController,
    public events: Events) {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"ionchip-filter")
    }
  }

  ngOnDestroy() {}

  ngOnInit() {

    this.iFilter.item_sub_type = 'M';
    if (this.itemData) {
      this.getDepData();
    } else {
      // this.getrangedata();
    }
  }

  clearall(dataSet) {

    for (let x of this.ValuesSelect) {
      if (x.clickedElement) {
        if (x.clickedElement.nodeName === "ION-BUTTON") {
          let elemClasses = (x.clickedElement as HTMLIonButtonElement).classList;
          let isActive = elemClasses.contains("active");
          if (isActive) {
            elemClasses.remove("active");
            elemClasses.add("inactive");
          } else {
            x.clickedElement.className += " active";
          }
        }
      }
      if (x.isChecked) {
        x.isChecked = false;
      }
    }
    this.iFilter.value = "";
    this.iFilter.codeOfValues = "";
    this.ValuesSelect = [];
    this.indextoAdd = -1;
    this.range = 10;
    if (this.range > this.Vlength) {
      this.range = this.Vlength;
    }
    if (this.itemDataArr.length > 0) {
      this.getDepData();
    }
  }

  increaseRange() {

    this.range = 10 + this.range;
    if (this.range > this.Vlength) {
      this.range = this.Vlength
    }

  }

  async openLov() {
    if (this.iFilter.item_enable_flag && (!(this.iFilter.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.iFilter.item_enable_flag == 'F'))) {
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
          componentProps: { paramValue: this.iFilter, wsdp: wsdp, prompt_name: this.iFilter.prompt_name, wscp: this.wscp }
        });
      modal.onDidDismiss().then((detail: OverlayEventDetail) => {
        if (detail) {
          if (detail.data.codeOfValues) {
            this.iFilter.codeOfValues = detail.data.codeOfValues;
          }
          if (detail.data.value) {
            this.iFilter.value = detail.data.value;
          }
        }
      });
      await modal.present();
    }

  }

  getDepData() {

    let itemfilterData = JSON.parse(JSON.stringify(this.itemData))
    let mainData = [];
    for (let x of itemfilterData) {
      for (let y of x) {
        if (y.Level5[0].item_name == this.iFilter.item_name && y.Level5[0].value) {
          let dataObj = {
            key: y.Level5[0].item_name,
            value: y.Level5[0].value
          }

          if (!mainData.find(f => dataObj.value == f.value)) {
            mainData.push(dataObj);
          }
        }
      }
    }

    this.itemDataArr = mainData;

    let globArr = this.iFilter.value ? this.iFilter.value.split(",") : [];

    for (let g of globArr) {
      let globKey = this.itemDataArr.find(c => g == c.value);
      if (globKey) {
        globKey.isChecked = true;
        this.ValuesSelect.push(globKey);
      }
    }

    this.Vlength = this.itemDataArr.length;
    this.increaseRange();
  }

  onSelect(event, val, i) {
    let valSelect = this.ValuesSelect.find(x => x.value == val.value);
    if (!valSelect) {
      val.isChecked = !val.isChecked
      val.index = i;
      this.ValuesSelect.push(val);
    } else {
      valSelect.isChecked = !valSelect.isChecked;
    }

    let datakey = [];
    let datavalue = [];
    for (let x of this.ValuesSelect) {
      if (x.isChecked) {
        datakey.push(x.value);
        datavalue.push(x.value);
      }
    }

    this.iFilter.value = datakey.toString();
    this.iFilter.codeOfValues = datavalue.toString();

  }
}
