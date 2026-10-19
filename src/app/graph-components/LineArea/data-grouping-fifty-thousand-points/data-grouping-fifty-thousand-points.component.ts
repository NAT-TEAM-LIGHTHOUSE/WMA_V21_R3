import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular/standalone';
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
  selector: 'app-data-grouping-fifty-thousand-points',
  templateUrl: './data-grouping-fifty-thousand-points.component.html',
  styleUrls: ['./data-grouping-fifty-thousand-points.component.scss'],
})
export class DataGroupingFiftyThousandPointsComponent implements OnInit {

  
  id:any;
  @Input() data: any;
   @Input() frame: any;
   doubleLineFlag = false
   @Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService,public platform: Platform,private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "dataGrouping_"+ this.frame.apps_page_frame_seqid;
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
  paddingLeft: 0
}));


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "zoomX"
}));
cursor.lineY.set("visible", false);


// Generate random data
// let date = new Date();
// date.setFullYear(1900);
// date.setHours(0, 0, 0, 0);
let value = 100;

function generateData(date:any,valueArr:any) {

// console.log("date format : "+date);
  value = valueArr;
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
  groupData: true,
  maxDeviation: 0,
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
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
let scrollbar = am5xy.XYChartScrollbar.new(root, {
  orientation: "horizontal",
  height: 50
});
chart.set("scrollbarX", scrollbar);

let sbxAxis = scrollbar.chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    groupData: true,
    groupIntervals: [{ timeUnit: "month", count: 1 }],
    baseInterval: { timeUnit: "day", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      opposite: false,
      strokeOpacity: 0
    })
  })
);

let sbyAxis = scrollbar.chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);

let sbseries = scrollbar.chart.series.push(
  am5xy.LineSeries.new(root, {
    xAxis: sbxAxis,
    yAxis: sbyAxis,
    valueYField: "value",
    valueXField: "date"
  })
);



let data1:any[]=[];
for(let i=0;i<this.data.length;i++){
  let dateObj={
     date:this.gloabalObject.formatDate(getSuitableDateFormat(this.data[i].D1), "yyyy-MM-dd"),
     value:this.data[i].Y1
  }
  data1.push(dateObj);
}
console.log("fifty k points : "+JSON.stringify(data1));
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


console.log("data grouping 50k points : "+JSON.stringify(data));
series.data.setAll(data);
sbseries.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);
}
}
