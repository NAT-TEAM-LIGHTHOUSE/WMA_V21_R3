import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[...STANDALONE_IMPORTS],
  selector: 'app-modulelink',
  templateUrl: './modulelink.component.html',
  styleUrls: ['./modulelink.component.scss'],
})
export class ModulelinkComponent implements OnInit {
  openMenuId: string | null = null;
  menuFrame: any;
  recentFrame: any;
  menuData = [];
  menuId: any;
  childId: any;
  recent: boolean = false;
  fav: boolean = false;
  filteredMenuData: any;
  filteredDataflag = false;

  no_of_days = 1;

  @ViewChild('subMenuCon', { static: true }) template: TemplateRef<any>;
  constructor(private globalObjects: GlobalObjectsService, private canvasServ: CanvasModalService, private dataService: DataService) {
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

    console.log("layoutttttt", this.globalObjects.layoutObject);
    if (this.globalObjects.layoutObject) {
      for (let pageData of this.globalObjects.layoutObject) {
        for (let page of pageData.Level2) {
          for (let frame of page.Level3) {
            if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'MENU') {
              this.menuData = frame.tableData.child;
              this.menuFrame = frame;
              this.filteredMenuData = this.menuData;
            }

            if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'RECENT_MENU') {
              this.recentFrame = frame;
            }
          }
        }
      }
    }
  }



  menuClicked(menu, frame) {

    if (frame) {
      let item = frame.Level4[0].Level5[0];

      let keys = Object.keys(menu);

      for (let k of keys) {
        if (item.hasOwnProperty(k.toLowerCase())) {
          item[k.toLowerCase()] = menu[k];
        }
      }

      if (item.calling_object_code) {
        item.object_code = item.calling_object_code;
        item.click_events_str = "get_object_config_new;";
        item.menuClick = true

        this.canvasServ.dismiss(item);
      }

    }
  }

  showTemplate(menu: any) {

    this.recent = false;
    this.fav = true;
    for (let m of this.menuData) {
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

  childClicked(menu,flag?) {
    for (let m of this.filteredMenuData) {
      for (let submenu of m.childData.child) {
        if (submenu.isClick) {
          delete submenu['isClick'];
        }
      }
    }

    if (menu.childData) {
      if (this.childId == menu.childData.id && !flag) {
        this.childId = null;
        return;
      }
      this.childId = menu.childData.id;
      menu.isClick = true;
    }
  }

  ngOnDestroy() {
    console.clear();
  }

  filterDataSubMenuFlag = false;

  searchVal(event: any) {
    this.filteredDataflag = true;
    for (let m of this.menuData) {
      for (let submenu of m.childData.child) {
        if (submenu.isClick) {
          delete submenu['isClick'];
        }
      }
    }
    const val = event.target.value.toLowerCase();

    if (val && val.trim() !== '') {
      let menuData = this.filterMenu(this.menuData, val);
      this.filteredMenuData = menuData;
      this.childClicked(menuData[0].childData.child[0],true);
    } else {
      this.filteredDataflag = false;
      this.childId = null;
      this.filteredMenuData = [...this.menuData];
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

  getRecent() {
    this.getRefData(this.recentFrame);
  }

  getRefData(frame) {
    if (frame.on_frame_load_str) {

      let parseValue = this.getParse(frame.on_frame_load_str);

      let url = 'getRefCursor?Procname=' + encodeURIComponent(parseValue);
      this.dataService.getData(url).then((data: any) => {
        frame.loading = false;
        if (data.responseStatus && data.responseStatus.includes("success")) {
          frame.tableData = this.globalObjects.setPageInfoNoS2U(data.responseData);
          console.log(frame.tableData);
        }
      }).catch(error => {
        console.error(error);
        frame.loading = false;

      });
    }
  }

  getParse(proc) {
    var bindVarLogic = proc.match(/:(.*?)[=,*,>,<,+,/,%,-,(,;]/g);
    let userDetails = this.globalObjects.getLocallData('userDetails');
    let bindData = "";
    if (bindVarLogic && bindVarLogic.length > 0) {
      for (var b = 0; b < bindVarLogic.length; b++) {
        let d = bindVarLogic[b].replaceAll(":", "").trim();
        if (d && d !== "") {
          let v = d.match(/[a-z_.0-9]+/gi)[0];

          if (v) {
            for (let u in userDetails) {
              if (u.toLowerCase() == v.toLowerCase()) {
                let val = userDetails[u];
                bindData = d.replace(v, val);

                proc = proc.replaceAll(bindVarLogic[b], bindData);
                break;
              } else if (v.toLowerCase() == 'days') {
                let val = this.no_of_days;
                bindData = d.replace(v, val);

                proc = proc.replaceAll(bindVarLogic[b], bindData);
              }
            }
          }
        }
      }

    }
    return proc;
  }

} 
