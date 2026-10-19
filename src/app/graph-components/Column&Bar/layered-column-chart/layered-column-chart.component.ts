import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-layered-column-chart',
  templateUrl: './layered-column-chart.component.html',
  styleUrls: ['./layered-column-chart.component.scss'],
})
export class LayeredColumnChartComponent  implements OnInit {


  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    // alert("init");
    this.id = "compassChart"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    // this.displayChart();
    this.gloabalObject.chartId++;
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        this.data =  this.frame.chartData; 
      this.displayChart();
      })
    }, 100);

    
    this.subData.subscribe(data => {
      this.data = data;
      this.displayChart();
    })
  }


displayChart(){
let root = am5.Root.new(this.id);

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  paddingLeft: 0,
  layout: root.verticalLayout
}));

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

// let data = [{
//   "X1": "USA",
//   "Y1": 3.5,
//   "Y2": 4.2
// }, {
//   "X1": "UK",
//   "Y1": 1.7,
//   "Y2": 3.1
// }, {
//   "x1": "Canada",
//   "y1": 2.8,
//   "y2": 2.9
// }, {
//   "x1": "Japan",
//   "y1": 2.6,
//   "y2": 2.3
// }, {
//   "x1": "France",
//   "y1": 1.4,
//   "y2": 2.1
// }, {
//   "x1": "Brazil",
//   "y1": 2.6,
//   "y2": 4.9
// }];
let data = this.data;
// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  minGridDistance: 70,
  minorGridEnabled: true
});

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "X1",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {
    themeTags: ["axis"],
    animationDuration: 200
  })
}));

xRenderer.grid.template.setAll({
  location: 1
})

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/

let xField = "X1";
let y1Field = "Y1";
let y2Field = "Y2";
let xLabel = data[0]?.[`${xField}_label`] || xField;
let y1Label = data[0]?.[`${y1Field}_label`] || y1Field;
let y2Label = data[0]?.[`${y2Field}_label`] || y2Field;


let series0 = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Income",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "Y1",
  categoryXField: "X1",
  clustered: false,
  tooltip: am5.Tooltip.new(root, {
    labelText: `${y1Label}: {valueY}`
  })
}));

series0.columns.template.setAll({
  width: am5.percent(80),
  tooltipY: 0,
  strokeOpacity: 0
});


series0.data.setAll(data);


let series1 = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Income",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "Y2",
  categoryXField: "X1",
  clustered: false,
  tooltip: am5.Tooltip.new(root, {
    labelText: `${y2Label}:: {valueY}`
  })
}));

series1.columns.template.setAll({
  width: am5.percent(50),
  tooltipY: 0,
  strokeOpacity: 0
});

series1.data.setAll(data);

let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));


chart.appear(1000, 100);
series0.appear();
series1.appear();
}

}