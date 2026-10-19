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
  selector: 'app-bar-line-chart-mix',
  templateUrl: './bar-line-chart-mix.component.html',
  styleUrls: ['./bar-line-chart-mix.component.scss'],
})
export class BarLineChartMixComponent  implements OnInit {


  @Input() data: any;
  @Input() frame: any;
  id="chartdiv";
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
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  paddingLeft: 0,
  layout: root.verticalLayout
}));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.p50,
  x: am5.p50
}))

let data = this.data;
// let data = [{
//   "year": "2005",
//   "income": 23.5,
//   "expenses": 18.1
// }, {
//   "year": "2006",
//   "income": 26.2,
//   "expenses": 22.8
// }, {
//   "year": "2007",
//   "income": 30.1,
//   "expenses": 23.9
// }, {
//   "year": "2008",
//   "income": 29.5,
//   "expenses": 25.1
// }, {
//   "year": "2009",
//   "income": 24.6,
//   "expenses": 25
// }];;


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let yRenderer = am5xy.AxisRendererY.new(root, {
  cellStartLocation: 0.1,
  cellEndLocation: 0.9,
  minorGridEnabled: true
});

yRenderer.grid.template.set("location", 1);

let yAxis = chart.yAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "X1",
    renderer: yRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

yAxis.data.setAll(data);

let xAxis = chart.xAxes.push(
  am5xy.ValueAxis.new(root, {
    min: 0,
    renderer: am5xy.AxisRendererX.new(root, {
      strokeOpacity: 0.1,
      minGridDistance:70
    })
  })
);
let xField = "X1";
let y1Field = "Y1";
let y2Field = "Y2";
let xLabel = data[0]?.[`${xField}_label`] || xField;
let y1Label = data[0]?.[`${y1Field}_label`] || y1Field;
let y2Label = data[0]?.[`${y2Field}_label`] || y2Field;

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series1 = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: y1Label,
  xAxis: xAxis,
  yAxis: yAxis,
  valueXField: "Y1",
  categoryYField: "X1",
  sequencedInterpolation: true,
  tooltip: am5.Tooltip.new(root, {
    pointerOrientation: "horizontal",
    labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
  })
}));

series1.columns.template.setAll({
  height: am5.percent(70)
});


let series2 = chart.series.push(am5xy.LineSeries.new(root, {
  name: y2Label,
  xAxis: xAxis,
  yAxis: yAxis,
  valueXField: "Y2",
  categoryYField: "X1",
  sequencedInterpolation: true,
  tooltip: am5.Tooltip.new(root, {
    pointerOrientation: "horizontal",
    labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
  })
}));

series2.strokes.template.setAll({
  strokeWidth: 2,
});

series2.bullets.push(function () {
  return am5.Bullet.new(root, {
    locationY: 0.5,
    sprite: am5.Circle.new(root, {
      radius: 5,
      stroke: series2.get("stroke"),
      strokeWidth: 2,
      fill: root.interfaceColors.get("background")
    })
  });
});


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
 legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.p50,
  x: am5.p50
}));

legend.data.setAll(chart.series.values);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "zoomY"
}));
cursor.lineX.set("visible", false);

series1.data.setAll(data);
series2.data.setAll(data);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series1.appear();
series2.appear();
chart.appear(1000, 100);
}}
