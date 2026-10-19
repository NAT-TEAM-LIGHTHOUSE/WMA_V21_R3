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
  selector: 'app-line-with-different-color-ups-downs',
  templateUrl: './line-with-different-color-ups-downs.component.html',
  styleUrls: ['./line-with-different-color-ups-downs.component.scss'],
})
export class LineWithDifferentColorUpsDownsComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "lineDifferentColorsUpDown_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true,
    paddingLeft: 0
  })
);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "none"
}));
cursor.lineY.set("visible", false);

// Generate random data
let date = new Date();
date.setHours(0, 0, 0, 0);
let value = 100;
let previousValue = value;
let downColor = root.interfaceColors.get("negative");
let upColor = root.interfaceColors.get("positive");
let color;
let previousColor;
let previousDataObj;
// function generateDatas(count) {
//   let value = 100;
//   let data = [];
//   for (var i = 0; i < count; ++i) {
//     // let dateString = "2021-02-01";
//     // console.log("generetes datess : "+JSON.stringify(data1));
//     let dateString = data1[i].date;
//     let valueArr=data1[i].value;
//     let dateParts = dateString.split("-");
//     let year = parseInt(dateParts[0]);
//     let month = parseInt(dateParts[1]) - 1; // Months are zero-based in JavaScript
//     let day = parseInt(dateParts[2]);
    
//     let date = new Date();
//     date.setFullYear(year);
//     date.setMonth(month);
//     date.setDate(day);
//     date.setHours(0, 0, 0, 0);

//     data.push(generateData(date,valueArr));
//   }
//   return data;
// }
function generateData(date,valueArr) {
  value = valueArr;

  am5.time.add(date, "day", 1);

  if (value >= previousValue) {
    color = upColor;
  } else {
    color = downColor;
  }
  previousValue = value;

  let dataObj = { date: date.getTime(), value: value, color: color }; // color will be used for tooltip background

  // only if changed
  if (color != previousColor) {
    if (!previousDataObj) {
      previousDataObj = dataObj;
    }
    previousDataObj.strokeSettings = { stroke: color };
  }

  previousDataObj = dataObj;
  previousColor = color;

  return dataObj;
}
function generateDatas(count) {
  // let value = 100;
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
// function generateDatas(count) {
//   let data = [];
//   for (var i = 0; i < count; ++i) {
//     data.push(generateData(date,valueArr));
//   }
//   return data;
// }

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
    valueXField: "date"
  })
);

series.strokes.template.set("templateField", "strokeSettings");

let tooltip:any = series.set("tooltip", am5.Tooltip.new(root, {
  labelText: "{valueY}"
}));

// this is added in ored adapter to be triggered each time position changes
tooltip.on("pointTo", function () {
  let background = tooltip.get("background");
  background.set("fill", background.get("fill"));
});

// tooltip bacground takes color from data item
tooltip.get("background").adapters.add("fill", function (fill) {
  if (tooltip.dataItem) {
    return tooltip.dataItem.dataContext.color;
  }
  return fill;
});

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
let scrollbar = chart.set(
  "scrollbarX",
  am5xy.XYChartScrollbar.new(root, {
    orientation: "horizontal",
    height: 60
  })
);

let sbDateAxis = scrollbar.chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    baseInterval: {
      timeUnit: "day",
      count: 1
    },
    renderer: am5xy.AxisRendererX.new(root, {})
  })
);

let sbValueAxis = scrollbar.chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);

let sbSeries = scrollbar.chart.series.push(
  am5xy.LineSeries.new(root, {
    valueYField: "value",
    valueXField: "date",
    xAxis: sbDateAxis,
    yAxis: sbValueAxis
  })
);


// let data1:any = [
//   {
//     date: "2021-01-01",
//     value: 4561
//   },
//   {
//     date: "2021-02-02",
//     value: 5687
//   },
//   {
//     date: "2021-02-03",
//     value: 6348
//   },
//   {
//     date: "2021-02-04",
//     value: 4878
//   },
//   {
//     date: "2021-02-05",
//     value: 9867
//   },
//   {
//     date: "2021-02-06",
//     value: 7561
//   },
//   {
//     date: "2021-02-07",
//     value: 1287
//   },
//   {
//     date: "2021-02-12",
//     value: 9560
//   },
//   {
//     date: "2021-02-13",
//     value: 11687
//   },
//   {
//     date: "2021-02-14",
//     value: 5878
//   },
//   {
//     date: "2021-02-15",
//     value: 9789
//   },
//   {
//     date: "2021-02-16",
//     value: 3987
//   },
//   {
//     date: "2021-02-17",
//     value: 5898
//   },
//   {
//     date: "2021-02-18",
//     value: 9878
//   },
//   {
//     date: "2021-02-19",
//     value: 13687
//   },
//   {
//     date: "2021-02-20",
//     value: 6789
//   },
//   {
//     date: "2021-02-21",
//     value: 4531
//   },
//   {
//     date: "2021-02-22",
//     value: 5856
//   },
//   {
//     date: "2021-01-23",
//     value: 5737
//   },
//   {
//     date: "2021-01-24",
//     value: 9987
//   },
//   {
//     date: "2021-01-25",
//     value: 16457
//   },
//   {
//     date: "2021-01-26",
//     value: 7878
//   },
//   {
//     date: "2021-01-27",
//     value: 6845
//   },
//   {
//     date: "2021-01-28",
//     value: 4659
//   },
//   {
//     date: "2021-01-29",
//     value: 7892
//   },
//   {
//     date: "2021-01-30",
//     value: 7362
//   },
//   {
//     date: "2021-01-31",
//     value: 3268
//   }
// ];
let data1:any=[];
for(let i=0;i<this.data.length;i++){
  let dateObj={
     date:this.gloabalObject.formatDate(getSuitableDateFormat(this.data[i].D1), "yyyy-MM-dd"),
     value:this.data[i].Y1
  }
  data1.push(dateObj);
}
// data=data2;
console.log(" line different up and down chart data      : "+JSON.stringify(data1));
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
// let data = generateDatas(100);
series.data.setAll(data);
sbSeries.data.setAll(data);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);
}


}
