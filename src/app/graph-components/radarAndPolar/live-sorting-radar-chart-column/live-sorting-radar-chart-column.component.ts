
import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5 from "@amcharts/amcharts5";
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);


@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-live-sorting-radar-chart-column',
  templateUrl: './live-sorting-radar-chart-column.component.html',
  styleUrls: ['./live-sorting-radar-chart-column.component.scss'],
})
export class LiveSortingRadarChartColumnComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id=""
  @Input() subData: Subject<any>;


 constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController,  private ngZone:NgZone) { }

 ngOnInit() {
   this.id = "liveSortingRadarChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
   this.gloabalObject.chartId++;
   setTimeout(() => {
     this.ngZone.runOutsideAngular(() => {
       this.data =  this.frame.chartData; 
     this.displayChart()
     })
   }, 100);

   this.subData.subscribe(data => {
     this.data = data;
     this.displayChart();
   })

 }




     async closeModal() {
       await this.PopoverController.dismiss();
     }


displayChart(){
 // this.setData();
 /* Chart code */
// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
let root = am5.Root.new(this.id);


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
 am5themes_Animated.new(root)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(am5radar.RadarChart.new(root, {
 panX: true,
 panY: true,
 wheelX: "none",
 wheelY: "none",
 innerRadius:am5.percent(40)
}));

// We don't want zoom-out button to appear while animating, so we hide it
chart.zoomOutButton.set("forceHidden", true);


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5radar.AxisRendererCircular.new(root, {
 minGridDistance: 30
});

xRenderer.grid.template.set("visible", false);

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
 maxDeviation: 0.3,
 categoryField: "X1",
 renderer: xRenderer
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
 maxDeviation: 0.3,
 min: 0,
 renderer: am5radar.AxisRendererRadial.new(root, {})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
 name: "Series 1",
 xAxis: xAxis,
 yAxis: yAxis,
 valueYField: "Y1",
 categoryXField: "X1"
}));

// Rounded corners for columns
series.columns.template.setAll({
 cornerRadius: 5,
 tooltipText:"{categoryX}: {valueY}"
});

// Make each column to be of a different color
series.columns.template.adapters.add("fill", function (fill, target) {
 return chart.get("colors").getIndex(series.columns.indexOf(target ));
});

series.columns.template.adapters.add("stroke", function (stroke, target) {
 return chart.get("colors").getIndex(series.columns.indexOf(target ));
});


let data=this.data;
xAxis.data.setAll(data);
series.data.setAll(data);

// update data with random values each 1.5 sec
setInterval(function () {
 updateData();
}, 1500)

function updateData() {
 am5.array.each(series.dataItems, function (dataItem) {
   let value = dataItem.get("valueY") + Math.round(Math.random() * 400 - 200);
   if (value < 0) {
     value = 10;
   }
   // both valueY and workingValueY should be changed, we only animate workingValueY
   dataItem.set("valueY", value);
   dataItem.animate({
     key: "valueYWorking",
     to: value,
     duration: 600,
     easing: am5.ease.out(am5.ease.cubic)
   });
 })

 sortCategoryAxis();
}


// Get series item by category
function getSeriesItem(category) {
 for (var i = 0; i < series.dataItems.length; i++) {
   let dataItem = series.dataItems[i];
   if (dataItem.get("categoryX") == category) {
     return dataItem;
   }
 }
}


// Axis sorting
function sortCategoryAxis() {

 // Sort by value
 series.dataItems.sort(function (x, y) {
   return y.get("valueY") - x.get("valueY"); // descending
   //return y.get("valueY") - x.get("valueY"); // ascending
 })

 // Go through each axis item
 am5.array.each(xAxis.dataItems, function (dataItem) {
   // get corresponding series item
   let seriesDataItem = getSeriesItem(dataItem.get("category"));

   if (seriesDataItem) {
     // get index of series data item
     let index = series.dataItems.indexOf(seriesDataItem);
     // calculate delta position
     let deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
     // set index to be the same as series data item index
     dataItem.set("index", index);
     // set deltaPosition instanlty
     dataItem.set("deltaPosition", -deltaPosition);
     // animate delta position to 0
     dataItem.animate({
       key: "deltaPosition",
       to: 0,
       duration: 1000,
       easing: am5.ease.out(am5.ease.cubic)
     })
   }
 });

 // Sort axis items by index.
 // This changes the order instantly, but as deltaPosition is set,
 // they keep in the same places and then animate to true positions.
 xAxis.dataItems.sort(function (x, y) {
   return x.get("index") - y.get("index");
 });
}


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);
}


   }
