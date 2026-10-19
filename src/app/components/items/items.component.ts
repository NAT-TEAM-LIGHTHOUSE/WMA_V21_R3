import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

import { BackgroundService } from 'src/app/services/background.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { Platform } from '@ionic/angular/standalone';
import { BatteryStatus } from '@awesome-cordova-plugins/battery-status/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { ItemComponentsModule } from 'src/app/shared_modules/item-components/item-components-module';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { TextBandComponent } from './item-display/text-band/text-band.component';
import { ItemsModule } from './items.module';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';

@Component({
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  imports: [STANDALONE_IMPORTS, ItemsModule]
})
export class ItemsComponent implements OnInit, OnDestroy {
  @Input() item: any;
  @Input() frame_type: any;
  @Input() frame: any;
  @Input() wscp: any;
  @Input() change_item_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() LHSOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnBlur: EventEmitter<any> = new EventEmitter<any>();

  @Input() itemData: any;
  @Output() emitfilterParam: EventEmitter<any> = new EventEmitter<any>();

  parentComponent: any = {};
  userDetails: any;
  location_name: any;

  constructor(public globalobject: GlobalObjectsService, public device: Device, public platform: Platform, private lhs_lib: LhsLibService,
    private batteryStatus: BatteryStatus, private backgroundservices: BackgroundService, private cdEngine: CdEngineService, private cdr: ChangeDetectorRef) {
    this.userDetails = this.globalobject.userDetails;
    if (this.globalobject.itemFlag) {
      return applyLoggingDecorator(this, "items")
    }
  }

  getParentComponent() {
    let frame = this.lhs_lib.get_frame_config(this.item.apps_page_frame_seqid);
    if (frame) {
      this.parentComponent.frame = frame;
    }
  }

  fiteredData(filterParam) {
    this.emitfilterParam.emit(filterParam);
  }

  cdEngineCall(isRegister: boolean) {
    let id = this.item.apps_item_seqid + '_' + this.item.indexcount + '#' + this.frame?.apps_page_frame_seqid;
    if (isRegister) {
      this.cdEngine.register(id, this.cdr);
    } else {
      this.cdEngine.unregister(id,this.cdr);
    }
  }
  ngOnDestroy(): void {
    this.cdEngineCall(false);
  }

  ngOnInit() {


    if (this.item) {


      if (this.item.item_type) {
        this.item.item_type = this.item.item_type.toUpperCase();
      }
      if (this.item.item_sub_type) {
        this.item.item_sub_type = this.item.item_sub_type.toUpperCase();
      }

      if (this.item.item_type == "BAND" && this.item.item_sub_type == "TAB_3D") {
        this.globalobject.colorcount = this.globalobject.colorcount + 1;
        if (this.globalobject.colorcount > 4) {
          this.globalobject.colorcount = 1;
        }
      }

      if ((this.item.item_type == "BAND" && this.item.item_sub_type == "KPI_LEFT") || this.item.item_type == "SUMMARY-CARD") {
        this.globalobject.countforsummarycard = this.globalobject.countforsummarycard + 1;
        if (this.globalobject.countforsummarycard > 4) {
          this.globalobject.countforsummarycard = 1;
        }
      }
      if (this.change_item_type) {
        if (this.change_item_type = 'item_filter_flag') {
          this.item.item_type = this.item.item_filter_flag;
        }
      }
      if (this.platform.is('android') || this.platform.is('android')) {

      } else {

      }

      this.parentComponent.frame = this.frame;
      // this.cdEngine.register(this.frame.apps_page_frame_seqid, this.cdr);
      this.cdEngineCall(true);
      if (this.item.display_setting_str) {
        if (typeof (this.item.display_setting_str) === 'string') {
          try {
            if (this.item.display_setting_str.toLowerCase().indexOf('lov') > -1) {

              this.item.lov_type = "LP";
              let lovStr = this.item.display_setting_str.toLowerCase().split('lov')[1];
              this.item.lov_size = JSON.parse(lovStr);
              this.item.display_setting_str = this.item.display_setting_str.toLowerCase().split('lov')[0];
            }
            if (this.item.display_setting_str) {
              this.item.display_setting_str = JSON.parse(this.item.display_setting_str);
            }
          } catch (e) {
            this.globalobject.presentAlert("Error in display_setting_str format...");
          }
        }

        if (typeof (this.item.display_setting_str) === 'string') {
          this.item.display_setting_str = JSON.parse(this.item.display_setting_str);
        }

        let obj = {};
        let itmObj = {};
        for (let d in this.item.display_setting_str) {
          if (d.includes("prompt_")) {
            obj[d.replace("prompt_", "")] = this.item.display_setting_str[d];
          } else {
            itmObj[d] = this.item.display_setting_str[d];
          }
        }
        this.item.prompt_diplay_setting_str = obj;
      }

      let name = this.item.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
      let recordStatus = this.lhs_lib.get_item_value(name, this.item.itemIndex);

      if (this.item.from_value) {
        for (let x in this.userDetails) {
          if (this.item.from_value.toUpperCase() == x.toUpperCase()) {
            this.item.from_value = this.userDetails[x];
          }
        }

        if ((this.item.from_value).toUpperCase().includes('SYSDATE')) {
          let sysDate = this.item.from_value.split('SYSDATE');
          console.log(sysDate);
          let tomDate = new Date(new Date(this.globalobject.sysdateTime).setHours(0, 0, 0, 0));
          if (sysDate[1]) {
            tomDate.setDate(eval("tomDate.getDate()" + sysDate[1]));
          }
          this.item.from_value = new Date(tomDate);
        }
      }

      if (this.item.to_value) {
        for (let x in this.userDetails) {
          if (this.item.to_value.toUpperCase() == x.toUpperCase()) {
            this.item.to_value = this.userDetails[x];
          }
        }

        if ((this.item.to_value).toUpperCase().includes('SYSDATE')) {
          let sysDate = this.item.to_value.split('SYSDATE');
          let tomDate = new Date(new Date(this.globalobject.sysdateTime).setHours(0, 0, 0, 0));
          if (sysDate[1]) {
            tomDate.setDate(eval("tomDate.getDate()" + sysDate[1]));
          }
          this.item.to_value = new Date(tomDate);
        }
      }

      if (this.item.item_default_value && recordStatus != 'U' && this.frame_type != 'TABLE' && this.item.item_type != 'BAND' && (this.item.value === undefined ||
        (this.item.item_default_value.toUpperCase() == "LATITUDE") || (this.item.item_default_value.toUpperCase() == "LONGITUDE") || (this.item.item_default_value.toUpperCase() == "LOCATION"))
        && (this.frame.apps_frame_sub_type != 'JSON')) {
        for (let x in this.userDetails) {
          if (this.item.item_default_value.toUpperCase() == x.toUpperCase()) {
            this.item.value = this.userDetails[x];
          }
        }

        var date = new Date(this.globalobject.sysdateTime);
        if (this.item.item_default_value.toUpperCase() == "USER_CODE") {
          this.item.value = this.userDetails.user_code;

        } else if (this.item.item_default_value.toUpperCase() == "LOGIN_ACC_CODE") {
          this.item.value = this.userDetails.login_acc_code;
        } else if (this.item.item_default_value.toUpperCase() == "LOGIN_ACC_NAME") {
          this.item.value = this.userDetails.login_acc_name;
        } else if (this.item.item_default_value.toUpperCase() == "DEVICE_ID") {
          if (this.device.uuid) {
            this.item.value = this.device.uuid;
          } else {
            this.item.value = "";
          }
        }
        else if (this.item.item_default_value.toUpperCase() == "ACC_YEAR") {
          this.item.value = this.userDetails.acc_year;
        } else if (this.item.item_default_value.toUpperCase() == "EMP_CODE") {
          this.item.value = this.userDetails.emp_code;
        } else if (this.item.item_default_value.toUpperCase() == "ENTITY_CODE") {
          this.item.value = this.userDetails.entity_code;
        } else if (this.item.item_default_value.toUpperCase() == "DIV_CODE") {
          this.item.value = this.userDetails.div_code;
        } else if (this.item.item_default_value.toUpperCase() == "PLSQL_L") {
          this.item.value = sessionStorage.getItem("PLSQL_L");
        } else if (this.item.item_default_value.toUpperCase() == "GEO_ORG_CODE") {
          this.item.value = this.userDetails.geo_org_code;
        } else if (this.item.item_default_value.toUpperCase() == "LATITUDE") {
          this.item.value = this.backgroundservices.latitude;
        } else if (this.item.item_default_value.toUpperCase() == "LONGITUDE") {
          this.item.value = this.backgroundservices.longitude;
        } else if (this.item.item_default_value.toUpperCase() == "LOCATION") {

          this.globalobject
            .geoCoderLocation(this.backgroundservices.latitude, this.backgroundservices.longitude)
            .then(res => {
              this.item.value = res;
            }, (error) => {
            });

        } else if (this.item.item_default_value.toUpperCase() == "SYSTIME") {
          this.item.value = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
        } else if (this.item.item_default_value == "INDEX") {

        } else if (this.item.item_default_value.toUpperCase() == "SYSDATETIME") {
          let valDT = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
          this.item.value = this.globalobject.formatDate(valDT, "dd-MMM-yyyy HH:mm:ss");
        } else if (this.item.item_default_value.toUpperCase().includes('SYSDATE')) {
          let val: any;
          let sysDate = this.item.item_default_value.split('SYSDATE');
          let tomDate = new Date(new Date(this.globalobject.sysdateTime).setHours(0, 0, 0, 0));
          if (sysDate[1]) {
            tomDate.setDate(eval("tomDate.getDate()" + sysDate[1]));
          }
          val = new Date(tomDate);

          let valD = val.getFullYear() + "-" + ("0" + (val.getMonth() + 1)).slice(-2) + "-" +
            ("0" + val.getDate()).slice(-2);
          this.item.value = this.globalobject.formatDate(valD, 'dd-MMM-yyyy');

        } else if (this.item.item_default_value == "BATTERY_STATUS") {
          const subscription = this.batteryStatus.onChange().subscribe(status => {
            this.item.value = status.level;
          });
          subscription.unsubscribe();
        }
        else {
          if (this.item.value) {
          } else {
            if (this.item.item_default_value.charAt(0) == 'G' && this.item.item_default_value.charAt(1) == '_') {
              this.item.value = '';
            } else if (this.item.datatype != 'BLOB' && this.item.datatype != 'LONG_RAW' && this.item.datatype != 'BLOB_JAVA' && this.item.datatype != 'LONG_RAW_JAVA') {
              this.item.value = this.item.item_default_value;
            }
          }
        }
      }
    }

    if (this.globalobject.callingPara.length > 0) {
      for (let glob of this.globalobject.callingPara) {
        if (this.parentComponent.wscp_send_input && this.parentComponent.wscp_send_input.apps_item_seqid && ((glob.objectCode == this.item.apps_page_frame_seqid.split("-")[0]) && (glob.itemCode == this.parentComponent.wscp_send_input.apps_item_seqid) && !glob.rowIndex)) {
          for (let c of glob.itmData) {
            if (c.indexOf(":=") > -1) {
              let itmName = c.split(':=');
              if (itmName[0].indexOf(".") > -1) {
                if (itmName[0].split(".")[1].toLowerCase() == this.item.item_name.toLowerCase()) {
                  this.item.value = itmName[1];
                }
              } else {
                if (itmName[0].toLowerCase() == this.item.item_name.toLowerCase()) {
                  this.item.value = itmName[1];
                }
              }
            }
          }
        }
      }
    }

    if (this.globalobject.newFormInstanceArr.length > 0) {
      let glob = this.globalobject.newFormInstanceArr.find(x => x.objCode == this.parentComponent.frame.object_code);

      if (glob && glob.newInst[this.item.item_name.toLowerCase()]) {
        this.item.value = glob.newInst[this.item.item_name.toLowerCase()];
      }
    }

    if (this.item.mirrored_items && this.parentComponent.frame.active_row == this.item.itemcount) {
      this.lhs_lib.set_mirror_values(this.item);
    }

    if (this.item.on_load_events_str && this.item.on_load_events_str.toLowerCase().indexOf('populate_list(') < 0) {
      this.item.itemClicked = 'load';
      this.itemValueChange(this.item);
    }
  }


  debounce(callback, delay = 500) {
    var time;

    return (...args) => {
      let type = args[0].itemClicked;
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args, type);
      }, delay);
    };
  }

  throttle(callback, delay = 500) {
    let timerFlag = null;
    let event = null;
    return (...args) => {
      if (timerFlag === null || (JSON.stringify(args[1] != event))) {
        event = JSON.stringify(args[1]);
        callback(...args);
        timerFlag = setTimeout(() => {
          timerFlag = null;
          event = null;
        }, delay);
      }
    };
  }

  itemClicked = this.throttle((event) => {
    // console.log(`comes in itemClicked of items component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,event.item_name);
    if (event.lovOpen) { return; }

    delete event['some_post_events_str'];
    delete event['returnId'];
    delete event['returnIndex'];



    if (event.item_type.toUpperCase() != 'TEXT_INPUT') {
      delete event['forcedInvalid'];
      delete event['rase'];

    }



    if (event.item_enable_flag != 'F') {
      if (event.item_type != 'BUTTON' && event.item_type != 'BT' && event.item_type != 'BUTTON_ICON' && !event.isAssociate) {
        let frame = this.frame
        if (frame && (frame.apps_frame_sub_type == 'SINGLE_ROW' || frame.apps_frame_sub_type == 'SINGLE_ROW_BLANK')) {
          // let name = event.apps_page_frame_seqid + '.WMA_RECORD_STATUS'
          // let itm = this.lhs_lib.get_item(name, event.indexcount, true);
          // if (itm) {
          //   itm.frame_status = 'dirty';
          // }
          let tableRows = this.lhs_lib.get_rows(frame, event.indexcount, true);
          if (tableRows) {
            this.lhs_lib.make_row_dirty(this.item, tableRows);
          }
        } else {
          // let name = event.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
          // let itm = this.lhs_lib.get_item(name, event.indexcount);
          // if (itm) {
          //   itm.frame_status = 'dirty';
          // }
          if (this.item.frame_status != 'dirty') {
            let tableRows = this.lhs_lib.get_rows(frame, event.indexcount);
            if (tableRows) {
              this.lhs_lib.make_row_dirty(this.item, tableRows);
            }
          }
        }

        if (frame) {
          if (frame.tableRows && frame.tableRows.length > 0 && frame.total_no_of_record == 0) {
            frame.total_no_of_record = frame.tableRows.length - (frame.extra_record_count ?? 0);
            this.lhs_lib.set_frame_indexes(frame);
          }
        }
      }
    }
    if (event.item_enable_flag != 'F' || this.frame_type == 'ENTRY_TABLE' || this.frame_type == 'TABLE') {

      this.emitPass.emit(event);
    }

  });

  itemValueChange(event) {

    console.log(event);
    if (event.lovOpen) { return; }
    if (event.codeOfValues) {
      event.codeOfValues = event.value;
    }

    delete event['some_post_events_str'];

    if (event.item_type.toUpperCase() != 'TEXT_INPUT') {
      delete event['forcedInvalid'];
      delete event['rase'];

    }

    event.msgError = "";
    delete event['returnId'];
    delete event['returnIndex'];
    if (event.item_enable_flag != 'F' || event.item_type == 'LIST_BOX') {
      if (event.itemClicked == 'post') {
        event.msgError = '';
        let olV = event.oldValue ? (typeof (event.oldValue) == 'number' ? event.oldValue : event.oldValue.toLowerCase()) : event.oldValue;
        let nlV = event.value ? (typeof (event.value) == 'number' ? event.value : event.value.toLowerCase()) : event.value;

        if (nlV != olV) {



          if (event.post_events_str && !event.value) {
            event.oldValue = event.value;
            let events = event.post_events_str.split(";");
            let str = "";
            for (let ev of events) {
              if (!ev || ev.toLowerCase().includes("validate_lov")) {

              } else {
                str = str + ev + ";";
              }
            }
            if (str) {
              event.some_post_events_str = str;
              this.LHSOnChange.emit(event);
            }
          } else {
            delete event['some_post_events_str'];
            event.oldValue = event.value;
            this.LHSOnChange.emit(event);
          }
        } else {
          if (event.post_events_str) {
            let events = event.post_events_str.split(";");
            let str = "";
            for (let evs of events) {
              if (evs.toLowerCase() == "app_plsql1_clob" || evs.toLowerCase() == "app_plsql2_clob" || evs.toLowerCase() == "app_plsql1_text" ||
                evs.toLowerCase() == "app_plsql2_text" || evs.toLowerCase() == "app_plsql1_text_force" ||
                evs.toLowerCase() == "app_plsql2_text_force" || evs.toLowerCase() == "app_js1_text" || evs.toLowerCase() == "app_js2_text"
                || evs.toLowerCase() == "app_js1_text_force" || evs.toLowerCase() == "app_js2_text_force" || (evs.toLowerCase().includes("validate_lov") && (event.validate_flag == 'T'))) {
                str = str + evs + ";";
              }
            }
            if (str) {
              event.some_post_events_str = str;
              this.LHSOnChange.emit(event);
            }
          }
        }
      } else {
        delete event['some_post_events_str'];
        this.LHSOnChange.emit(event);
      }
    }
  }

  openItemEditPage(itm) {
    let item = JSON.parse(JSON.stringify(itm));
    item.click_events_str = "devEditItem";
    this.globalobject.devItemIcon = item.apps_item_seqid + "#" + item.apps_icon_name;
    this.globalobject.devItemEditFlag = false;
    this.emitPass.emit(item);
  }

  itemOnBlur(item) {
    if (item.on_blur) {
      this.emitOnBlur.emit(item);
    }
  }

  getPosition(ev) {
    this.globalobject.mouseEvent = ev;
  }

  onRightClickgetPosition(ev) {
    this.globalobject.mouseEvent = ev;
    ev.preventDefault();
  }
}