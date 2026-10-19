import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';

import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-line-graph-chart',
  templateUrl: './line-graph-chart.component.html',
  styleUrls: ['./line-graph-chart.component.scss'],
})
export class LineGraphChartComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService , private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "lineGraph_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
  




  displayChart(){
    let root = am5.Root.new(this.id);
console.log("Lighthouse Line GRaph"+ JSON.stringify(this.data));

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
  pinchZoomX:true,
  paddingLeft: 0
}));


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "none"
}));
cursor.lineY.set("visible", false);


// Generate random data
// let date = new Date();
// date.setHours(0, 0, 0, 0);
// let value = 100;

// function generateData() {
//   value = Math.round((Math.random() * 10 - 5) + value);
//   am5.time.add(date, "day", 1);
//   return {
//     date: date.getTime(),
//     value: value
//   };
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
  

  
  function generateDatas(count) {
    let value = 100;
    let data = [];
    for (var i = 0; i < count; ++i) {
      // let dateString = "2021-02-01";
      // console.log("generetes datess : "+JSON.stringify(data1));
      let dateString = data1[i].date;
      let valueArr=data1[i].value;
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
let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  maxDeviation: 0.2,
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled:true
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {
    pan:"zoom"
  })  
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.LineSeries.new(root, {
  name: "Series",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  valueXField: "date",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueY}"
  })
}));


// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));




let data1:any[]=[];
for(let i=0;i<this.data.length;i++){
  let dateObj={
     date:this.gloabalObject.formatDate(getSuitableDateFormat(this.data[i].D1), "yyyy-MM-dd"),
     value:this.data[i].Y1
  }
  data1.push(dateObj);
}
// data=data2;
console.log(" line graph points : "+JSON.stringify(data1));
function getSuitableDateFormat(dateString){
  const parts = dateString.split("-");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const dateObject = new Date(year, month, day);
  return dateObject;
}
// let data = generateDatas(50000);

// alert("data length : "+data1.length);
let data:any = generateDatas(data1.length);
// let data = generateDatas(1200);
series.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);
  }
}
