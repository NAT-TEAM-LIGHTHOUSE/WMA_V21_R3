import { Component, OnInit ,Input, Output,EventEmitter} from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items.component';

@Component({
standalone : true,
imports:[STANDALONE_IMPORTS,ItemsComponent],
  selector: 'app-rep-card',
  templateUrl: './rep-card.component.html',
  styleUrls: ['./rep-card.component.scss'],
})
export class RepCardComponent implements OnInit {

  @Input() rep_card: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  wsdp: any = [{}];
  frame: any = {};
  public show: boolean = false;
  public buttonName: any = 'md-add';
  userDetails: any;
  l_created_date: any;
  l_message: any;
  wscp: any = {};
  l_where_str: any[];


  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService,
    public loadingController: LoadingController) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"rep-card")
    }
  }

  ngOnInit() {
    this.getCreatedDate();
  }

  toggle() {
    this.show = !this.show;
    if (this.show) {
      this.buttonName = "md-remove";
    }
    else { this.buttonName = "md-add" }
  }
  showLoader() {
    this.loadingController.create({
      message: 'Please wait..'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
      });
    });
    this.hideLoader();
  }

  hideLoader() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 1000);
  }
  getCreatedDate() {
    let wscp: any = {};
    wscp.service_type = 'getCreatedDate';
    wscp.apps_page_frame_seqid = this.rep_card.apps_page_frame_seqid;
    wscp.object_code = this.rep_card.calling_object_code;

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {

      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        
        if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
          alert(objData.Level1[0].message);
        }
        else{
        if (objData.Level1[0]) {
          if (objData.Level1[0].CREATED) {
            this.l_created_date = objData.Level1[0].CREATED;
            this.l_message = '(Last Updated: ' + this.l_created_date + ')';
          }
          else {
            this.l_message = '';
          }
        }
      }}
      

    }).catch(err => {
    })
  }

  getData() {
    this.globalObjects.showLoading();
    this.show = !this.show;
    if (this.show) {
      this.buttonName = "md-remove";
      let wscp: any = {};
        wscp.object_code = this.frame.object_code;
      wscp.service_type = this.rep_card.click_events_str;
      wscp.click_events_str = this.rep_card.click_events_str;
      wscp.apps_page_frame_seqid = this.rep_card.apps_page_frame_seqid;
      wscp.apps_item_seqid = this.rep_card.apps_item_seqid;
      wscp.object_code = this.rep_card.calling_object_code;
      this.wscp = wscp;

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": this.wsdp
      }

      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {

        let data: any = res;
        
        if (data.responseStatus == "success") {
          let objData = this.globalObjects.setPageInfo(data.responseData);
          this.frame.Level3 = objData.Level1[0].Level2[0].Level3;
          for(let x of this.frame.Level3){
            for(let y of x.Level4){
              if(y.Level5[0].item_filter_flag){
                x.hideextraframes=true;
              }
            }
          }
        }
      }).catch(err => {
        this.globalObjects.presentToast("1.13 Something went wrong please try again later!");
      })
    }
    else {
      this.buttonName = "md-add";
    }
  }

  buttonClick(event) {
    this.emitPass.emit(this.rep_card);
  }

  filerData(i) {
    let wsdp = [];
    let key = {};
    let query;
   
    let setdateplsql;
    let setbetweennumber;
    let setbetweennumberarray=[];
    let multilevelitemarray = [];
    for (let itemGroup of this.frame.Level3[i].Level4) {

      for (let item of itemGroup.Level5) {
        query = null;      
        setbetweennumber=null;
        let value;
        if (item.codeOfValues) {
          key[item.apps_item_seqid] = item.codeOfValues;
          value = item.codeOfValues
        } else if (item.value) {
          key[item.apps_item_seqid] = item.value;
          value = item.value
        }

        let colName: any = "";

        if (item.item_db_name) {
          colName = item.item_db_name
        } else {
          colName = item.item_name
        }

        if (item.item_sub_type == 'BETWEEN_NUMBER' && (item.from_date != null) && (item.to_date != null)) {
           query = " and " + item.aliases + "." + colName + " between " + "to_date('" + item.from_date + "','dd-mon-rrrr') and to_date('" + item.to_date + "','dd-mon-rrrr')";
          setbetweennumber = " and " + item.aliases + "." + colName + " between " + "to_number('" + item.from_date + "') and to_number('" + item.to_date + "')"
        }
        //------------------------------------
        if (item.item_sub_type == 'ASON_DATE' && (value)) {
           query = " and " + item.aliases + "." + colName + item.dateType + " to_date('" + value + "','dd-mon-rrrr')";
          setdateplsql = " begin lhs_utility.set_to_Date(to_date('" + value + "','dd-mon-rrrr')); end;";
        } else if (item.item_sub_type == 'BETWEEN_DATE' && (item.from_date) && (item.to_date) && item.tool_tip == 'DT') {
           query = " and " + item.aliases + "." + colName + " between " + "to_date('" + item.from_date + "','dd-mon-rrrr') and to_date('" + item.to_date + "','dd-mon-rrrr')";
          setdateplsql = " begin lhs_utility.set_from_Date(to_date('" + item.from_date + "','dd-mon-rrrr hh24:mi:ss')); lhs_utility.set_to_Date(to_date('" + item.to_date + "','dd-mon-rrrr hh24:mi:ss')); end;";
        } else if (item.item_sub_type == 'BETWEEN_DATE' && (item.from_date) && (item.to_date)) {
           query = " and " + item.aliases + "." + colName + " between " + "to_date('" + item.from_date + "','dd-mon-rrrr') and to_date('" + item.to_date + "','dd-mon-rrrr')";
          setdateplsql = " begin lhs_utility.set_from_Date(to_date('" + item.from_date + "','dd-mon-rrrr')); lhs_utility.set_to_Date(to_date('" + item.to_date + "','dd-mon-rrrr')); end;";
       
        } 
       else if (item.item_sub_type == 'M' && (value)) {
        let valuearr = value.split(",");
          query = " and " + item.aliases + "." + colName + " in (";
          for (let val of valuearr) {
            query = query + "'" + val + "',";
          }
          query = query.substring(0, query.length - 1);
          query = query + ")";
        } else {
          if (value) {
            query = " and " + item.aliases + "." + colName + "=" + "'" + value + "'";
          }
        }
        if (query) {
          multilevelitemarray.push(query);
        }
        
        if(setbetweennumber){
          setbetweennumberarray += setbetweennumber ;
        }       
      }
    }
  
    wsdp.push(key);
    this.frame.where_str = "";
    if(multilevelitemarray.length > 0){
    this.frame.where_str = multilevelitemarray;
    }
    this.frame.other_set_filters = "select 1 from dual";
        
     this.frame.setdateplsql = setdateplsql;
    if(setbetweennumberarray.length >0){
      this.frame.setbetweennumber = setbetweennumberarray;
    }

    this.frame.wsdp = multilevelitemarray;

     this.emitPass.emit(this.frame);
  }


  itemClicked(event, i) {
    if (event.click_events_str == 'process_report_data') {
      event.item_enable_flag = 'F';
      let wscp: any = {};
      let isValid = true;
      wscp.service_type = event.click_events_str;
      wscp.click_events_str = event.click_events_str;
      wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      wscp.apps_item_seqid = event.apps_item_seqid;
      wscp.object_code = event.calling_object_code;
      this.filerData(i);
      if(this.frame.where_str.length > 0){
        wscp.where_str = this.frame.where_str.join(" ");
      }else{
        wscp.where_str = this.frame.where_str;
      }
      wscp.setdateplsql = this.frame.setdateplsql;
      wscp.setbetweennumber = this.frame.setbetweennumber;
      wscp.other_set_filters = this.frame.other_set_filters;

      let col = {};
      for (let itemGroup of this.frame.Level3[i].Level4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues;
            }
            else if (item.item_sub_type == 'BETWEEN_DATE') {
              col[item.apps_item_seqid] = item.from_date + ' to ' + item.to_date;
              col["date_filter_type"] = item.filter_type;
            } else {
              col[item.apps_item_seqid] = item.value;
            }
            if (item.isValid !== undefined && !item.isValid) {
              isValid = item.isValid
            }
          }
        }
      }
      event.wsdp = [];
      event.wsdp.push(col);

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": event.wsdp
      }

      this.globalObjects.showLoading();

      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {
        
        let data: any = res;
        if (data.responseStatus == "success") {
          let objData = this.globalObjects.setPageInfo(data.responseData);
          if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
            alert(objData.Level1[0].message);
          }
        }
        this.buttonName = "md-add";
        this.show = !this.show;
        
        this.getCreatedDate();

      }).catch(err => {
        this.globalObjects.presentToast("1.14 Something went wrong please try again later!");
        alert(err);
      })
    }
  }
}
