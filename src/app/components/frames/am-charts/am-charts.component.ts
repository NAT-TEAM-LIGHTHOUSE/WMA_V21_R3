import { Component, OnInit, Input, Output, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { IonSelect, ModalController, PopoverController } from '@ionic/angular/standalone';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject, Subject } from 'rxjs';
import { FishboneTimelineComponent } from 'src/app/graph-components/amcharts4/fishbone-timeline/fishbone-timeline.component';
import { SerpentineTimelineComponent } from 'src/app/graph-components/amcharts4/serpentine-timeline/serpentine-timeline.component';
import { BarLineChartMixComponent } from 'src/app/graph-components/Column&Bar/bar-line-chart-mix/bar-line-chart-mix.component';
import { ClusteredBarChartComponent } from 'src/app/graph-components/Column&Bar/clustered-bar-chart/clustered-bar-chart.component';
import { ClusteredColumnChartComponent } from 'src/app/graph-components/Column&Bar/clustered-column-chart/clustered-column-chart.component';
import { ColumnLineMixComponent } from 'src/app/graph-components/Column&Bar/column-line-mix/column-line-mix.component';
import { ColumnRotatedLabelsComponent } from 'src/app/graph-components/Column&Bar/column-rotated-labels/column-rotated-labels.component';
import { ColumnsGrainyGradientsComponent } from 'src/app/graph-components/Column&Bar/columns-grainy-gradients/columns-grainy-gradients.component';
import { CurvedColumnsComponent } from 'src/app/graph-components/Column&Bar/curved-columns/curved-columns.component';
import { DragOrderingBarsComponent } from 'src/app/graph-components/Column&Bar/drag-ordering-bars/drag-ordering-bars.component';
import { GroupedSortedColumnsComponent } from 'src/app/graph-components/Column&Bar/grouped-sorted-columns/grouped-sorted-columns.component';
import { HundredStackedColumnChartComponent } from 'src/app/graph-components/Column&Bar/hundred-stacked-column-chart/hundred-stacked-column-chart.component';
import { LayeredColumnChartComponent } from 'src/app/graph-components/Column&Bar/layered-column-chart/layered-column-chart.component';
import { ParetoDiagramComponent } from 'src/app/graph-components/Column&Bar/pareto-diagram/pareto-diagram.component';
import { RealTimeDataSortingComponent } from 'src/app/graph-components/Column&Bar/real-time-data-sorting/real-time-data-sorting.component';
import { SimpleColumnChartComponent } from 'src/app/graph-components/Column&Bar/simple-column-chart/simple-column-chart.component';
import { StackedBarChartComponent } from 'src/app/graph-components/Column&Bar/stacked-bar-chart/stacked-bar-chart.component';
import { SortedBarChartComponent } from 'src/app/graph-components/Column&Bar/sorted-bar-chart/sorted-bar-chart.component';
import { StackedBarChartNegativeValuesComponent } from 'src/app/graph-components/Column&Bar/stacked-bar-chart-negative-values/stacked-bar-chart-negative-values.component';

import { StackedClusteredColumnChartComponent } from 'src/app/graph-components/Column&Bar/stacked-clustered-column-chart/stacked-clustered-column-chart.component';
import { StackedColumnChartComponent } from 'src/app/graph-components/Column&Bar/stacked-column-chart/stacked-column-chart.component';
import { StepCountChartComponent } from 'src/app/graph-components/Column&Bar/step-count-chart/step-count-chart.component';
import { VarianceIndicatorsComponent } from 'src/app/graph-components/Column&Bar/variance-indicators/variance-indicators.component';
import { FunnelChartComponent } from 'src/app/graph-components/Funnel & Pyramid/funnel-chart/funnel-chart.component';
import { PyramidComponent } from 'src/app/graph-components/Funnel & Pyramid/pyramid/pyramid.component';
import { AngularGaugetwoAxisComponent } from 'src/app/graph-components/gauges/angular-gaugetwo-axis/angular-gaugetwo-axis.component';
import { DataGroupingFiftyThousandPointsComponent } from 'src/app/graph-components/LineArea/data-grouping-fifty-thousand-points/data-grouping-fifty-thousand-points.component';
import { DateBasedDataComponent } from 'src/app/graph-components/LineArea/date-based-data/date-based-data.component';
import { HighlightingLineChartSeriesonLegendHoverComponent } from 'src/app/graph-components/LineArea/highlighting-line-chart-serieson-legend-hover/highlighting-line-chart-serieson-legend-hover.component';
import { LineChartRangeSliderComponent } from 'src/app/graph-components/LineArea/line-chart-range-slider/line-chart-range-slider.component';
import { LineChartScrollAndZoomComponent } from 'src/app/graph-components/LineArea/line-chart-scroll-and-zoom/line-chart-scroll-and-zoom.component';
import { LineGraphChartComponent } from 'src/app/graph-components/LineArea/line-graph-chart/line-graph-chart.component';
import { LineWithChangingColorsComponent } from 'src/app/graph-components/LineArea/line-with-changing-colors/line-with-changing-colors.component';
import { LineWithDifferentColorUpsDownsComponent } from 'src/app/graph-components/LineArea/line-with-different-color-ups-downs/line-with-different-color-ups-downs.component';
import { LineWithDifferentNegativeColorChrtComponent } from 'src/app/graph-components/LineArea/line-with-different-negative-color-chrt/line-with-different-negative-color-chrt.component';
import { ReversedValueAxisChrtComponent } from 'src/app/graph-components/LineArea/reversed-value-axis-chrt/reversed-value-axis-chrt.component';
import { StepLineWithoutRisersChartComponent } from 'src/app/graph-components/LineArea/step-line-without-risers-chart/step-line-without-risers-chart.component';
import { TrendLinesComponent } from 'src/app/graph-components/LineArea/trend-lines/trend-lines.component';
import { VerticleLinechrtComponent } from 'src/app/graph-components/LineArea/verticle-linechrt/verticle-linechrt.component';
import { ZoomableValueAxisComponent } from 'src/app/graph-components/LineArea/zoomable-value-axis/zoomable-value-axis.component';
import { ProgressChartComponent } from 'src/app/graph-components/Miscellaneous/progress-chart/progress-chart.component';
import { SpectrumChartComponent } from 'src/app/graph-components/Miscellaneous/spectrum-chart/spectrum-chart.component';
import { VennDiagramComponent } from 'src/app/graph-components/Miscellaneous/venn-diagram/venn-diagram.component';
import { DonutChartComponent } from 'src/app/graph-components/PieChart&Donut/donut-chart/donut-chart.component';
import { DonutWithRadialGradientComponent } from 'src/app/graph-components/PieChart&Donut/donut-with-radial-gradient/donut-with-radial-gradient.component';
import { DraggingPieSlicesComponent } from 'src/app/graph-components/PieChart&Donut/dragging-pie-slices/dragging-pie-slices.component';
import { GrainyGradientPieComponent } from 'src/app/graph-components/PieChart&Donut/grainy-gradient-pie/grainy-gradient-pie.component';
import { PieChartWithLegendComponent } from 'src/app/graph-components/PieChart&Donut/pie-chart-with-legend/pie-chart-with-legend.component';
import { PieChartComponent } from 'src/app/graph-components/PieChart&Donut/pie-chart/pie-chart.component';
import { SemiCirclaPieChartComponent } from 'src/app/graph-components/PieChart&Donut/semi-circla-pie-chart/semi-circla-pie-chart.component';
import { SimplePieChartComponent } from 'src/app/graph-components/PieChart&Donut/simple-pie-chart/simple-pie-chart.component';
import { VariableRadiusPieChartComponent } from 'src/app/graph-components/PieChart&Donut/variable-radius-pie-chart/variable-radius-pie-chart.component';
import { LiveSortingRadarChartColumnComponent } from 'src/app/graph-components/radarAndPolar/live-sorting-radar-chart-column/live-sorting-radar-chart-column.component';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';


@Component({
standalone : true,
  selector: 'app-am-charts',
  templateUrl: './am-charts.component.html',
  styleUrls: ['./am-charts.component.scss'],
  imports : [SolidGuageComponent,STANDALONE_IMPORTS,NgSelectModule,LiveSortingRadarChartColumnComponent,SimplePieChartComponent,VariableRadiusPieChartComponent,SemiCirclaPieChartComponent,PieChartComponent,PieChartWithLegendComponent,GrainyGradientPieComponent,DraggingPieSlicesComponent,DonutWithRadialGradientComponent,DonutChartComponent,VennDiagramComponent,SpectrumChartComponent,ProgressChartComponent,VerticleLinechrtComponent,ZoomableValueAxisComponent,TrendLinesComponent,StepLineWithoutRisersChartComponent,ReversedValueAxisChrtComponent,LineWithDifferentNegativeColorChrtComponent,LineWithDifferentColorUpsDownsComponent,LineWithChangingColorsComponent,LineGraphChartComponent,LineChartScrollAndZoomComponent,LineChartRangeSliderComponent,HighlightingLineChartSeriesonLegendHoverComponent,DateBasedDataComponent,DataGroupingFiftyThousandPointsComponent,AngularGaugetwoAxisComponent,PyramidComponent,FunnelChartComponent,VarianceIndicatorsComponent,StepCountChartComponent,StackedColumnChartComponent,StackedClusteredColumnChartComponent,StackedBarChartNegativeValuesComponent,SortedBarChartComponent,SimpleColumnChartComponent,RealTimeDataSortingComponent,ParetoDiagramComponent,CurvedColumnsComponent,ColumnsGrainyGradientsComponent,ColumnRotatedLabelsComponent,ColumnLineMixComponent,LayeredColumnChartComponent,HundredStackedColumnChartComponent,FishboneTimelineComponent,SerpentineTimelineComponent,BarLineChartMixComponent,ClusteredBarChartComponent,ClusteredColumnChartComponent,
    GroupedStacksComponent,GroupedSortedColumnsComponent,DragOrderingBarsComponent,GuageGradientFillComponent,StackedBarChartComponent,HybridDrillDownPieBarChartComponent],
})
export class AmChartsComponent implements OnInit, OnDestroy {

  @ViewChild('mySelect') selectRef1: IonSelect;
  @ViewChild('graphType') graphTypeSelect;

  @ViewChild('input') myInput;

  selectShow: boolean = false;

  showTable: boolean = false;
  id: any = 0;

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  showFrame: boolean = true;
  item_slno_count: number = 1;
  current_page_parameter: any = {};
  wscp: any = {};
  callingObjectArr: any = [];
  tableData: any;
  colSize: any = [];
  checkCardItem = false;
  firstEmptyframe: any;
  developerModeData: any;
  subscribeRefreshFlag = false;
  searchText: any;
  jsonTableData = [];
  tableRows = [];

  chartData = [];

  chartId: any;

  openModal = "Open Popover"

  data = [];

  backButton = [];

  chartList: any;

  openPopover = false;

  crossIcon: boolean = true;



  // triangleFlag : boolean = true
  // paretoFlag : boolean = false
  // realtimeFlag : boolean = false
  // partitionedBarFlag : boolean = false
  // sortedBarFlag : boolean = false
  // columnRotatedFlag : boolean = false
  // simpleColumnFlag : boolean = false
  // cylinderChartFlag: boolean = false
  // threeDColumnFlag: boolean = false

  graphFlag = "triangleFlag";

  xList = [];
  yList = [];
  dList = [];

  x1Axis: any;
  x2Axis: any;
  x3Axis: any;
  x4Axis: any;
  y1Axis: any;
  y2Axis: any;
  y3Axis: any;
  y4Axis: any;
  y5Axis: any;
  d1Axis: any;
  d2Axis: any;

  iconName: any;

  refreshing = false;
type: string = '';

  loading: boolean = false;

  graphDataSubject: Subject<any> = new BehaviorSubject<any>([]);

  chartDDList = [];
  tHead = [];
  compName: any;

  constructor(public globalObjects: GlobalObjectsService, private events: Events, private dataService: DataService,
    public lhs_lib: LhsLibService, private modalController: ModalController, public popoverController: PopoverController) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if (this.globalObjects.frameFlag) {
      return applyLoggingDecorator(this, "am-charts-frame")
    }
  }
  name_Seq
  name_Item
  ngOnInit() {


    let nameSeq = "refreshGraph_" + this.frame.apps_page_frame_seqid;
    this.name_Seq = nameSeq
    let nameItem = "refreshGraph_" + this.frame.frame_alias;
    this.name_Item = nameItem
    if (!this.subscribeRefreshFlag) {
      this.events.unsubscribe(nameItem);
      this.events.subscribe((nameItem), res => {
        if (res.evFlag == "T") {
          res.evFlag = "F";
          // this.frame.chartData = [];
          // this.xList = [];
          // this.yList = [];
          // this.dList = [];
          this.refreshData();
        }
      })
      this.events.unsubscribe(nameSeq);
      this.events.subscribe((nameSeq), res => {
        if (res.evFlag == "T") {
          res.evFlag = "F";
          // this.frame.chartData = [];
          // this.xList = [];
          // this.yList = [];
          // this.dList = [];
          this.refreshData();
        }
      })
      this.subscribeRefreshFlag = true;
    }

    this.subscribeRefreshFlag = false;

    for (let itemGroup of this.frame.Level4) {
      for (let item of itemGroup.Level5) {
        if (item.item_name == "WMA_FRAME_STATUS") {
          item.value = 'D';
        }
      }
    }

    this.developerModeData = {
      frame_seq_id: this.frame.apps_page_frame_seqid
    }

    for (let itemGroup of this.frame.Level4) {
      for (let item of itemGroup.Level5) {
        if (item.item_visible_flag == 'T') {
          let obj = {
            prompt_name: item.prompt_name,
            item_name: item.item_name,
            dataType: item.datatype,
            display_setting_str: item.display_setting_str
          }

          //console.log(item.datatype)
          this.tHead.push(obj)
        }

      }
    }


    //console.log(this.tHead);


    // if (this.amChartsPopover) {
    //   this.openPopover
    // }


    this.chartLists();

    this.type = this.frame.apps_frame_sub_type.split("(")[1].split(")")[0].replaceAll("'", "");

    let list = this.chartList.filter(x => x.dataType == this.type);

    if (list) {
      this.chartDDList = list;
    } else {
      this.chartDDList = this.chartList
    }

    if (this.frame.frame_filter_flag) {
      let id = this.frame.frame_filter_flag;
      let chart = this.chartDDList.find(x => x.chart_id == id);
      if (chart) {
        this.graphFlag = chart.flag;
        this.iconName = chart.chartName
        this.compName = chart.componentName
        this.chartId = chart.chart_id
      } else {
        this.graphFlag = this.chartDDList[0].flag;
        this.iconName = this.chartDDList[0].chartName;
        this.compName = this.chartDDList[0].componentName
        this.chartId = this.chartDDList[0].chart_id
      }

    } else {
      this.graphFlag = this.chartDDList[0].flag;
      this.iconName = this.chartDDList[0].chartName;
      this.compName = this.chartDDList[0].componentName
      this.chartId = this.chartDDList[0].chart_id
    }
    // //console.log(this.chartDDList);


    if (this.frame.modalFlag) {
      this.tableData = this.frame.tableData
    } else {
    }

    this.displayData();


  }

  refreshData() {
    if (this.frame.chartData) {
      this.graphDataSubject.next(this.frame.chartData);
    }
  }

  getHeaders(frame) {
    let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
    this.xList = [];
    this.yList = [];
    this.dList = [];

    for (let itemGroup of frameLevel4) {
      for (let item of itemGroup.Level5) {
        if (item.datatype == "NUMBER") {
          let obj = {
            promptName: item.prompt_name,
            itemName: item.item_name
          }
          this.yList.push(obj);
        } else if (item.datatype == "VARCHAR2") {
          let obj = {
            promptName: item.prompt_name,
            itemName: item.item_name
          }
          this.xList.push(obj);
        } else if (item.datatype == "DATE" || item.datatype == "DATETIME") {
          let obj = {
            promptName: item.prompt_name,
            itemName: item.item_name
          }
          this.dList.push(obj);
        }
      }
    }
  }

  displayData() {

    let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    for (let itemGroup of frameLevel4) {
      for (let item of itemGroup.Level5) {
        if ((item.item_name) && (item.item_visible_flag == 'T')) {
          if ((item.item_name.indexOf("X") > -1) || (item.item_name.indexOf("Y") > -1) || (item.item_name.indexOf("D") > -1)) {

            if (item.item_default_value) {
              if ((item.item_default_value.toLowerCase().indexOf("avg") > -1) || (item.item_default_value.toLowerCase().indexOf("sum") > -1)) {

                let str = item.item_default_value.toUpperCase().split("(")[1].split(")")[0].replaceAll("'", "");
                let name = this.lhs_lib.get_item(str, 0);

                if (item.item_name == "Y1") {
                  this.y1Axis = name.item_name;
                } else if (item.item_name == "Y2") {
                  this.y2Axis = name.item_name;
                } else if (item.item_name == "Y3") {
                  this.y3Axis = name.item_name;
                } else if (item.item_name == "Y4") {
                  this.y4Axis = name.item_name;
                }

              } else {

                let name = this.lhs_lib.get_item(item.item_default_value, 0);
                if (item.item_name == "X1") {
                  this.x1Axis = name.item_name;
                } else if (item.item_name == "X2") {
                  this.x2Axis = name.item_name;
                } else if (item.item_name == "X3") {
                  this.x3Axis = name.item_name;
                } else if (item.item_name == "X4") {
                  this.x4Axis = name.item_name;
                } else if (item.item_name == "D1") {
                  this.d1Axis = name.item_name;
                } else if (item.item_name == "D2") {
                  this.d2Axis = name.item_name;
                }
              }
            } else {

              if (item.item_name == "Y1") {
                this.y1Axis = item.item_name;
              } else if (item.item_name == "Y2") {
                this.y2Axis = item.item_name;
              } else if (item.item_name == "Y3") {
                this.y3Axis = item.item_name;
              } else if (item.item_name == "Y4") {
                this.y4Axis = item.item_name;
              } else if (item.item_name == "X1") {
                this.x1Axis = item.item_name;
              } else if (item.item_name == "X2") {
                this.x2Axis = item.item_name;
              } else if (item.item_name == "X3") {
                this.x3Axis = item.item_name;
              } else if (item.item_name == "X4") {
                this.x4Axis = item.item_name;
              } else if (item.item_name == "D1") {
                this.d1Axis = item.item_name;
              } else if (item.item_name == "D2") {
                this.d2Axis = item.item_name;
              }

            }
          }
        }
      }
    }

  }

  changeX(x, type) {
    this.loading = true;
    this.frame.chartData = [];
    let frameL4 = this.frame.Level4;
    for (let itemGroup of frameL4) {
      for (let item of itemGroup.Level5) {
        if (item.item_name == type) {
          item.item_default_value = x;

          let prompt = this.xList.find(x => x.itemName == x);

          if (prompt) {
            item.prompt_name = prompt.promptName;
          }
        }
      }
    }

    this.parseBuiltins();
  }

  changeY(y, type) {
    this.loading = true;
    this.frame.chartData = [];
    let frameL4 = this.frame.Level4;
    for (let itemGroup of frameL4) {
      for (let item of itemGroup.Level5) {
        if (item.item_name == type) {
          item.item_default_value = "sum('" + y + "')";

          let prompt = this.yList.find(x => x.itemName == x);

          if (prompt) {
            item.prompt_name = prompt.promptName;
          }
        }
      }
    }
    this.parseBuiltins();
  }

  parseBuiltins() {
    if (this.frame.on_frame_load_str) {

      let builtinsArr = [];

      if (this.frame.relational_string) {
        if (this.frame.relational_string && this.frame.relational_string.indexOf(";") > -1) {
          builtinsArr = this.frame.relational_string.split(";");
        } else {
          builtinsArr[0] = this.frame.relational_string;
        }

      } else {
        if (this.frame.on_frame_load_str && this.frame.on_frame_load_str.indexOf(";") > -1) {
          builtinsArr = this.frame.on_frame_load_str.split(";");
        } else {
          builtinsArr[0] = this.frame.on_frame_load_str;
        }
      }

      let parseFrame = JSON.parse(JSON.stringify(this.frame));

      parseFrame.click_events_arr = this.frame.relational_string ? this.frame.relational_string : this.frame.on_frame_load_str;
      parseFrame.itemClicked = "pre";
      this.emitPass.emit(parseFrame);

      this.frame.relational_string = "";

    }
  }


  itemClick(index) {
    alert("itemClick" + index);


    let x1_item;
    let d1_item;
    let event;
    for (let itemGroup of this.frame.tableRows[index]) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          console.log(item)
          if (item.item_name.toUpperCase() == 'X1') {
            x1_item = item;
          }

          if (item.item_name.toUpperCase() == 'D1') {
            d1_item = item;
          }
        }
      }
    }
    if (x1_item) {
      event = x1_item;
    } else if (d1_item) {
      event = d1_item;
    }

    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = event.indexcount;
    this.emitPass.emit(event);

  }



  itemClicked(index, item_name) {
    // alert(index+item_name);
    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    let event: any;
    for (let itemGroup of this.frame.tableRows) {
      for (let item of itemGroup) {
        for (let itm of item.Level5) {
          // console.log("amchart item : ",Number(itm.value))

          if (Number(itm.value) == Number(item_name)) {
            // console.log('The item is a string that can be converted to a number',itm.value);
            // if(Number(itm.value)==Number(item_name)){
            // alert("item name got number: "+itm.value+" "+ item_name);
            event = itm;
            // }
          } else {
            console.log("item name gotdfdff : " + itm.value + " " + item_name);
            if (itm.value == item_name) {
              // alert("item name got : "+itm.value+" "+item_name);
              event = itm;
            }
          }

          // if(itm.value==item_name){
          //   alert("item name got : "+itm.item_name+item.value);
          //   event=itm;
          // }
        }
      }
    }
    this.frame.active_row = event.indexcount;
    console.log("count : ", event.indexcount);
    this.emitPass.emit(event);
  }

  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: "my-custom-class",
      componentProps: {
        data: this.developerModeData,
        requestData: this.frame
      }
    });
    return await modal.present();
  }

  myFunction() {

    document.getElementById("myDropdown")

  }


  openSelect() {
    this.selectShow = !this.selectShow;
    this.showTable = false
    this.selectRef1.open();
    var input = document.getElementById('testInput');
    // //console.log("Input :",input);
    input.focus();

  }


  onChange(val) {
    this.selectShow = false;
    if (val) {
      let chart = this.chartDDList.find(x => x.flag == val)
      this.iconName = chart.chartName
      this.compName = chart.componentName
      this.chartId = chart.chart_id
    } else {
      this.graphFlag = this.chartDDList[0].flag;
      this.iconName = this.chartDDList[0].chartName;
      this.compName = this.chartDDList[0].componentName
      this.chartId = this.chartDDList[0].chart_id
    }
  }

  showtableFunc() {
    let frame = JSON.parse(JSON.stringify(this.frame));
    this.tableData = frame.tableData;
    this.showTable = !this.showTable
  }




  async amChartsPopover() {
    // this.openModal = "Open Modal"
    let modalFrame = JSON.parse(JSON.stringify(this.frame));
    console.log(modalFrame)
    // let backButton = JSON.parse(JSON.stringify())
    modalFrame.CSS_CLASS_FRAME = {
      // "height" : "80%",

      // "width" : "80%"
      // headerFlag : true  
    }
    modalFrame.headerFlag = true;
    modalFrame.modalFlag = true;
    modalFrame.frame_filter_flag = this.chartId
    modalFrame.crossIcon = false;
    modalFrame.design_control_type = 12;
    const popover = await this.popoverController.create({
      component: AmChartsComponent,
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: 'amChartsPopOver',
      id: 'amChartsPopOver',
      componentProps: {
        'frame': modalFrame,
        "crossIcon": false,
        "subData": this.graphDataSubject
        // 'data': this.frame.chartData,

      }
    });


    await popover.present();

  }



  async closeModal() {
    await this.popoverController.dismiss();
  }


  chartLists() {
    this.chartList = [

      {
        chartName: "Pareto Charts",  //1
        flag: "paretoFlag",
        dataType: "X1,Y1",
        chart_id: 1,
        componentName: ParetoDiagramComponent
      },
      {
        chartName: "Pyramid Chart", //2
        flag: "pyramidChartFlag",
        dataType: "X1,Y1",
        chart_id: 2,
        componentName: PyramidComponent
      },

      {
        chartName: "Real time data sorting", //4
        flag: "realtimeFlag",
        dataType: "X1,Y1",
        chart_id: 3,
        componentName: RealTimeDataSortingComponent
      },

      {
        chartName: "Sorted bar chart",//7
        flag: "sortedFlag",
        dataType: "X1,Y1",
        chart_id: 4,
        componentName: SortedBarChartComponent
      },
      {
        chartName: "Grainy Gradient Pie Chart",//8
        flag: "grainyGradientGraphFlag",
        dataType: "X1,Y1",
        chart_id: 5,
        componentName: GrainyGradientPieComponent
      },
      {
        chartName: "Live sorting Radar columns",//9
        flag: "liveSortingdFlag",
        dataType: "X1,Y1",
        chart_id: 6,
        componentName: LiveSortingRadarChartColumnComponent
      },
      {
        chartName: "Simple Column Chart ",//10
        flag: "simpleColumnFlag",
        dataType: "X1,Y1",
        chart_id: 7,
        componentName: SimpleColumnChartComponent
      },
      {
        chartName: "Variance Indicator",//11
        flag: "varianceFlag",
        dataType: "X1,Y1",
        chart_id: 8,
        componentName: VarianceIndicatorsComponent
      },

      {
        chartName: "Column With Rotated Labels",
        flag: "columnRotatedSeriesFlag",
        dataType: "X1,Y1",
        chart_id: 9,
        componentName: ColumnRotatedLabelsComponent
      },
      {
        chartName: "Simple Pie Chart",
        flag: "simplePieChartFlag",
        dataType: "X1,Y1",
        chart_id: 10,
        componentName: SimplePieChartComponent
      },


      {
        chartName: "Donut chart",
        flag: "donutChartFlag",
        dataType: "X1,Y1",
        chart_id: 11,
        componentName: DonutChartComponent
      },
      {
        chartName: "Venn diagram",
        flag: "vennDiagramFlag",
        dataType: "X1,Y1",
        chart_id: 12,
        componentName: VennDiagramComponent
      },
      {
        chartName: "Semi-circle Pie chart",
        flag: "semiCirclePieChartFlag",
        dataType: "X1,Y1",
        chart_id: 13,
        componentName: SemiCirclaPieChartComponent
      },
      {
        chartName: "Curved columns",
        flag: "curvedColumnsFlag",
        dataType: "X1,Y1",
        chart_id: 14,
        componentName: CurvedColumnsComponent
      },
      {
        chartName: "Funnel chart",
        flag: "funnelChartFlag",
        dataType: "X1,Y1",
        chart_id: 15,
        componentName: FunnelChartComponent
      },


      {
        chartName: "Pie Chart",
        flag: "pieChartFlag",
        dataType: "X1,Y1",
        chart_id: 16,
        componentName: PieChartComponent
      },
      {
        chartName: "Pie Chart With Legend",
        flag: "pieChartLegendFlag",
        dataType: "X1,Y1",
        chart_id: 17,
        componentName: PieChartWithLegendComponent
      },
      {
        chartName: "Donut with radial gradient",
        flag: "donutRadialChartflag",
        dataType: "X1,Y1",
        chart_id: 18,
        componentName: DonutWithRadialGradientComponent
      },

      {
        chartName: "Variable Radius Pie Chart",
        flag: "variableRadiusPieChartFlag",
        dataType: "X1,Y1",
        chart_id: 19,
        componentName: VariableRadiusPieChartComponent
      },

      {
        chartName: "Dragging Pie Slices",
        flag: "draggingPieSliceFlag",
        dataType: "X1,Y1",
        chart_id: 20,
        componentName: DraggingPieSlicesComponent
      },
      {
        chartName: "Columns with Grainy Gradients",
        flag: "grainygradientsFlag",
        dataType: "X1,Y1",
        chart_id: 21,
        componentName: ColumnsGrainyGradientsComponent
      },
      {
        chartName: "Line with Changing colors",
        flag: "lineChangingColorFlag",
        dataType: "X1,Y1",
        chart_id: 35,
        componentName: LineWithChangingColorsComponent
      },
      {
        chartName: "Venn Diagram",
        flag: "venndiagram",
        dataType: "X1,Y1",
        chart_id: 52,
        componentName: VennDiagramComponent
      },

  {
        chartName: "Drag-ordering of Bars",
        flag: "dragOrderingFlag",
        dataType: "X1,Y1",
        chart_id:87,
        componentName: DragOrderingBarsComponent
      },
      // ***************D1,Y1****************

      {
        chartName: "Step count chart", //33
        flag: "stepCountFlag",
        dataType: "D1,Y1",
        chart_id: 22,
        componentName: StepCountChartComponent
      },

      {
        chartName: "Date Base Data	", //34
        flag: "dateBasedFlag",
        dataType: "D1,Y1",
        chart_id: 23,
        componentName: DateBasedDataComponent
      },
      {
        chartName: "Data grouping 50K points", //35
        flag: "dataGroupingFlag",
        dataType: "D1,Y1",
        chart_id: 24,
        componentName: DataGroupingFiftyThousandPointsComponent
      },
      {
        chartName: "Line chart with range slider", //36
        flag: "lineChartRangeFlag",
        dataType: "D1,Y1",
        chart_id: 25,
        componentName: LineChartRangeSliderComponent
      },

      {
        chartName: "Step Line Without Risers", //38
        flag: "stepLineWithoutRisersFlag",
        dataType: "D1,Y1",
        chart_id: 26,
        componentName: StepLineWithoutRisersChartComponent
      },

      {
        chartName: "Vertical Line Chart", //40
        flag: "verticalLineFlag",
        dataType: "D1,Y1",
        chart_id: 27,
        componentName: VerticleLinechrtComponent
      },

      {
        chartName: "Line graph", //41
        flag: "lineGraphFlag",
        dataType: "D1,Y1",
        chart_id: 28,
        componentName: LineGraphChartComponent
      },

      {
        chartName: "Line Chart with Scroll and Zoom",  //44
        flag: "lineChartScrollFlag",
        dataType: "D1,Y1",
        chart_id: 29,
        componentName: LineChartScrollAndZoomComponent
      },
      {
        chartName: "Highlighting line chart series on legend hover",
        flag: "highlightingLineFlag",
        dataType: "D1,Y1",
        chart_id: 30,
        componentName: HighlightingLineChartSeriesonLegendHoverComponent
      },
      {
        chartName: "Zoomable Value Axis",  //45
        flag: "zoomableValueAxisFlag",
        dataType: "D1,Y1",
        chart_id: 31,
        componentName: ZoomableValueAxisComponent
      },

      {
        chartName: "Trend Line",  //47
        flag: "trendLineFlag",
        dataType: "D1,Y1",
        chart_id: 32,
        componentName: TrendLinesComponent
      },
      {
        chartName: "Line with different negative color",  //48
        flag: "lineDifferentNegativeFlag",
        dataType: "D1,Y1",
        chart_id: 33,
        componentName: LineWithDifferentNegativeColorChrtComponent
      },
      {
        chartName: "Line with different colors for ups and downs",
        flag: "lineDiffColorFlag",
        dataType: "D1,Y1",
        chart_id: 34,
        componentName: LineWithDifferentColorUpsDownsComponent
      },

      // // **************(x1,y1,y2)*************

      {
        chartName: "Column and Line mix",  //50
        flag: "columnLineMixFlag",
        dataType: "X1,Y1,Y2",
        chart_id: 36,
        componentName: ColumnLineMixComponent
      },

      {
        chartName: "Layered Column Chart",  
        flag: "layeredChartFlag",
        dataType: "X1,Y1,Y2",
        chart_id: 37,
        componentName: LayeredColumnChartComponent
      },
      {
        chartName: "Stacked bar chart with negative values",  
        flag: "stackedNegativeFlag",
        dataType: "X1,Y1,Y2",
        chart_id: 38,
        componentName: StackedBarChartNegativeValuesComponent
      },
      {
        chartName: "Bar and line chart mix",  //54
        flag: "barLineChartFlag",
        dataType: "X1,Y1,Y2",
        chart_id: 39,
        componentName: BarLineChartMixComponent
      },

      {
        chartName: "100% Stacked Column Chart",  //60
        flag: "hundredStackColumnFlag",
        dataType: "X1,Y1,Y2,Y3",
        chart_id: 40,
        componentName: HundredStackedColumnChartComponent
      },
      {
        chartName: "Clustered column chart", //create series
        flag: "clusterChartflag",
        dataType: "X1,YN",
        chart_id: 41,
        componentName: ClusteredColumnChartComponent
      },

      {
        chartName: "Reversed Value Axis",  //61
        flag: "reverseValueAxisFlag",
        dataType: "X1,Y1,Y2,Y3",
        chart_id: 42,
        componentName: ReversedValueAxisChrtComponent
      },


      {
        chartName: "Angular Gauge With Two Axes",
        flag: "angularGaugeTwoAxes",
        dataType: "From,To,Y1,Y2,X1,X2",
        chart_id: 43,
        componentName: AngularGaugetwoAxisComponent
      },



      {
        chartName: "Spectrum Chart",
        flag: "spectrumchart",
        dataType: "D1,D2,X1,X2",
        chart_id: 53,
        componentName: SpectrumChartComponent
      },
      {
        chartName: "Progress Chart",
        flag: "progresschart",
        dataType: "X1,X2,Y1,Y2",
        chart_id: 54,
        componentName: ProgressChartComponent
      },
      {
        chartName: "Fishbone timeline",
        flag: "fishBoneTimeline",
        dataType: "X1,X2,X3,Y1",
        chart_id: 55,
        componentName: FishboneTimelineComponent
      },
      {
        chartName: "Serpentine Timeline",
        flag: "serpentineTimeline",
        dataType: "D1,D2,X1,X2,X3,COLOR",
        chart_id: 56,
        componentName: SerpentineTimelineComponent
      },
      {
        chartName: "Clustered Bar Chart",  //55
        flag: "clusterBarFlag",
        dataType: "X1,Y1,Y2",
        chart_id: 57,
        componentName: ClusteredBarChartComponent
      },
      {
        chartName: "Stacked and Clustered Column Chart",  //66
        flag: "stackedClusterChartFlag",
        dataType: "X1,YN",
        chart_id: 58,
        componentName: StackedClusteredColumnChartComponent
      },
      {
        chartName: "Stacked Column Chart",
        flag: "stackColumnflag",
        dataType: "X1,YN",
        chart_id: 77,
        componentName: StackedColumnChartComponent
      },
      {
        chartName: "Stacked Bar Chart",
        flag: "stackedBarChartFlag",
        dataType: "X1,YN",
        chart_id: 78,
        componentName: StackedBarChartComponent
      },

{
        chartName: "Grouped and Sorted Columns",
        flag: "groupedSortedColumnsFlag",
        dataType: "XN,Y1",
        chart_id: 79,
        componentName: GroupedSortedColumnsComponent
      },
{
        chartName: "Solid Gauge",
        flag: "solidGaugeFlag",
        dataType: "X1,Y1",
        chart_id: 80,
        componentName: SolidGuageComponent
      },

   {
        chartName: "Gauge with gradient fill",
        flag: "gaugeGradientFill",
        dataType: "From,To,Y1",
        chart_id: 82,
        componentName: GuageGradientFillComponent
      },
        {
        chartName: "Grouped Stacks",
        flag: "groupedStackFlag",
        dataType: "X1,YN",
        chart_id: 44,
        componentName: GroupedStacksComponent
      },
      // {
      //   chartName: "Annotating Charts",
      //   flag: "annotatingcharts",
      //   dataType: "X1,Y1",
      //   chart_id: 45,
      //   componentName: AnnotatingChartsComponent
      // },
      //       {
      //   chartName: "Tile Map",
      //   flag: "tilemap",
      //   dataType: "X1,Y1",
      //   chart_id: 46,
      //   componentName: TileMapComponent
      // },
          {
        chartName: "Hybrid drill down Pie/Bar Chart",
        flag: "hybriddrilldown",
        dataType: "X1,YN",
        chart_id: 47,
        componentName: HybridDrillDownPieBarChartComponent
      },
      // {
      //   chartName: "Mekko Chart",
      //   flag: "mekkochart",
      //   dataType: "X1,Y1",
      //   chart_id: 48,
      //   componentName: MekkoChartComponent
      // },
      // {
      //   chartName: "Combined Bullet/Column and Line Graphs with multiple Value Axis",
      //   flag: "combinedbulletcolumnlinegraphsmultiplevalueaxis",
      //   dataType: "X1,Y1",
      //   chart_id: 49,
      //   componentName: CombinedBulletLineMultipleValueAxisComponent
      // },
      // {
      //   chartName: "Micro Charts & Sparklines",
      //   flag: "microchartsparklines",
      //   dataType: "X1,Y1",
      //   chart_id: 50,
      //   componentName: MicroChartsSparklinesComponent
      // },
      // {
      //   chartName: "Exporting Chart to Image",
      //   flag: "exportingcharttoimage",
      //   dataType: "X1,Y1",
      //   chart_id: 51,
      //   componentName: ExportingChartImageComponent
      // },
      // {
      //   chartName: "Word Cloud",
      //   flag: "wordcloud",
      //   dataType: "X1,Y1",
      //   chart_id: 44,
      //   componentName: WordCloudComponent
      // },
      // {
      //   chartName: "Population Pyramid",
      //   flag: "populationpyramid",
      //   dataType: "X1,Y1",
      //   chart_id: 64,
      //   componentName: PopulationPyramidComponent
      // },
      // {
      //   chartName: "Historical Population Pyramid",
      //   flag: "historicalpopulationpyramid",
      //   dataType: "X1,Y1",
      //   chart_id: 68,
      //   componentName: HistoricalPopulationPyramidComponent
      // },
      // {
      //   chartName: "Sentence Cloud",
      //   flag: "sentencecloud",
      //   dataType: "X1,Y1",
      //   chart_id: 69,
      //   componentName: SentenceCloudComponent
      // },

      // {
      //   chartName: "Honeycomb tile map",
      //   flag: "honeycombtilemap",
      //   dataType: "X1,Y1",
      //   chart_id: 71,
      //   componentName: HoneycombTileMapComponent
      // },
      // {
      //   chartName: "Vertically Stcaked Axes Chart",
      //   flag: "verticallystackedaxeschart",
      //   dataType: "X1,Y1",
      //   chart_id: 72,
      //   componentName: VerticallyStackedAxesChartComponent
      // },
      // {
      //   chartName: "Pictogram",
      //   flag: "pictogram",
      //   dataType: "X1,Y1",
      //   chart_id: 73,
      //   componentName: PictogramComponent
      // },
      // {
      //   chartName: "Infographic",
      //   flag: "infographic",
      //   dataType: "X1,Y1",
      //   chart_id: 74,
      //   componentName: InfographicComponent
      // },
      // {
      //   chartName: "Strip Plot",
      //   flag: "stripplot",
      //   dataType: "X1,Y1",
      //   chart_id: 75,
      //   componentName: StripPlotComponent
      // },
      // {
      //   chartName: "Venn Diagram with Patterns",
      //   flag: "venndiagrampatterns",
      //   dataType: "X1,Y1",
      //   chart_id: 76,
      //   componentName: VennDiagramPatternsComponent
      // },
      // {
      //   chartName: "Complex Venn Diagram",
      //   flag: "complexvenndiagram",
      //   dataType: "X1,Y1",
      //   chart_id: 77,
      //   componentName: ComplexVennDiagramComponent
      // },
      // {
      //   chartName: "Horizontally Stacked Axis",
      //   flag: "horizontallystackedaxis",
      //   dataType: "X1,Y1",
      //   chart_id: 78,
      //   componentName: HorizontallyStackedAxisComponent
      // },
      // {
      //   chartName: "Tag Cloud",
      //   flag: "tagcloud",
      //   dataType: "X1,Y1",
      //   chart_id: 79,
      //   componentName: TagCloudComponent
      // },

      // {
      //   chartName: "Forest Chart",
      //   flag: "forestchart",
      //   dataType: "X1,Y1",
      //   chart_id: 88, 
      //   componentName: ForestPlotComponent
      // },
      // {
      //   chartName: "Range Bullet Chart",
      //   flag: "rangebulletchart",
      //   dataType: "X1,Y1",
      //   chart_id: 89,
      //   componentName: RangeBulletChartComponent
      // },




      // {
      //   chartName: "Variable-height 3D Pie Chart", //29
      //   flag: "variableHeightThreePieChartFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 29,
      //   componentName: VariableHeightThreeDPieChartComponent
      // },
      //color
      // {
      //   chartName: "3D Pie Chart", //26
      //   flag: "threeDPieChartFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 26,
      //   componentName: ThreeDPieChartComponent
      // },
      // {
      //   chartName: "3D Donut Chart", //27
      //   flag: "threeDDonutChartFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 27,
      //   componentName: ThreeDDonutChartComponent
      // },
      // {
      //   chartName: "Chart With Gaps In Data",//22
      //   flag: "chartgapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 22,
      //   componentName: ChartGapsDataComponent
      // },

      // {
      //   chartName: "Lollipop Chart",//23
      //   flag: "lollipopChartFlag",
      //   dataType: "X1,Y1"
      // },
      // {
      //   chartName: "Triangle column chart", //5
      //   flag: "triangleFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 1,
      //   componentName: TriangleColumnChartComponent

      // },
      // {
      //   chartName: "3D Bar Chart", //3
      //   flag: "threeDBarChartFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 4,
      //   componentName: ThreeDBarChartComponent
      // },
      // {
      //   chartName: "Column chart with axis break",//6
      //   flag: "columnAxixBreakFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 6,
      //   componentName: ColumnChartAxisBreakComponent
      // },
      // {
      //   chartName: "3D Cylinder Chart ",//11
      //   flag: "3DCylinderFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 11,
      //   componentName: ThreeDCylinderChartComponent
      // },
      // {
      //   chartName: "3D Stacked Column Chart",//12
      //   flag: "3DStackedColumnChartFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 12,
      //   componentName: ThreeDStackedColumnChartComponent
      // },
      // {
      //   chartName: "Images as categories",//13
      //   flag: "imageCategoryFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 13,
      //   componentName: ImagesAsCategoriesComponent
      // },
      // {
      //   chartName: "Step Line Chart",//16
      //   flag: "stepLineFlag",
      //   dataType: "D1,Y1",
      //   chart_id: 16,
      //   componentName: StepLineChartComponent
      // },
      // {
      //   chartName: "Logarithmic Scale", //42
      //   flag: "logrithmicScaleFlag",
      //   dataType: "D1,Y1",
      //   chart_id: 41,
      //   componentName: LogarithmicScaleComponent
      // },
      // {
      //   chartName: "Mixed daily and intra-day chart",  //43
      //   flag: "mixdailyIntraFlag",
      //   dataType: "D1,Y1",
      //   chart_id: 42,
      //   componentName: MixedDailyIntraDayChartComponent
      // },
      // {
      //   chartName: "Line graph", //41
      //   flag: "lineGraphFlag",
      //   dataType: "D1,Y1",
      //   chart_id: 40,
      //   componentName: LineGraphChartComponent
      // },
      // {
      //   chartName: "Area With Time Based Data", //37
      //   flag: "areaTimeBaseFlag",
      //   dataType: "D1,Y1",
      //   chart_id: 36,
      //   componentName: AreaTimeBasedDataComponent
      // },
      // Image
      // {
      //   chartName: "Columns with moving bullets", //31
      //   flag: "columnMovingBulletFlag",
      //   dataType: "X1,Y1,IMG",
      //   chart_id: 31,
      //   componentName: ColumnMovingBulletsComponent
      // },
      // {
      //   chartName: "Bars with moving bullets",
      //   flag: "barsMovingBulletFlag",
      //   dataType: "X1,Y1"
      // },
      // {
      //   chartName: "Live Data",
      //   flag: "liveDataFlag",
      //   dataType: "D1,Y1"
      // },
      // {
      //   chartName: "Line With Custom Bullets", //39
      //   flag: "lineCustomFlag",
      //   dataType: "D1,Y1",
      //   chart_id: 38,
      //   componentName: LineCustomBulletsComponent
      // },

      // {
      //   chartName: "Smoothed Line Chart",  //46
      //   flag: "smoothLineFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 46,
      //   componentName: SmoothedLineChartComponent
      // },
      // {
      //   // chartName: "Stacked Area",
      //   // flag: "stackAreaFlag",
      //   // dataType: "X1,Y1,Y2,Y3",
      //   // chart_id: 61
      // },

      // // {
      // //   chartName: "Non-ribbon Chord diagram",
      // //   flag: "trendLineFlag",
      // //   dataType: "X1,Y1,Y2"
      // // },


      // {
      //   chartName: "Nested-donut-chart",  //57
      //   flag: "nestedDonutChartFlag",
      //   dataType: "X1,Y1,Y2",
      //   chart_id: 56,
      //   componentName: NestedDonutChartComponent
      // },
      // {
      //   chartName: "Variable-radius nested donut chart",  //58
      //   flag: "radiusNestedDonutChartflag",
      //   dataType: "X1,Y1,Y2",
      //   chart_id: 57,
      //   componentName: VariableRadiusNestedDonutComponent
      // },

      // // ****************(x1,y1,y2,y3)*******************

      // {
      //   chartName: "Variable-width curved column chart",  //59
      //   flag: "variableCurveFlag",
      //   dataType: "X1,Y1,Y2,Y3",
      //   chart_id: 58,
      //   componentName: VariableCurvedColumnComponent
      // },
      // // **************(x1,x2,y1)*********

      // // {
      // //   chartName: "Partitioned bar chart",//create series
      // //   flag: "partitionedBarFlag",
      // //   dataType: "X1,X2,Y1",
      // //   chart_id: 63,
      // //   componentName: PartitionedBarChartComponent
      // // },
      // {
      //   chartName: "Risk Heatmap", //62
      //   flag: "riskHeatMapFlag",
      //   dataType: "X1,X2,Y1",
      //   chart_id: 64,
      //   componentName: RiskHeatmapComponent
      // },

      // {
      //   chartName: "Toggleable chord diagram",  //63
      //   flag: "toggleableChordFlag",
      //   dataType: "X1,X2,Y1",
      //   chart_id: 65,
      //   componentName: ToggleableChordDiagramComponent
      // },

      // {
      //   chartName: "Heat map with Legend",  //64
      //   flag: "heatMapLegendFlag",
      //   dataType: "X1,X2,Y1",
      //   chart_id: 66,
      //   componentName: HeatMapLegendComponent
      // },

      // // ***************(Y1,Y2,Y3,Y4)***********************
      // {
      //   chartName: "Scatter Chart",  //65
      //   flag: "scatterChartFlag",
      //   dataType: "Y1,Y2,Y3,Y4",
      //   chart_id: 67,
      //   componentName: ScatterChartComponent
      // },


      // *************X1,X2,D1,D2,color,b1,img*************
      // {
      //   chartName: "Timeline",  //66
      //   flag: "timelineFlag",
      //   dataType: "X1,Y1,D1,D2",
      //   chart_id: 68,
      //   componentName: TimelineComponent
      // },

      // // ************X1,X2,D1,D2,color**************
      // {
      //   chartName: "Gantt Chart with dates",  //67
      //   flag: "ganttchartDatesFlag",
      //   dataType: "X1,X2,D1,D2",
      //   chart_id: 69,
      //   componentName: GanttChartDatesComponent
      // },

      // // *************(x1,d1,d2,color)****************
      // {
      //   chartName: "Gantt Chart",  //68
      //   flag: "ganttChartFlag",
      //   dataType: "X1,D1,D2",
      //   chart_id: 70,
      //   componentName: GanttChartComponent
      // },
      // // *************(y1,y2,d1)****************
      // {
      //   chartName: "Radial line graph",  //69
      //   flag: "radialLineGraphFlag",
      //   dataType: "D1,Y1,Y2",
      //   chart_id: 71,
      //   componentName: RadialLineGraphComponent
      // },
      // {
      //   chartName: "Drawing chart series with mouse or touch", //70
      //   flag: "drawingChartSeriesFlag",
      //   dataType: "D1,Y1,Y2",
      //   chart_id: 72,
      //   componentName: DrawingChartSeriesMouseTouchComponent
      // },
      // {
      //   chartName: "Comparing different date values Google analytics style", //71
      //   flag: "comparingDifferentFlag",
      //   dataType: "D1,Y1,Y2",
      //   chart_id: 73,
      //   componentName: ComparingDifferentDateValuesGoogleAnalyticsStyleComponent
      // },
      // {
      //   chartName: "Range chart with different fill colors",  //51
      //   flag: "rangeChartFillColor",
      //   dataType: "D1,Y1,Y2",
      //   chart_id: 74,
      //   componentName: RangeChartDifferentFillColorsComponent
      // },
      // // ("Y1,Y2,Y3,Y4,Y5,Y6")
      // {
      //   chartName: "Bubble Chart",  //66
      //   flag: "bubbleChartFlag",
      //   dataType: "Y1,Y2,Y3,Y4,Y5,Y6",
      //   chart_id: 75,
      //   componentName: BubbleChartComponent
      // },


      // // x1,Y1nCraete Series


      // {
      //   chartName: "Clustered column chart", //create series
      //   flag: "clusterChartflag",
      //   dataType: "Y1,Y2,D1",
      //   chart_id: 78,
      //   componentName: ClusteredColumnChartComponent
      // },

      // {
      //   chartName: "Stream / ThemeRiver chart",
      //   flag: "streamThemeRiverFlag",
      //   dataType: "X1,YN",
      //   chart_id: 79,
      //   componentName: StreamThemeRiverComponent
      // },
      // {
      //   chartName: "Divergent stacked bars",
      //   flag: "divergentStackedFlag",
      //   dataType: "X1,YN",
      //   chart_id: 80,
      //   componentName: DivergentStackedBarsComponent
      // },
      // {
      //   chartName: "Duration on Value Axis",
      //   flag: "durationValueAxisFlag",
      //   dataType: "D1,X1,Y1,YN",
      //   chart_id: 81,
      //   componentName: DurationValueAxisComponent
      // },
   
      // {
      //   chartName: "Gauge with bands",
      //   flag: "gaugeBands",
      //   dataType: "X1,Y1",
      //   chart_id: 83,
      //   componentName: GaugeBandsComponent
      // },
      // {
      //   chartName: "clock",
      //   flag: "clockGraph",
      //   dataType: "D1",
      //   chart_id: 84,
      //   componentName: ClockGraphComponent
      // },
      // {
      //   chartName: "Simple Treemap",
      //   flag: "simpleTreeMap",
      //   dataType: "G1,X1,Y1",
      //   chart_id: 86,
      //   componentName: SimpleTreemapComponent
      // },
      // {
      //   chartName: "Fishbone timeline",
      //   flag: "fishBoneTimeline",
      //   dataType: "X1,X2,X3,Y1",
      //   chart_id: 87,
      //   componentName: FishboneTimelineComponent
      // },
      // {
      //   chartName: "Angular Gauge",
      //   flag: "angualrGauge",
      //   dataType: "From,To,Y1",
      //   chart_id: 88,
      //   componentName: FishboneTimelineComponent
      // },
      // {
      //   chartName: "Serpentine Timeline",
      //   flag: "serpentineTimeline",
      //   dataType: "X1,X2,X3,D1,D2,COLOR",
      //   chart_id: 89,
      //   componentName: SerpentineTimelineComponent
      // },
      // {
      //   chartName: "Horizontal Serpentine chart",
      //   flag: "horizontalTimeline",
      //   dataType: "X1,X2,X3,D1,D2,COLOR",
      //   chart_id: 90,
      //   componentName: HorizontalSerpentineComponent
      // },
      // {
      //   chartName: "Linear process diagram",
      //   flag: "linearProcess",
      //   dataType: "X1,X2,X3,D1,D2,COLOR",
      //   chart_id: 91,
      //   componentName: LinearProcessComponent
      // },


      //*************************************Maps****************************************************************

      // {
      //   chartName: "Maps Animations Along Line Components", //70
      //   flag: "animationsLineFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: AnimationsAlongLineComponent
      // },
      // {
      //   chartName: "Maps Approximate Working Hours Map", //70
      //   flag: "approximateWorkingHourMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: ApproximateWorkingHoursMapComponent
      // },
      // {
      //   chartName: "Maps Capital Map", //70
      //   flag: "capitalMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: CapitalsMapComponent
      // },
      // {
      //   chartName: "Maps Changing Map Projections", //70
      //   flag: "changingMapProjectionsFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: ChangingMapProjectionsComponent
      // },
      // {
      //   chartName: "Maps Day and Night World Map", //70
      //   flag: "dayandNightWorlMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: DayAndNightWorldMapComponent
      // },
      // {
      //   chartName: "Maps Drill Down Congressional Map", //70
      //   flag: "drillDownCongressionalFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: DrillDownCongressioanlMapComponent
      // },
      // {
      //   chartName: "Maps Drill Down Map", //70
      //   flag: "drillDownMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: DrillDownMapComponent
      // },
      // {
      //   chartName: "Maps Drill Down To Countries Chart", //70
      //   flag: "drillDownToCountriesFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: DrillDownToCountriesComponent
      // },
      // {
      //   chartName: "Maps Fight Routes Map", //70
      //   flag: "fightRoutesMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: FightRoutesMapComponent
      // },
      // {
      //   chartName: "Maps Grouped Countries Map", //70
      //   flag: "groupedCountriesMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: GroupedCountriesMapComponent
      // },
      // {
      //   chartName: "Maps Location Sensitive Map ", //70
      //   flag: "locationSensitiveMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: LocationSensitiveMapComponent
      // },
      // {
      //   chartName: "Maps Map Animated Bubbles", //70
      //   flag: "mappedAnimatedBubblesFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapAnimatedBubblesComponent
      // },
      // {
      //   chartName: "Maps Map Image Drill Down Chart", //70
      //   flag: "mapImageDrillDownChartFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapImageDrillDownComponent
      // },
      // {
      //   chartName: "Maps Map Imaging Areas Map", //70
      //   flag: "mapImagingAreasMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapImagingAreasMapComponent
      // },
      // {
      //   chartName: "Maps Map Timeline", //70
      //   flag: "mapTimelineFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapTimelineComponent
      // },
      // {
      //   chartName: "Maps Map Using D3 Projections", //70
      //   flag: "mapUsingD3ProjectionsFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapUsingD3ProjectionsComponent
      // },
      // {
      //   chartName: "Maps Map with Animated Lines", //70
      //   flag: "mapsAnimatedLinesFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapWithAnimatedLinesComponent
      // },
      // {
      //   chartName: "Maps Map with Bubbles", //70
      //   flag: "mapBubblesFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapWithBubblesComponent
      // },
      // {
      //   chartName: "Maps Map with Cureved Lines", //70
      //   flag: "mapCurvedLinesFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapWithCurvedLinesComponent
      // },
      // {
      //   chartName: "Maps Map with Dynamic Pie Chart", //70
      //   flag: "mapDynamicPieChartFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapWithDynamicPieChartComponent
      // },
      // {
      //   chartName: "Maps Map with Patterns", //70
      //   flag: "mapPatternsFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapWithPatternsComponent
      // },
      // {
      //   chartName: "Maps Map with Pulsating Bullets", //70
      //   flag: "mapPulsatingBulletsFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapWithPulsatingBulletsComponent
      // },
      // {
      //   chartName: "Maps Map with Sized Pin Bullets", //70
      //   flag: "mapSizedPinBulletsFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MapWithSizedPinBulletsComponent
      // },
      // {
      //   chartName: "Maps Multi Series Map", //70
      //   flag: "multiSeriesMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: MultiSeriesMapComponent
      // },
      // {
      //   chartName: "Maps Pacific Centered Map", //70
      //   flag: "pacificCenteredMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: PacificCenteredMapComponent
      // },
      // {
      //   chartName: "Maps Rotate Globe Selected Country", //70
      //   flag: "rotateGlobeSelectedCountryFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: RotateGlobeSelectedCountryComponent
      // },
      // {
      //   chartName: "Maps Roatating Globe", //70
      //   flag: "rotatingGlobeFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: RotatingGlobeComponent
      // },
      // {
      //   chartName: "Maps Rotating Globe with Circles", //70
      //   flag: "rotatingGlobewithCirclesFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: RotatingGlobewithCirclesComponent
      // },
      // {
      //   chartName: "Maps Selecting Multiple Areas Map", //70
      //   flag: "selectingMultipleAreasMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: SelectingMultipleAreasMapComponent
      // },
      // {
      //   chartName: "Maps US Congressional Districts", //70
      //   flag: "usCongressionalDistrictsFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: UsCongressionalDistrictsComponent
      // },
      // {
      //   chartName: "Maps US Heat Choropleth Map", //70
      //   flag: "usHeatChoroPlethFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: UsHeatChoroplethMapComponent
      // },
      // {
      //   chartName: "Maps Wheather Map", //70
      //   flag: "wheatherMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: WheatherMapComponent
      // },
      // {
      //   chartName: "Maps World Map with Clustered Points", //70
      //   flag: "worldMapsClusteredMapPointsFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: WorldMapsWithClusturedPointsComponent
      // },
      // {
      //   chartName: "Maps World timezone map", //70
      //   flag: "worldtimezonempFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: WorldTimeZoneMapComponent
      // },

      // {
      //   chartName: "Maps Zooming To Countries Map", //70
      //   flag: "zoomingToCountriesMapFlag",
      //   dataType: "X1,Y1",
      //   chart_id: 147,
      //   componentName: ZoomingToCountriesMapComponent
      // },
      // ==============================================MISCELLANEOUS===================================================================================



    ];
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.name_Item);
    this.events.unsubscribe(this.name_Seq);

  }

}
import { GuageGradientFillComponent } from 'src/app/graph-components/gauges/guage-gradient-fill/guage-gradient-fill.component';
import { HybridDrillDownPieBarChartComponent } from 'src/app/graph-components/Miscellaneous/hybrid-drill-down-pie-bar-chart/hybrid-drill-down-pie-bar-chart.component';
import { SolidGuageComponent } from 'src/app/graph-components/gauges/solid-guage/solid-guage.component';
import { GroupedStacksComponent } from 'src/app/graph-components/Column&Bar/grouped-stacks/grouped-stacks.component';






