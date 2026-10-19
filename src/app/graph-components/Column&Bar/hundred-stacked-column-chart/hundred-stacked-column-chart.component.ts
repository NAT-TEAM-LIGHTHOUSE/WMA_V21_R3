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
  selector: 'app-hundred-stacked-column-chart',
  templateUrl: './hundred-stacked-column-chart.component.html',
  styleUrls: ['./hundred-stacked-column-chart.component.scss'],
})
export class HundredStackedColumnChartComponent  implements OnInit {

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
  // alert("new")
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

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

// let data = [{
//   "year": "2021",
//   "europe": 2.5,
//   "namerica": 2.5,
//   "asia": 2.1,
//   "lamerica": 1,
//   "meast": 0.8,
//   "africa": 0.4
// }, {
//   "year": "2022",
//   "europe": 2.6,
//   "namerica": 2.7,
//   "asia": 2.2,
//   "lamerica": 0.5,
//   "meast": 0.4,
//   "africa": 0.3
// }, {
//   "year": "2023",
//   "europe": 2.8,
//   "namerica": 2.9,
//   "asia": 2.4,
//   "lamerica": 0.3,
//   "meast": 0.9,
//   "africa": 0.5
// }]

let data = this.data;
// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  minorGridEnabled: true
});
let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "year",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

xRenderer.grid.template.setAll({
  location: 1
})

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  max: 100,
  numberFormat: "#'%'",
  strictMinMax: true,
  calculateTotals: true,
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.p50,
  x: am5.p50
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
function makeSeries(name, fieldName) {
  let series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: name,
    stacked: true,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: fieldName,
    valueYShow: "valueYTotalPercent",
    categoryXField: "year"
  }));

  series.columns.template.setAll({
    tooltipText: "{name}, {categoryX}:{valueYTotalPercent.formatNumber('#.#')}%",
    tooltipY: am5.percent(10)
  });
  series.data.setAll(data);
  console.log(this.data)

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear();

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      sprite: am5.Label.new(root, {
        text: "{valueYTotalPercent.formatNumber('#.#')}%",
        fill: root.interfaceColors.get("alternativeText"),
        centerY: am5.p50,
        centerX: am5.p50,
        populateText: true
      })
    });
  });

  legend.data.push(series);
}

// makeSeries("Europe", "europe");
// makeSeries("North America", "namerica");
// makeSeries("Asia", "asia");
// makeSeries("Latin America", "lamerica");
// makeSeries("Middle East", "meast");
// makeSeries("Africa", "africa");
makeSeries("Y1", "Y1");
makeSeries("Y2", "Y2");
makeSeries("Y3", "Y3");

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);

// amCharts
}

}
