import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CommonModule } from '@angular/common';
@Component({
standalone : true,
imports : [CommonModule],
  selector: 'app-zoomable-value-axis',
  templateUrl: './zoomable-value-axis.component.html',
  styleUrls: ['./zoomable-value-axis.component.scss'],
})
export class ZoomableValueAxisComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;

 constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) { }

 ngOnInit() {
   this.id = "zoomableValueAxis_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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


//   displayChart(){
//     let chart = am4core.create(this.id, am4charts.XYChart);

// // Add data
// chart.data = this.data

// // Create axes
// let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
// dateAxis.renderer.grid.template.location = 0;
// dateAxis.renderer.minGridDistance = 10;

// let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// // Create series
// let series = chart.series.push(new am4charts.LineSeries());
// series.dataFields.valueY = "Y1"
// series.dataFields.dateX = "D1"
// series.strokeWidth = 3;
// series.fillOpacity = 0.5;

// // Add vertical scrollbar
// chart.scrollbarY = new am4core.Scrollbar();
// chart.scrollbarY.marginLeft = 0;


// series.events.on("hit", ($event)=>{
//   alert("Hello World");
//   //console.log($event);
// })
// // Add cursor
// chart.scrollbarX = new am4core.Scrollbar();
// chart.scrollbarY = new am4core.Scrollbar();

// chart.scrollbarX.minHeight = 5;
// chart.scrollbarX.height = 0.2;

// chart.scrollbarY.minWidth = 5;
// chart.scrollbarY.width = 0.2;  

// chart.cursor.behavior = "zoomY";
// chart.cursor.lineX.disabled = true;
//   }
displayChart(){
 let root = am5.Root.new(this.id);

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
 am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(
 am5xy.XYChart.new(root, {
   panX: false,
   panY: false,
   wheelX: "panX",
   wheelY: "zoomY",
   paddingLeft: 0
 })
);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
 behavior: "zoomY"
}));
cursor.lineX.set("visible", false);

// Generate random data
// let date = new Date();
// date.setHours(0, 0, 0, 0);
// let value = 100;

// function generateData() {
//   value = Math.round(Math.random() * 10 - 5 + value);

//   am5.time.add(date, "day", 1);
//   return { date: date.getTime(), value: value };
// }

// function generateDatas(count) {
//   let data = [];
//   for (var i = 0; i < count; ++i) {
//     data.push(generateData());
//   }
//   return data;
// }

function generateData(date:any,valueArr:any) {

 // console.log("date format : "+date);
   let value = valueArr;
   am5.time.add(date, "day", 1);
   return {
     date: date.getTime(),
     value: value
   };
 }
 
 
 
 
 
 // let data = [
 //   {
 //     date: "2021-02-01",
 //     value: 4561
 //   },
 //   {
 //     date: "2021-02-02",
 //     value: 5687
 //   },
 
 
 
 
 function generateDatas(count) {
   let value = 100;
   let data = [];
   for (var i = 0; i < count; ++i) {
     // let dateString = "2021-02-01";
     // console.log("generetes datess : "+JSON.stringify(data1));
     let dateString = finalData[i].date;
     let valueArr=finalData[i].value;
     let dateParts = dateString.split("-");
     let year = parseInt(dateParts[0]);
     let month = parseInt(dateParts[1]) - 1; // Months are zero-based in JavaScript
     let day = parseInt(dateParts[2]);
     
     let date = new Date();
     date.setFullYear(year);
     date.setMonth(month);
     date.setDate(day);
     date.setHours(0, 0, 0, 0);
 
     data.push(generateData(date,valueArr));
   }
   return data;
 }
// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(
 am5xy.DateAxis.new(root, {
   baseInterval: { timeUnit: "day", count: 1 },
   renderer: am5xy.AxisRendererX.new(root, {
     minorGridEnabled: true,
     minGridDistance: 70
   }),
   tooltip: am5.Tooltip.new(root, {})
 })
);

let yAxis = chart.yAxes.push(
 am5xy.ValueAxis.new(root, {
   renderer: am5xy.AxisRendererY.new(root, {})
 })
);

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(
 am5xy.LineSeries.new(root, {
   name: "Series",
   xAxis: xAxis,
   yAxis: yAxis,
   valueYField: "value",
   valueXField: "date",
   tooltip: am5.Tooltip.new(root, {
     labelText: "{valueY}"
   })
 })
);

series.fills.template.setAll({ fillOpacity: 0.3, visible: true });

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
let scrollbar = chart.set("scrollbarY", am5.Scrollbar.new(root, {
 orientation: "vertical"
}));

// let data1:any= [{"Y1":16,"Y1_label":"Y1","D1":"12-08-2021","D1_label":"D1"},
// {"Y1":15,"Y1_label":"Y1","D1":"12-08-2021","D1_label":"D1"},
// {"Y1":2,"Y1_label":"Y1","D1":"18-08-2021","D1_label":"D1"},
// {"Y1":2,"Y1_label":"Y1","D1":"19-08-2021","D1_label":"D1"},
// {"Y1":2,"Y1_label":"Y1","D1":"17-02-2021","D1_label":"D1"},
// {"Y1":3,"Y1_label":"Y1","D1":"11-05-2021","D1_label":"D1"},
// {"Y1":2,"Y1_label":"Y1","D1":"10-05-2021","D1_label":"D1"},
// {"Y1":4,"Y1_label":"Y1","D1":"19-07-2021","D1_label":"D1"},
// {"Y1":6,"Y1_label":"Y1","D1":"05-08-2021","D1_label":"D1"},
// {"Y1":2,"Y1_label":"Y1","D1":"05-08-2021","D1_label":"D1"}];


let finalData:any[]=[];
for(let i=0;i<this.data.length;i++){
 let dateObj={
    date:this.gloabalObject.formatDate(getSuitableDateFormat(this.data[i].D1), "yyyy-MM-dd"),
    value:this.data[i].Y1
 }
 finalData.push(dateObj);
}
console.log("zoomable value axis array Data : "+JSON.stringify(finalData));

// const dateString = "19-03-2024";

function getSuitableDateFormat(dateString){
 const parts = dateString.split("-");
 const day = parseInt(parts[0], 10);
 const month = parseInt(parts[1], 10) - 1;
 const year = parseInt(parts[2], 10);
 const dateObject = new Date(year, month, day);
 return dateObject;
}


// let sampledata=this.gloabalObject.formatDate(getSuitableDateFormat(dateString), "yyyy-MM-dd");
// alert("check datae type : "+typeof(sampledata));

let data:any = generateDatas(finalData.length);

series.data.setAll(data);
series.appear(1000);
chart.appear(1000, 100);
}

}
