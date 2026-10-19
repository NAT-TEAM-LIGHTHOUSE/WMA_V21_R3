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
  selector: 'app-stacked-clustered-column-chart',
  templateUrl: './stacked-clustered-column-chart.component.html',
  styleUrls: ['./stacked-clustered-column-chart.component.scss'],
})
export class StackedClusteredColumnChartComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
  }


  ngOnInit() {
   // alert("init");
   this.id = "simplePieChart13_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
// }];

let data = this.data;
// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  cellStartLocation: 0.1,
  cellEndLocation: 0.9,
  minorGridEnabled: true
});

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "X1",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
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
function makeSeries(name, fieldName, stacked) {
  let series = chart.series.push(am5xy.ColumnSeries.new(root, {
    stacked: stacked,
    name: name,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: fieldName,
    categoryXField: "X1"
  }));

  series.columns.template.setAll({
    tooltipText: "{name}, {categoryX}:{valueY}",
    width: am5.percent(90),
    tooltipY: am5.percent(10)
  });
  series.data.setAll(data);

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear();

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      locationY: 0.5,
      sprite: am5.Label.new(root, {
        text: "{valueY}",
        fill: root.interfaceColors.get("alternativeText"),
        centerY: am5.percent(50),
        centerX: am5.percent(50),
        populateText: true
      })
    });
  });

  legend.data.push(series);
}
let xField = "X1";
let xLabel = data[0]?.[`${xField}_label`] || xField;
let y1Field = "Y1";
let y2Field = "Y2";
let y3Field = "Y3";
let y4Field = "Y4";
let y5Field = "Y5";
let y6Field = "Y6";

let y1Label = data[0]?.[`${y1Field}_label`] || y1Field;
let y2Label = data[0]?.[`${y2Field}_label`] || y2Field;
let y3Label = data[0]?.[`${y3Field}_label`] || y3Field;
let y4Label = data[0]?.[`${y4Field}_label`] || y4Field;
let y5Label = data[0]?.[`${y5Field}_label`] || y5Field;
let y6Label = data[0]?.[`${y6Field}_label`] || y6Field;

// makeSeries("Europe", "europe", false);
// makeSeries("North America", "namerica", true);
// makeSeries("Asia", "asia", false);
// makeSeries("Latin America", "lamerica", true);
// makeSeries("Middle East", "meast", true);
// makeSeries("Africa", "africa", true);

// makeSeries(y1Label, "Y1",false);
// makeSeries(y2Label, "Y2",true);
// makeSeries(y3Label, "Y3",true);
// makeSeries(y4Label, "Y4",true);
// makeSeries(y5Label, "Y5",true);



const yKeys = Object.keys(data[0])
  .filter(key => /^Y\d+$/.test(key))                     // only Y1, Y2, ...
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1))); // sort Y1 < Y2 < Y3...

yKeys.forEach((yKey, index) => {
  if (data[0][yKey] !== undefined) { // check if YN is available
    const label = data[0][`${yKey}_label`] || yKey;
    const isStacked = index !== 0; // first one gets false, rest get true
    makeSeries(label, yKey, isStacked);
  }
});
// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);


}

}
