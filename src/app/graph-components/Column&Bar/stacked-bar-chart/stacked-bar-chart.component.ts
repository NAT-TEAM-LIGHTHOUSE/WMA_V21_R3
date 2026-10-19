import { CommonModule } from '@angular/common';
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
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss'],
  standalone: true,
  imports :[CommonModule]
})
export class StackedBarChartComponent  implements OnInit {

 @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
  }


 ngOnInit() {
   // alert("init");
      // this.displayChart();
   this.id = "stackedBarChart1_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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


let myTheme = am5.Theme.new(root);

myTheme.rule("Grid", ["base"]).setAll({
  strokeOpacity: 0.1
});


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root),
  myTheme
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "panY",
  wheelY: "zoomY",
  paddingLeft: 0,
  layout: root.verticalLayout
}));

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarY", am5.Scrollbar.new(root, {
  orientation: "vertical"
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
let data = this .data;

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let yRenderer = am5xy.AxisRendererY.new(root, {});
let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "X1",
  renderer: yRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

yRenderer.grid.template.setAll({
  location: 1
})

yAxis.data.setAll(data);

let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  maxPrecision: 0,
  renderer: am5xy.AxisRendererX.new(root, {
    minGridDistance: 40,
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
    baseAxis: yAxis,
    valueXField: fieldName,
    categoryYField: "X1"
  }));

  series.columns.template.setAll({
    tooltipText: "{name}, {categoryY}: {valueX}",
    tooltipY: am5.percent(90)
  });
  series.data.setAll(data);

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear();

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      sprite: am5.Label.new(root, {
        text: "{valueX}",
        fill: root.interfaceColors.get("alternativeText"),
        centerY: am5.p50,
        centerX: am5.p50,
        populateText: true
      })
    });
  });

  legend.data.push(series);
}
// let xField = "X1";
// let xLabel = data[0]?.[`${xField}_label`] || xField;
// let y1Field = "Y1";
// let y2Field = "Y2";
// let y3Field = "Y2";
// let y4Field = "Y2";
// let y5Field = "Y2";
// let y6Field = "Y2";

// let y1Label = data[0]?.[`${y1Field}_label`] || y1Field;
// let y2Label = data[0]?.[`${y2Field}_label`] || y2Field;
// let y3Label = data[0]?.[`${y3Field}_label`] || y3Field;
// let y4Label = data[0]?.[`${y4Field}_label`] || y4Field;
// let y5Label = data[0]?.[`${y5Field}_label`] || y5Field;
// let y6Label = data[0]?.[`${y6Field}_label`] || y6Field;


const yKeys = Object.keys(data[0])
  .filter(key => /^Y\d+$/.test(key))                     
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

yKeys.forEach((yKey, index) => {
  if (data[0][yKey] !== undefined) { 
    const label = data[0][`${yKey}_label`] || yKey;
    makeSeries(label, yKey);
  }
});






chart.appear(1000, 100);


}


// displayChart() {
//   let root = am5.Root.new("chartdivnew");
//   let myTheme = am5.Theme.new(root);

// myTheme.rule("Grid", ["base"]).setAll({
//   strokeOpacity: 0.1
// });


// // Set themes
// // https://www.amcharts.com/docs/v5/concepts/themes/
// root.setThemes([
//   am5themes_Animated.new(root),
//   myTheme
// ]);


// // Create chart
// // https://www.amcharts.com/docs/v5/charts/xy-chart/
// let chart = root.container.children.push(am5xy.XYChart.new(root, {
//   panX: false,
//   panY: false,
//   wheelX: "panY",
//   wheelY: "zoomY",
//   paddingLeft: 0,
//   layout: root.verticalLayout
// }));

// // Add scrollbar
// // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
// chart.set("scrollbarY", am5.Scrollbar.new(root, {
//   orientation: "vertical"
// }));

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


// // Create axes
// // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
// let yRenderer = am5xy.AxisRendererY.new(root, {});
// let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
//   categoryField: "year",
//   renderer: yRenderer,
//   tooltip: am5.Tooltip.new(root, {})
// }));

// yRenderer.grid.template.setAll({
//   location: 1
// })

// yAxis.data.setAll(data);

// let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
//   min: 0,
//   maxPrecision: 0,
//   renderer: am5xy.AxisRendererX.new(root, {
//     minGridDistance: 40,
//     strokeOpacity: 0.1
//   })
// }));

// // Add legend
// // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
// let legend = chart.children.push(am5.Legend.new(root, {
//   centerX: am5.p50,
//   x: am5.p50
// }));


// // Add series
// // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
// function makeSeries(name, fieldName) {
//   let series = chart.series.push(am5xy.ColumnSeries.new(root, {
//     name: name,
//     stacked: true,
//     xAxis: xAxis,
//     yAxis: yAxis,
//     baseAxis: yAxis,
//     valueXField: fieldName,
//     categoryYField: "year"
//   }));

//   series.columns.template.setAll({
//     tooltipText: "{name}, {categoryY}: {valueX}",
//     tooltipY: am5.percent(90)
//   });
//   series.data.setAll(data);

//   // Make stuff animate on load
//   // https://www.amcharts.com/docs/v5/concepts/animations/
//   series.appear();

//   series.bullets.push(function () {
//     return am5.Bullet.new(root, {
//       sprite: am5.Label.new(root, {
//         text: "{valueX}",
//         fill: root.interfaceColors.get("alternativeText"),
//         centerY: am5.p50,
//         centerX: am5.p50,
//         populateText: true
//       })
//     });
//   });

//   legend.data.push(series);
// }

// makeSeries("Europe", "europe");
// makeSeries("North America", "namerica");
// makeSeries("Asia", "asia");
// makeSeries("Latin America", "lamerica");
// makeSeries("Middle East", "meast");
// makeSeries("Africa", "africa");


// // Make stuff animate on load
// // https://www.amcharts.com/docs/v5/concepts/animations/
// chart.appear(1000, 100);
// }

}
