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
  selector: 'app-columns-grainy-gradients',
  templateUrl: './columns-grainy-gradients.component.html',
  styleUrls: ['./columns-grainy-gradients.component.scss'],
})
export class ColumnsGrainyGradientsComponent  implements OnInit {

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
  panY: true,
  wheelX: "panX",
  wheelY: "zoomX",
  pinchZoomX: true,
  paddingLeft:0,
  layout: root.verticalLayout
}));

chart.set("colors", am5.ColorSet.new(root, {
  colors: [
    am5.color(0x73556E),
    am5.color(0x9FA1A6),
    am5.color(0xF2AA6B),
    am5.color(0xF28F6B),
    am5.color(0xA95A52),
    am5.color(0xE35B5D),
    am5.color(0xFFA446)
  ]
}))

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  minGridDistance: 50,
  minorGridEnabled: true
});

xRenderer.grid.template.setAll({
  location: 1
})

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0.3,
  categoryField: "X1",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  min: 0,
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "Y1",
  categoryXField: "X1",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueY}"
  }),
}));

series.columns.template.setAll({
  tooltipY: 0,
  tooltipText: "{categoryX}: {valueY}",
  shadowOpacity: 0.1,
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  shadowBlur: 1,
  strokeWidth: 2,
  stroke: am5.color(0xffffff),
  shadowColor: am5.color(0x000000),
  cornerRadiusTL: 50,
  cornerRadiusTR: 50,
  fillGradient: am5.LinearGradient.new(root, {
    stops: [
      {}, // will use original column color
      { color: am5.color(0x000000) }
    ]
  }),
  fillPattern: am5.GrainPattern.new(root, {
    maxOpacity: 0.15,
    density: 0.5,
    colors: [am5.color(0x000000), am5.color(0x000000), am5.color(0xffffff)]
  })
});


series.columns.template.states.create("hover", {
  shadowOpacity: 1,
  shadowBlur: 10,
  cornerRadiusTL: 10,
  cornerRadiusTR: 10
})

series.columns.template.adapters.add("fill", function (fill, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

// Set data
// let data = [{
//   country: "USA",
//   value: 2025
// }, {
//   country: "China",
//   value: 1282
// }, {
//   country: "Japan",
//   value: 909
// }, {
//   country: "Germany",
//   value: 752
// }, {
//   country: "UK",
//   value: 652
// }, {
//   country: "Italy",
//   value: 452
// }];
let data =this.data;
xAxis.data.setAll(data);
series.data.setAll(data);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);

// amCharts
}

}
