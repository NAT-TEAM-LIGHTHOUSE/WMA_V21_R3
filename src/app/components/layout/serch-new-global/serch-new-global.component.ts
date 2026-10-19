import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonInput, ModalController, Platform } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { GlobalSearchPipe } from 'src/app/pipes/global-search.pipe';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MergeLevel5Pipe } from 'src/app/pipes/merge-level5-pipe';


@Component({
standalone : true,
// imports:[...STANDALONE_IMPORTS],
imports: [GlobalSearchPipe,STANDALONE_IMPORTS,ScrollingModule,MergeLevel5Pipe],
  selector: 'app-serch-new-global',
  templateUrl: './serch-new-global.component.html',
  styleUrls: ['./serch-new-global.component.scss'],
})
export class SerchNewGlobalComponent implements OnInit {

  @Input() frameArr: any;
  @Input() object_mast: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('myInput', { static: false }) inputElement!: IonInput;
  constructor(private canvasModal: CanvasModalService,
    private cdr: ChangeDetectorRef, public modalController: ModalController,
    private lhs_lib: LhsLibService, public globalObjects: GlobalObjectsService, private processData: ProcessDataService,public platform: Platform) {
    if (this.globalObjects.layoutFlag) {
      return applyLoggingDecorator(this, "serch-new-global")
    }
  }
  // searchTerm: string = '';
  // suggestions: string[] = [];
  developerModeData: any;
  whereData = [];
  SelAll: boolean = false;
  // data: any[] = [];
  objectList: any[];
  filteredData = [];
  selectedItems = [];
  isDropdownOpen = false;
  filterableData
  searchText: any;
  searchText1: any;
  search = " ";
  items = [];
  filteredWhereData: any[] = [];
  frameData: any;



  selectAll: boolean = false;
  showMaster: boolean = false;
  showTransaction: boolean = false;
  showMenu: boolean = false;




  //////////////////////////////
  columns = Array.from({ length: 20 }, (_, i) => ({
    key: `col${i + 1}`,
    label: `Column ${i + 1}`
  }));


  data1: any[] = [];
  PB_SYS_MENU:any=""
  // @HostListener('window:keydown.alt.m')
  searchMenuShortCut(){
    if(this.PB_SYS_MENU.item_enable_flag == 'T'){
      this.itemClicked(this.PB_SYS_MENU)
    }
  }

  PB_SYS_SEARCH:any=""
  // @HostListener('window:keydown.alt.a')
  searchMenuShortCutAll(){
    if(this.PB_SYS_SEARCH.item_enable_flag == 'T'){
      this.itemClicked(this.PB_SYS_SEARCH)
    }
  }

  ngOnInit() {


    // this.data = Array.from({ length: 1000 }, (_, i) => {
    //   const row: { [key: string]: string } = {};
    //   this.columns.forEach(col => {
    //     row[col.key] = `${col.label} - Row ${i + 1}`;
    //   });
    //   return row;
    // });


    console.log(this.frameArr);

    for (let frame of this.frameArr) {
      if (frame.apps_frame_sub_type == 'GLOBAL_SEARCH_HEAD' && frame.canvasRows && frame.canvasRows.length > 0) {
        for (let data of frame.canvasRows) {
          for (let items of data) {
            for (let item of items.Level5) {
              if (item.item_visible_flag == 'T' && item.item_name == 'SYS_WHERE_TO_SEARCH') {
                if (item.input_pattern) {
                  let data = item.input_pattern.split(",")
                  for (let d of data) {
                    let itemdata = d.split("#")
                    let obj = {
                      displayName: itemdata[1],
                      value: itemdata[0]
                    }
                    this.whereData.push(obj)
                  }
                }
              }
              if(item.item_name=='PB_SYS_MENU'){
                this.PB_SYS_MENU=item
              }
                if(item.item_name=='PB_SYS_SEARCH'){
                this.PB_SYS_SEARCH=item
              }
            }
          }
        }
      }
      frame.headers = JSON.parse(JSON.stringify(frame.Level4));

      for (let header of frame.headers) {
        if (header.Level5) {
          for (let item of header.Level5) {

            if (item.item_visible_flag == 'T') {
              item.search = "%%";
            }
          }
        }
      }
      console.log("Where data", frame.headers);
    }

    console.log("Where data", this.whereData)

    for (let frameGrp of this.object_mast.Level2) {
      for (let frme of frameGrp.Level3) {

        if (frme.apps_frame_type == 'QUICKLINKS') {
          console.log("Footer frame data" + frme.apps_frame_type)
          this.frameData = frme;
          console.log("Footer frame data" + this.frameData)
        }
      }
    }



    // this.whereData.forEach(item => {
    //   item.isChecked = true; 
    //   this.selectedItems.push(item); 
    // });
  }



  ngAfterViewInit() {
    setTimeout(() => {
      this.inputElement.setFocus(); // Autofocus the input field
    }, 300); // Small delay to ensure the view is fully loaded
  }

  removeAll() {
    for (let frame of this.frameArr) {
      if (frame.apps_frame_sub_type === 'GLOBAL_SEARCH_HEAD') {
        for (let data of frame.canvasRows) {
          for (let items of data) {
            for (let item of items.Level5) {
              if (item.item_name == 'SYS_WHERE_TO_SEARCH' && item.item_visible_flag == 'T') {
                if (item.displayChips) {
                  item.displayChips = [];
                }
                item.value = '';
              }

              if (['SYS_ALL', 'SYS_MASTER', 'SYS_TRANSACTION', 'SYS_MENU'].includes(item.item_name)) {
                item.isChecked = false;
                item.value = 'N';
              }
            }
          }
        }
      }
    }
    this.selectedItems = [];
    this.whereData.forEach(itm => {
      itm.isChecked = false;
      itm.selected = false;
    });


    this.selectedItems = [];
    this.searchText1 = '';

    // this.changeDetectorRef.detectChanges();
  }




  itemClicked(item) {
    console.log(this.frameArr);
    this.emitPass.emit(item)
  }


  btnClick(item, i, frame) {

    frame.active_row = i;
    if((this.platform.is('ios') || this.platform.is('android'))) {
      item.isQuickSearch=true;
    }
    this.itemClicked(item)
  }



  itemClicked1(item, frame) {
    this.lhs_lib.make_row_dirty(item, frame.tableRows[0]);
  }

  itemClicked2(item, frame) {
    this.lhs_lib.make_row_dirty(item, frame.tableRows[0]);
  }
  toggleCheck(item) {
    if (item.isChecked) {
      item.value = 'Y'
    } else {
      item.value = 'N'
    }
    this.itemClicked(item);
  }


  checkValid(item) {
    if ((item.data_required_flag && item.data_required_flag == 'T') || ((item.prompt_name && item.prompt_name[item.prompt_name.length - 1]) == '*')) {
      if (item.value) {
        item.isValid = true;
      } else {
        item.isValid = false;
      }
    } else {
      item.isValid = true;
    }
  }


  async showDeveloperData(item) {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: item.apps_page_frame_seqid,
      item_seq_id: item.apps_item_seqid
    }
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: item,
        runEvents: item.runEventsa
      }
    });
    return await modal.present();
  }







  toggleItem(selectedItem: any, item: any) {
    const index = this.selectedItems.findIndex(i => i.value === selectedItem.value);

    if (index > -1) {
      this.selectedItems.splice(index, 1);
      selectedItem.selected = false;
    } else {
      this.selectedItems.push(selectedItem);
      selectedItem.selected = true;
    }


    item.value = this.selectedItems.map(i => i.value).join(',');

    item.displayChips = [...this.selectedItems];
  }

  // toggleItem(selectedItem: any, item: any) {
  //   const index = this.selectedItems.findIndex(i => i.value === selectedItem.value);

  //   if (index > -1) {
  //     this.selectedItems.splice(index, 1);
  //     selectedItem.isChecked = false; 
  //   } else {
  //     this.selectedItems.push(selectedItem);
  //     selectedItem.isChecked = true;
  //   }


  //   item.value = this.selectedItems.map(i => i.value).join(',');
  //   item.displayChips = [...this.selectedItems];
  // }


  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.search-container')) {
      this.isDropdownOpen = false;
    }
  }



  stop(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  debounce(callback, delay = 1000, event?) {
    var time;

    return (...args) => {
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  getSearchResult = this.debounce((value, delay, item?, frame?) => {

    this.filterColumn(item, frame);
  }, 1000);
  filterColumn(item?, frame?) {


    if (item && item.initialChange) {
      delete item['initialChange'];
      return;
    }
    if (((frame.tableData && frame.tableData.length > 0) || (frame.searchableData && frame.searchableData.length > 0))) {
      let data = this.processData.filterColumn(frame);
      frame.page_no = 1;
      frame.from_record = 0;
      frame.to_record = 100;
      this.processData.afterTableRows(frame);

      if (frame.searchableData) {
        delete this.frameArr['active_row'];
        if (frame.searchableData && frame.searchableData.length > 0) {
          for (let itemGrp of this.frameArr.searchableData[0]) {
            if (itemGrp.Level5.length > 0) {
              frame.active_row = itemGrp.Level5[0].indexcount;
              break;
            }
          }
        }
      } else {
        if (frame.tableRows && frame.tableRows.length > 0) {
          for (let itemGrp of frame.tableRows[0]) {
            if (itemGrp.Level5.length > 0) {
              frame.active_row = itemGrp.Level5[0].indexcount;
              break;
            }
          }
        }
      }

      // this.cdr.detectChanges();
    }
    return;
  }


  modalDismiss() {
    this.canvasModal.popDismiss();
  }

  trackByRow(index: number, row: any) {
  return row?.id ?? index;
}

trackByItems(index: number, item: any) {
  return item?.id ?? index;
}

trackByItem(index: number, item: any) {
  return item?.item_seqid ?? item?.id ?? index;
}


}
