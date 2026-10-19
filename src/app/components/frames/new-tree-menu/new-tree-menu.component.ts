import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-new-tree-menu',
  templateUrl: './new-tree-menu.component.html',
  styleUrls: ['./new-tree-menu.component.scss'],
})
export class NewTreeMenuComponent implements OnInit {
  openMenuId: string | null = null;
  menuFrame: any;
  recentFrame: any;
    developerModeData: any;
  menuData = [];
  menuId: any;
  childId: any;
  recent: boolean = false;
  fav: boolean = false;
  filteredMenuData: any;
  filteredDataflag = false;
  @Input() frame: any = {};

  no_of_days = 1;
  @Output() emitPass = new EventEmitter
  @ViewChild('subMenuCon', { static: true }) template: TemplateRef<any>;
  constructor(public globalObjects: GlobalObjectsService, private canvasServ: CanvasModalService, private lhs_lib: LhsLibService,private modalController : ModalController) {
    if (this.globalObjects.layoutFlag) {
      return applyLoggingDecorator(this, "modulelink")
    }
  }
  color = {
    color: "var(--blue-new)",
    fontWeight: "600",
  };
  color2 = {
    color: "var(--blue-new)",
    background: "var(--sidebar-primary-icon-hover-bg)",
    transform: "rotate(90deg)"
  };
  color3 = {
    color: "var(--blue-new)",
    background: "var(--sidebar-primary-icon-hover-bg)",
    transform: "rotate(0deg)"
  };

  ngOnInit() {


  }



  menuClicked(menu, frame) {

    console.log(frame.tableRows[menu.LROWINDEX]);

    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = menu.LROWINDEX;
    let item;

    for (let itmGrp of frame.tableRows[menu.LROWINDEX]) {
      for (let itm of itmGrp.Level5) {
        if (itm.item_name.toLowerCase() == 'menu_option_name') {
          item = itm;
        }
      }
    }

    // if (item.calling_object_code) {
    // item.object_code = item.calling_object_code;
    // item.click_events_str = "get_object_config_new;";
    // }

    if (item) {
      item.menuClick = true;
      this.emitPass.emit(item);
    }

  }

  cbCheck(menu){

    // console.log(frame.tableRows[menu.LROWINDEX]);

    if(menu.initialChange){
      delete menu['initialChange'];
      return;
    }

    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = menu.LROWINDEX;
    let item;

    menu.cb_select = menu.cb_select == 'Y' ? 'N' : 'Y'

    for (let itmGrp of this.frame.tableRows[menu.LROWINDEX]) {
      for (let itm of itmGrp.Level5) {
        if (itm.item_name.toLowerCase() == 'cb_select') {
          itm.value=menu.cb_select
          item = itm;
        }
      }
    }

    const checkChild = (menu,val)=>{
      if(menu.childData?.child?.length > 0){
        for(let m of menu.childData.child){
          let id=item.frame_alias? item.frame_alias : item.apps_page_frame_seqid
          this.lhs_lib.set_item_value(item,`${id}.cb_select`,m.LROWINDEX,val)
          m.cb_select = val;
          m.initialChange = true;
          checkChild(m,val);
        }
      } else {
        return;
      }
    }

    checkChild(menu,menu.cb_select)

    // if (item.calling_object_code) {
    // item.object_code = item.calling_object_code;
    // item.click_events_str = "get_object_config_new;";
    // }

    if (item) {
      item.menuClick = true;
      this.emitPass.emit(item);
    }

  }

  showTemplate(menu: any) {

    this.recent = false;
    this.fav = true;
    for (let m of this.frame.grpData) {
      if (m.isClick) {
        delete m['isClick'];
      }
      for (let submenu of m.childData.child) {
        if (submenu.isClick) {
          delete submenu['isClick'];
        }
      }
    }

    if (menu.childData) {
      if (this.menuId == menu.childData.id) {
        this.menuId = null;
        return;
      }
      this.menuId = menu.childData.id;
      menu.isClick = true;
    }
  }

  childClicked(menu, flag?, level?) {
    for (let m of this.frame.filteredData) {
      for (let submenu of m.childData.child) {
        if (submenu.isClick) {
          delete submenu['isClick'];
        }
        // if (submenu.childData.child) {
        //   for (let sub of submenu.childData.child) {
        //     delete sub['isClick'];
        //   }
        // }

      }
    }

    if (menu.childData) {
      if ((this.childId?.id == menu.childData.id || this.childId?.parentId == menu.childData.id) && !flag) {
        if (level == 3) {
          // this.childId.id = menu.childData.parentId;
          if(this.childId.flag){
            this.childId.flag = false;
          } else {
            this.childId.flag = true;
          }
          return;
        }
        this.childId = null;
        return;
      }
      this.childId = menu.childData;
      this.childId.flag = true;
      menu.isClick = true;
    }
  }

  ngOnDestroy() {
    console.clear();
  }

  filterDataSubMenuFlag = false;

  searchVal(event: any) {
    this.filteredDataflag = true;
    for (let m of this.frame.grpData) {
      for (let submenu of m.childData.child) {
        if (submenu.isClick) {
          delete submenu['isClick'];
        }
      }
    }
    const val = event.target.value.toLowerCase();

    if (val && val.trim() !== '') {
      let menuData = this.filterMenu(this.frame.grpData, val);
      this.frame.filteredData = menuData;
      this.childClicked(menuData[0].childData.child[0], true);
    } else {
      this.filteredDataflag = false;
      this.childId = null;
      this.frame.filteredData = [...this.frame.grpData];
    }

  }

  filterMenu(menuArray: any[], searchTerm: string): any[] {
    return menuArray.reduce((acc, menu) => {

      if ((menu.childData.name.toLowerCase().includes(searchTerm)) && (menu.step == "1" || menu.step == "2" || menu.step == "3")) {
        acc.push(menu);
      } else if (menu.childData.child && menu.childData.child.length > 0) {
        const filteredChild = this.filterMenu(menu.childData.child, searchTerm);
        if (filteredChild.length > 0) {
          acc.push({
            ...menu,
            childData: {
              ...menu.childData,
              child: filteredChild,

            },

          });
        }
      }
      return acc;
    }, []);
  }



  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.frame
      }
    });
    return await modal.present();
  }
}
