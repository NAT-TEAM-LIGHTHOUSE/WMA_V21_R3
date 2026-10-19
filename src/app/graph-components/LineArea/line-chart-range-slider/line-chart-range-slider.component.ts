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
  selector: 'app-line-chart-range-slider',
  templateUrl: './line-chart-range-slider.component.html',
  styleUrls: ['./line-chart-range-slider.component.scss'],
})
export class LineChartRangeSliderComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "lineChartRangeSlider_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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

  root.setThemes([
  am5themes_Animated.new(root)
]);


let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: true,
  wheelX: "panX",
  wheelY: "zoomX",
  pinchZoomX:true,
  paddingLeft: 0
}));

let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineX.set("forceHidden", true);
cursor.lineY.set("forceHidden", true);

// Generate random data
let date = new Date();
date.setHours(0, 0, 0, 0);
let value = 100;

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
    value = valueArr;
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
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true,
    minGridDistance: 80
  })
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

series.fills.template.setAll({
  fillOpacity: 0.2,
  visible: true
});


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
console.log("line chart range slider : "+JSON.stringify(data1));
function getSuitableDateFormat(dateString){
  const parts = dateString.split("-");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const dateObject = new Date(year, month, day);
  return dateObject;
}

// alert("data length : "+data1.length);
let data:any = generateDatas(data1.length);
// Set data
// let data = generateDatas(1200);
series.data.setAll(data);


let rangeDate = new Date();
am5.time.add(rangeDate, "day", Math.round(series.dataItems.length / 2));
let rangeTime = rangeDate.getTime();

// add series range
let seriesRangeDataItem = xAxis.makeDataItem({});
let seriesRange = series.createAxisRange(seriesRangeDataItem);
seriesRange.fills.template.setAll({
  visible: true,
  opacity: 0.3
});

seriesRange.fills.template.set("fillPattern", am5.LinePattern.new(root, {
  color: am5.color(0xff0000),
  rotation: 45,
  strokeWidth: 2,
  width: 2000,
  height: 2000,
  fill:am5.color(0xffffff)
}));

seriesRange.strokes.template.set("stroke", am5.color(0xff0000));

xAxis.onPrivate("max", function (value) {
  seriesRangeDataItem.set("endValue", value);
  seriesRangeDataItem.set("value", rangeTime);
});

// add axis range
let range = xAxis.createAxisRange(xAxis.makeDataItem({}));
let color = root.interfaceColors.get("primaryButton");

range.set("value", rangeDate.getTime());
range.get("grid").setAll({
  strokeOpacity: 1,
  stroke: color
});

let resizeButton = am5.Button.new(root, {
  themeTags: ["resize", "horizontal"],
  icon: am5.Graphics.new(root, {
    themeTags: ["icon"]
  })
});

// restrict from being dragged vertically
resizeButton.adapters.add("y", function () {
  return 0;
});

// restrict from being dragged outside of plot
resizeButton.adapters.add("x", function (x:any) {
  return Math.max(0, Math.min(chart.plotContainer.width(), x));
});

// change range when x changes
resizeButton.events.on("dragged", function () {
  let x = resizeButton.x();
  let position = xAxis.toAxisPosition(x / chart.plotContainer.width());

  let value = xAxis.positionToValue(position);

  range.set("value", value);

  seriesRangeDataItem.set("value", value);
  seriesRangeDataItem.set("endValue", xAxis.getPrivate("max"));
});

// set bullet for the range
range.set("bullet", am5xy.AxisBullet.new(root, {
  sprite: resizeButton
}));
// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);
}
}
