import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { CalendarModule, DayConfig, Colors } from 'ion2-calendar';
import { CalendarComponentOptions } from 'ion2-calendar';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { FrameCardComponent } from '../frame-card/frame-card.component';
import { ItemsComponent } from '../../items/items.component';


@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,FrameCardComponent,ItemsComponent],
  selector: 'app-frame-newcalender',
  templateUrl: './frame-newcalender.component.html',
  styleUrls: ['./frame-newcalender.component.scss'],
})
export class FrameNewcalenderComponent implements OnInit {

  multibutton: boolean = false;
  cardAdd: any = [];
  EnableButtons: boolean = true;
  calenderData: any = [];
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  eventflag: boolean = false;
  @Input() wscp: any = {};
  thead: any = [];
  thead2: any = [];
  current_page_parameter: any = {};
  dispalyss: any = { "color": "red", "text-yellow": "pink" };
  userDetails: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_where_str: any;
  filterFormData: any = [];
  l_card_title: any;
  tablerowsfilter: any;
  currentEvents: any;
  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  test: DayConfig[] = [];
  cardFlag: boolean = false;
  dateMulti: any;
  collapseCard: boolean = true;
  datePipe: DatePipe;
  planDateid: any;
  //  Colors = 'dark';
  footerItem = [];
  addEventBT: boolean = false;

  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };

  cardAddframe: any = [];
  dateRange: { from: '2018-JAN-01'; to: string; };
  addEventArray: any = [];
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions;
  optionsMulti: CalendarComponentOptions = {

    daysConfig: this.test,
    pickMode: 'single',
    from: new Date(2018, 1, 1),
    monthPickerFormat: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    weekdays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    color: 'dark',


  };
  colSize = [];
  flag: boolean = true;
  loadCal: boolean;
  constructor(public modalCtrl: ModalController, public globalObjects: GlobalObjectsService, private dataService: DataService, private toastCtrl: ToastController,
    public events: Events,private lhs_lib : LhsLibService,private processData: ProcessDataService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-newcalender")
    }
  }

  ngOnInit() {
    this.frame.calenderflag = true;

    this.getData();
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    let frameFilterFlag = this.frame.frame_filter_flag;

    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;

      if (itemGroup.design_control_type) {
        itemGroup.groupCol = [];
        itemGroup.groupCol = itemGroup.design_control_type.split('-');
        this.colSize = itemGroup.groupCol;
      }

      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }

        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {
          theaddata.push(itemMast.prompt_name);
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }

    }

    let farmelevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
    for (let itemGroup of farmelevel4) {
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.position == 'FOOTER') {
          itemMast.item_visible_flag = 'T';
          this.footerItem.push(itemGroup);
        }
      }
    }
    if (!this.EnableButtons) {
      document.getElementById('enab').setAttribute('style', 'padding-top: 10px;padding-bottom :10px');
    }
  }

  currentdateCard() {
    let date = new Date();
    let dt = new DatePipe("en-US").transform(date, "dd-MMM-yyyy");
    this.onDaySelect(dt);
  }

  onDaySelect(event) {
    var cards: any = [];
    let dt = new DatePipe("en-US").transform(event, "dd-MMM-yyyy");
    let footerRow = [];
    let headerRow = [];
    var imageOfCalender: any = [];
    imageOfCalender = JSON.parse(JSON.stringify(this.calenderData));
    for (let obj of imageOfCalender) {
      let planDate = obj.find(x => {
        if (x.Level5[0].item_name.toUpperCase() == "VRDATE") {
          let d1 = Date.parse(x.Level5[0].value ? x.Level5[0].value : null);
          if (d1 == Date.parse(dt)) {
            return x;
          }
        }
      });
      if (planDate) {
        planDate.Level5[0].value = new DatePipe("en-US").transform(planDate.Level5[0].value, "dd-MMM-yyyy").toUpperCase();

        let status_value = obj.find(x => x.Level5[0].item_name.toUpperCase().indexOf('status'.toUpperCase()) > -1);
        this.flag = false;
        obj.status = '';
        if (status_value) {
          if (status_value.Level5[0].value) {
            obj.status = status_value.Level5[0].value;
           
          } else {
            obj.status = "";
          }

          let position = obj.find(x => {
            if (x.Level5[0].position == 'CARD_FOOTER') {
              obj.footer = true;
              footerRow.push(x);
            }
            else if (x.Level5[0].position == 'CARD_HEADER') {
              obj.header = true;
              headerRow.push(x);
            } else if (x.Level5[0].position == 'CARD_TITLE') {
              obj.cardtitleFlag = true;
              headerRow.push(x);
            }

          });
          cards.push(obj);
        } else {
          cards.push(obj);
        }
      }

    }
    this.frame.tableRows = cards;
    this.frame.footerrows = footerRow;
    this.frame.headerrows = headerRow;
    this.frame.cardFlag = this.cardFlag;
    this.frame.colSize = this.colSize;

    this.processData.afterTableRows(this.frame);

    if (!this.cardFlag) {
      this.cardFlag = true;
    }

    this.events.publish("callcardforheaderarray", true);
  }

  async basic() {
    this.globalObjects.presentAlert('theme')
  }

  addEvent(event) {
    this.test.push({
      title: event.title,
      subTitle: event.subTitle,
      date: new Date(this.event.startTime),
      cssClass: 'unavailableDay',


    });
    this.emitPass.emit(this.test);
  }

  returntoShow() {
    //console.log(this.calenderData);
  }


  getData() {
    let wscp: any = {};
    wscp = this.wscp;
    wscp.service_type = this.frame.on_frame_load_str.replaceAll(";", "");
    wscp.object_code = this.frame.object_code;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      let data: any = res;
      if (data.responseStatus == "success") {
        let trows = [];
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = Object.keys(tableData[0])

        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                }
              }
            }
          }
          trows.push(frameLevel4);
        }
        this.calenderData = trows;
        this.frame.object_code = "";
        this.getCalenderData();
      }

    }).catch(err => {
      this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
    })

  }

  getCalenderData() {
    let splitarray: any = [];
    let dayscon = [];
    for (let obj of this.calenderData) {
      let planDate = obj.find(x => x.Level5[0].item_name.toUpperCase().indexOf('VRDATE'.toUpperCase()) > -1);
      let status = obj.find(x => x.Level5[0].item_name.toUpperCase().indexOf('status'.toUpperCase()) > -1);

      this.planDateid = planDate.Level5[0].value;
      if (status) {
        if (splitarray[this.planDateid]) {
          splitarray[this.planDateid].push(status.Level5[0].value);
        } else {
          splitarray[this.planDateid] = [];
          splitarray[this.planDateid].push(status.Level5[0].value);
        }
      }
      else {
        this.test.push({
          title: '',
          subTitle: '',
          date: new Date(planDate.Level5[0].value),
          cssClass: 'my-cal',
          marked: true
        })
      }


    }
    if (splitarray) {
      let stylesheet = document.styleSheets[0];
      let l = 0;
      for (let x in splitarray) {
        for (let y of splitarray[x]) {
          stylesheet.insertRule(`ion-calendar .my-col${l} {background-color: ${y} !important; color:#fff !important;}`, 0);
          stylesheet.insertRule(`ion-calendar .my-col${l} p {color:#fff !important;}`, 0);
          this.test.push({
            title: '',
            subTitle: '',
            date: new Date(x),
            cssClass: `my-col${l}`,
            marked: true
          })
        }
        l = l + 1;
      }
    }


    this.loadCal = true;
    this.optionsMulti.daysConfig = this.test;
    this.currentdateCard();
  }

  itemClickednew(event) {
    this.emitPass.emit(event);
  }


  changeEvent(event, dateevent) {
    if (event == 'viewEvent') {
      this.onDaySelect(dateevent);
    } else {
      if (this.optionsRange.pickMode == "single") {
        this.single(event);
      }
      //multi
      if (this.optionsRange.pickMode == "multi") {
        this.multi(event);
      }
      //range
      if (this.optionsRange.pickMode == "range") {
        this.range(event);
      }
    }
  }

  addEventCard(event) {
    this.cardAddframe.tableRows = [];
    this.frame.tableRows = [];
    this.frame.calenderflag = true
    this.cardFlag = false;

    this.cardAddframe = JSON.parse(JSON.stringify(this.frame));
    let tableRows = [];
    let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    for (let itemGrp of frameLevel4) {
      for (let item of itemGrp.Level5) {
        item.item_visible_flag = item.flag_auto_card;
        item.item_type = item.item_type_auto_card;
        item.item_sub_type = item.item_sub_type_auto_card;

      }
    }
    tableRows = frameLevel4;
    this.cardAdd = tableRows;
    this.cardAddframe.cardFlag = true;
    this.optionsRange = {
      pickMode: event,
      daysConfig: this.test,
      from: new Date(2018, 1, 1),
    };
    setTimeout(() => {
      document.getElementById(event).setAttribute('disabled', 'true');
    }, 50);
  }

  pickmodeCalender(event) {
    document.getElementById('range').setAttribute('disabled', 'false');
    document.getElementById('single').setAttribute('disabled', 'false');

    document.getElementById(event).setAttribute('disabled', 'true');
    if (event == 'multi') {
      this.multibutton = true;
    } else {
      this.multibutton = false;
    }
    this.optionsRange = {
      pickMode: event,
      daysConfig: this.test,
      from: new Date(2018, 1, 1),
    };
  }


  single(event) {
    let mom = new Date(event);
    let moment = this.globalObjects.formatDate(mom, 'dd-MMM-yyyy')

    this.displayCordovaToast('card addded');
    for (let items of this.cardAdd) {
      for (let x of items.Level5) {
        if (x.item_name == 'FROM_DATE' || x.item_name == 'TO_DATE') {
          x.value = moment;
        }
      }
    }

    this.cardAddframe.tableRows.unshift(JSON.parse(JSON.stringify(this.cardAdd)))
  }


  multi(event) {
    this.addEventArray = [];
    let obj = []
    for (let x of event) {
      obj.push(x)
      this.addEventArray = obj;
    }
  }

  addMultidateEvent() {
    this.cardAddframe.tableRows.unshift(JSON.parse(JSON.stringify(this.cardAdd)));
    this.addEventArray = [];
  }

  range(event) {
    let moment1 = new Date(event.from);
    let moment2 = new Date(event.to);
    let fromdate = this.globalObjects.formatDate(moment1, 'dd-MMM-yyyy')
    let todate = this.globalObjects.formatDate(moment2, 'dd-MMM-yyyy')
    if (event.from) {
      this.displayCordovaToast('choose last date range');
    }
    if (event.to) {
      this.displayCordovaToast('card addded');
    }
    let obj = {
      from: event.from.format('DD-MM-YYYY'),
      to: event.to.format('DD-MM-YYYY')
    }
    for (let items of this.cardAdd) {
      for (let x of items.Level5) {
        if (x.item_name == 'FROM_DATE') {
          x.value = fromdate;
        }
        if (x.item_name == 'TO_DATE') {
          x.value = todate;
        }
      }
    }
    this.cardAdd.obj = obj;
    this.cardAddframe.tableRows.unshift(JSON.parse(JSON.stringify(this.cardAdd)));
  }
  async displayCordovaToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'middle'
    });
    await toast.present();
  }
  onDidDismiss(event) {
  }

  viewChange(event) {
  }

  itemClicked(event) {
    delete this.frame['executing_index'];
    event.wsdp = [];
    this.frame.tableRows = this.cardAddframe.tableRows;
    this.emitPass.emit(event);
  }

  itemValueChange() {}
}