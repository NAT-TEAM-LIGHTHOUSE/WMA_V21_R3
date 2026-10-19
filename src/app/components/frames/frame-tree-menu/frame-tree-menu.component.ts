import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, KeyValueDiffers, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { Events } from 'src/app/services/events';
import { Tree } from 'primeng/tree';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { TreeTableModule } from 'primeng/treetable';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,TreeTableModule],
  selector: 'app-frame-tree-menu',
  templateUrl: './frame-tree-menu.component.html',
  styleUrls: ['./frame-tree-menu.component.scss'],
})
export class FrameTreeMenuComponent implements OnInit {

  cols: any
  files!: TreeNode[];
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  developerModeData:any;
  wscp = {}
  userDetails: any;
  selectedColumns: any[];
  selectedFile: TreeNode[]
  selectedNode: TreeNode
  contextMenuItems: MenuItem[];
  treeData: TreeNode[]; // Ensure this is initialized with your actual tree data
  selectedDocumentFolder: TreeNode;
  items: MenuItem[];
  @ViewChild('treeComponent') treeComponent: Tree;

  constructor(public http: HttpClient, private dataService: DataService, private lhs_lib: LhsLibService, public globalObjects: GlobalObjectsService,
    private processData: ProcessDataService, private event: Events, private cdRef: ChangeDetectorRef) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-tree-menu")
    }
  }

  ngOnInit() {
    if (this.frame.apps_frame_sub_type && this.frame.apps_frame_sub_type.toLowerCase().indexOf('collapse') > -1) {
      this.frame.collapse = false;
      this.frame.showCollapse = true;
    } else {
      this.frame.collapse = true;
      this.frame.showCollapse = false;
    }

    let theaddata: any = [];

    if (this.frame.tableData) {
      let data = JSON.parse(JSON.stringify(this.frame.tableData));
      data = data.map((x, i) => {
        return { ...x, 'ROWNUMBER': i };
      });
      this.displayTreeTable(data);

    }
    this.event.unsubscribe(this.frame.apps_page_frame_seqid);
    this.event.subscribe(this.frame.apps_page_frame_seqid, () => {
      this.files = [];
      this.cols = [];
      this.ngOnInit();
    })

    for (let itemGroup of this.frame.Level4) {
      for (let item of itemGroup.Level5) {
        let obj = item;
        obj.search = '';
        obj.field = item.item_name;
        obj.header = item.prompt_name;
        obj.freezCol = {}
        if (obj.item_visible_flag == 'T') {
          this.cols.push(obj);
          theaddata.push(item.prompt_name);
        }
      }
    }
    this.selectedColumns = this.cols;
  }



  convertToHierarchy(arry: string | any[]) {
    var nodeObjects = this.createStructure(arry);
    for (var i = nodeObjects.length - 1; i >= 0; i--) {
      var currentNode = nodeObjects[i];
      if (currentNode.data.PARENT_CODE === "") {
        continue;
      }
      var PARENT_CODE = this.getParent(currentNode, nodeObjects);

      if (PARENT_CODE === null) {
        continue;
      }

      PARENT_CODE.children.push(currentNode);

      nodeObjects.splice(i, 1);
    }
    console.dir(nodeObjects);
    return nodeObjects;
  }
  createStructure(nodes: string | any[]) {
    var objects = [];
    for (var i = 0; i < nodes.length; i++) {
      objects.push({ data: nodes[i], children: [], label: nodes[i].LABEL });
    }
    return objects;
  }
  getParent(child: { data: any; children?: never[]; }, nodes: string | any[]) {
    var PARENT_CODE = null;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].data.CHILD_CODE === child.data.PARENT_CODE) {
        this.selectNodeByLabel(nodes[i].data.CHILD_CODE, child.data.PARENT_CODE);
        return nodes[i];
      }
    }
    return PARENT_CODE;
  }
  postOrder(root: any) {
    if (root.children) {
      root.children.forEach((child: any) => {
        root.DRAMT += this.postOrder(child);
      });
    }
    root.DRAMT = root.DRAMT + root.DRAMT;
    return root;
  }

  public expandAll(): void {
    const temp = cloneDeep(this.files);
    temp.forEach((node: TreeNode) => {
      this.expandCollapseRecursive(node, true);
    });
    this.files = temp;
  }

  public collapseAll(): void {
    const temp = cloneDeep(this.files);
    temp.forEach(node => {
      this.expandCollapseRecursive(node, false);
    });
    this.files = temp;
  }

  private expandCollapseRecursive(node: TreeNode, isExpand: boolean): void {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandCollapseRecursive(childNode, isExpand);
      });
    }
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/treeTable.json");
  }

  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.object_code = this.frame.object_code;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_working_mode = this.wscp_send_input.apps_working_mode;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.orignal_apps_item_seqid = this.wscp_send_input.orignal_apps_item_seqid;
    wscp.origin_apps_item_seqid = this.wscp_send_input.origin_apps_item_seqid;
    this.wscp = wscp;
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    let wsdp
    if (wscp.service_type == "execute_query") {

      wsdp = this.lhs_lib.getWsdp("").wsdp;
    } else {
      wsdp = this.wsdp;
    }

    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": this.wsdpcl
    }

    let l_url = "S2U";
    let tableData: any;

    this.dataService.postData(l_url, reqData).then(res => {
      let data: any = res;

      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        tableData = objData.Level1;
        this.frame.tableData = tableData;
        this.displayTreeTable(JSON.parse(JSON.stringify(this.frame.tableData)));
        console.log("Frame Tree Table Data", objData)
      }
    }).catch(err => {
      this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
    })
  }


  displayTreeTable(data) {
    if (data && data.length > 0) {
      console.log(data);

      let i = 0;
      let res = data.map((d: any) => {
        i++;

        const getSum = (obj: { [x: string]: any; CHILD_CODE: any; }, prop: string) => {
          const children = data.filter(({ PARENT_CODE }: any) => PARENT_CODE === obj.CHILD_CODE)

          if (children.length === 0) return (typeof (obj[prop]) == 'string' ? obj[prop] : (obj[prop]).toString());
          return children.reduce((acc: string, c: { [x: string]: any; CHILD_CODE: any; }) => parseFloat(acc) + parseFloat(getSum(c, prop))

            , 0) + "#" + children.length
        }

        if (this.cols && this.cols.length > 0) {
          for (let i = 0; i < this.cols.length; i++) {
            if (this.cols[i].field.startsWith("COL")) {
              let result;
              if (d[this.cols[i].field]) {
                if (this.cols[i].summary_flag && this.cols[i].summary_flag.includes('PS')) {
                  result = getSum(d, this.cols[i].field).split("#");
                  d[this.cols[i].field] = Math.round(parseFloat(result[0]));
                  d["COUNT1"] = parseFloat(result[1]);
                } else {
                  result = d[this.cols[i].field];
                  d[this.cols[i].field] = Math.round(parseFloat(result));
                  d["COUNT1"] = parseFloat(result);
                }

              }
            }
          }
        }
        return {
          ...d
        }
      })

      let filesArr = this.convertToHierarchy(res);
      this.files = this.removeChilds(filesArr);

      console.log(this.files);
      this.countChild(this.files);
    }
  }

  removeChilds(arr) {
    let oldArr = structuredClone(arr);
    let newArr = [];
    for (let a of oldArr) {
      if (!a.isChild) {
        newArr.push(a);
      }
    }
    return newArr;
  }

  countChild(arry) {
    let funArr = [];
    for (let item of this.cols) {
      if (item.summary_flag) {
        this.frame.summary_flag = true;
        let sumArr = [];
        if (item.summary_flag.includes(';')) {
          sumArr = item.summary_flag.split(';')
        } else {
          sumArr[0] = item.summary_flag;
        }
        for (let s of sumArr) {
          let summFlag = s.includes("#") ? s.split("#")[0] : s;
          let decimal = s.includes("#") ? s.split("#")[1] : 0;
          if (summFlag == 'S' || summFlag == 'A' || summFlag == 'C' || summFlag == 'M' || summFlag == 'X') {
            let obj = {
              fun: summFlag,
              decimal: decimal,
              dataType: item.datatype,
              item_name: item.item_name.toUpperCase()
            }
            funArr.push(obj);
          }
        }
      }
    }

    if (funArr.length > 0 && this.frame.tableData) {
      let data = this.processData.calculateData(JSON.parse(JSON.stringify(this.frame.tableData)), funArr);
      if (data) {
        let keys = Object.keys(data);
        for (let col of this.cols) {
          for (let key of keys) {
            if (col.item_name == key) {
              col.summaryValue = data[key];
            }
          }
        }
      }
    }
  }

  onNodeSelect(events: any) {
    const selectedLabel = events.node.label;
    console.log('Selected Label:', selectedLabel);
    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = events.node.data['ROWNUMBER'];
    let event: any = {};
    let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
    let matchedKey = null;
    for (let itemGroup of frameLevel4) {
      for (let item of itemGroup.Level5) {

        for (const key in events.node.data) {
          if (key === item.item_name) {
            matchedKey = key;
            event = item;
            console.log(event)
            break;
          }
          this.emitPass.emit(event);
        }
        if (events.node.data[item.item_name] != undefined) {
          item.value = events.node.data[item.item_name];
        }
      }
    }


    let col = {};
    if (frameLevel4 && frameLevel4.length > 0) {
      for (let itemGroup of frameLevel4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else if (item.value) {
              col[item.apps_item_seqid] = item.value
            } else {
              col[item.apps_item_seqid] = ""
            }
          }
        }
      }
    }
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    // this.cdRef.detectChanges();
    // Further processing based on the selected label
  }


  onNodeUnselect(event: any) {
    const unselectedLabel = event.node.label;
    console.log('Unselected Label:', unselectedLabel);
    // Further processing based on the unselected label
  }

  selectNodeByLabel(child, labelToFind: string) {
    const foundNode = this.findNodeByLabel(child, labelToFind);
    if (foundNode) {
      this.treeComponent.selection.set(foundNode);
    }
  }

  findNodeByLabel(nodes: TreeNode[], labelToFind: string): TreeNode {
    for (const node of nodes) {
      if (node === labelToFind) {
        return node; // Node found
      }

      if (node.children && node.children.length > 0) {
        const foundInChildren = this.findNodeByLabel(node.children as TreeNode[], labelToFind);
        if (foundInChildren) {
          return foundInChildren; // Node found in children
        }
      }
    }

    return null; // Node not found
  }
  onRightClick(event) {
    this.emitPass.emit(this.files);
  }
  showDeveloperData(){}
  nodeUnselect(ev){}
}


