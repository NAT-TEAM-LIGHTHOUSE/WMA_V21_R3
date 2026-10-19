import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CommonModule } from '@angular/common';

@Component({
standalone : true,
imports : [CommonModule],
  selector: 'app-simple-column-chart',
  templateUrl: './simple-column-chart.component.html',
  styleUrls: ['./simple-column-chart.component.scss'],
})
export class SimpleColumnChartComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
  }


 ngOnInit() {
   // alert("init");
   this.id = "simpleColumnChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
  //  this.displayChart();
   this.gloabalObject.chartId++;
   setTimeout(() => {
     this.ngZone.runOutsideAngular(() => {
       this.data =  this.frame.chartData; 
     this.displayChart2();
     })
   }, 100);

   
   this.subData.subscribe(data => {
     this.data = data;
     this.displayChart2();
   })
 }


displayChart2(){
 // Create root element
let root = am5.Root.new(this.id);

// Create a custom theme
const myTheme = am5.Theme.new(root);

// Set a rule for minor axis labels
myTheme.rule("AxisLabel", ["minor"]).setAll({
  dy: 1
});

// Set themes
root.setThemes([
  am5themes_Animated.new(root),
  myTheme,
  am5themes_Responsive.new(root)
]);

// Create chart
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  paddingLeft: 0
}));

// Add cursor
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "zoomX"
}));
cursor.lineY.set("visible", false);

// Create X-axis (Category axis for states)
let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "X1",
  renderer: am5xy.AxisRendererX.new(root, {
    minGridDistance: 30
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

// Create Y-axis (Value axis)
let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));

// Add series
let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Series",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "Y1",
  categoryXField: "X1",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueY}"
  })
}));

// Set column series properties
series.columns.template.setAll({ strokeOpacity: 0 })

// Add scrollbar
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

// Set data
series.data.setAll(this.data);

// Set categories after data is set
xAxis.data.setAll(this.data);

// Make stuff animate on load
series.appear(1000);
chart.appear(1000, 100);

// amCharts
}
// displayChart1(){
//   let root = am5.Root.new(this.id);

// const myTheme = am5.Theme.new(root);

// myTheme.rule("AxisLabel", ["minor"]).setAll({
//   dy:1
// });

// // Set themes
// // https://www.amcharts.com/docs/v5/concepts/themes/
// root.setThemes([
//   am5themes_Animated.new(root),
//   myTheme,
//   am5themes_Responsive.new(root)
// ]);


// // Create chart
// // https://www.amcharts.com/docs/v5/charts/xy-chart/
// let chart = root.container.children.push(am5xy.XYChart.new(root, {
//   panX: false,
//   panY: false,
//   wheelX: "panX",
//   wheelY: "zoomX",
//   paddingLeft:0
// }));


// // Add cursor
// // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
// let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
//   behavior: "zoomX"
// }));
// cursor.lineY.set("visible", false);

// let date = new Date();
// date.setHours(0, 0, 0, 0);
// let value = 100;

// // function generateData() {
// //   value = Math.round((Math.random() * 10 - 5) + value);
// //   am5.time.add(date, "day", 1);
// //   return {
// //     date: date.getTime(),
// //     value: value
// //   };
// // }

// // function generateDatas(count) {
// //   let data = [];
// //   for (var i = 0; i < count; ++i) {
// //     data.push(generateData());
// //   }
// //   return data;
// // }


// // Create axes
// // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
// let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
//   maxDeviation: 0,
//   baseInterval: {
//     timeUnit: "day",
//     count: 1
//   },
//   renderer: am5xy.AxisRendererX.new(root, {
//     minorGridEnabled:true,
//     minorLabelsEnabled:true
//   }),
//   tooltip: am5.Tooltip.new(root, {})
// }));

// xAxis.set("minorDateFormats", {
//   "day":"dd",
//   "month":"MM"
// });


// let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
//   renderer: am5xy.AxisRendererY.new(root, {})
// }));


// // Add series
// // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
// let series = chart.series.push(am5xy.ColumnSeries.new(root, {
//   name: "Series",
//   xAxis: xAxis,
//   yAxis: yAxis,
//   valueYField: "Y1",
//   valueXField: "D1",
//   tooltip: am5.Tooltip.new(root, {
//     labelText: "{valueY}"
//   })
// }));

// series.columns.template.setAll({ strokeOpacity: 0 })


// // Add scrollbar
// // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
// chart.set("scrollbarX", am5.Scrollbar.new(root, {
//   orientation: "horizontal"
// }));

// // let data = generateDatas(30);
// this.data;
// series.data.setAll(this.data);


// // Make stuff animate on load
// // https://www.amcharts.com/docs/v5/concepts/animations/
// series.appear(1000);
// chart.appear(1000, 100);


// }
 convertDateToMilliseconds(dateString) {
  const [day, month, year] = dateString.split('-');
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const monthIndex = monthNames.indexOf(month);
  const date = new Date(2000 + parseInt(year), monthIndex, parseInt(day));
  return date.getTime();
}

 displayChart() {
  let root = am5.Root.new(this.id);

  const myTheme = am5.Theme.new(root);

  myTheme.rule("AxisLabel", ["minor"]).setAll({
    dy: 1
  });

  root.setThemes([
    am5themes_Animated.new(root),
    myTheme,
    am5themes_Responsive.new(root)
  ]);

  let chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    paddingLeft: 0
  }));

  let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "zoomX"
  }));
  cursor.lineY.set("visible", false);

  let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
    maxDeviation: 0,
    baseInterval: {
      timeUnit: "day",
      count: 1
    },
    renderer: am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minorLabelsEnabled: true
    }),
    tooltip: am5.Tooltip.new(root, {})
  }));

  xAxis.set("minorDateFormats", {
    "day": "dd",
    "month": "MM"
  });

  let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  }));

  let series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "Y1",
    valueXField: "D1",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}"
    })
  }));

  series.columns.template.setAll({ strokeOpacity: 0 });

  chart.set("scrollbarX", am5.Scrollbar.new(root, {
    orientation: "horizontal"
  }));

  // Convert D1 values to milliseconds
  this.data = this.data.map(item => ({
    ...item,
    D1: this.convertDateToMilliseconds(item.D1)
  }));

  series.data.setAll(this.data);
  series.events.on("click", ($event) => {
    // var dataItem = event.target.dataItem;
    // alert("Hello World");
    console.log($event);
    // console.log("Clicked on category:", dataItem.get(""));
  })
  series.appear(1000);
  chart.appear(1000, 100);
  chart.events.on("click", function (event) {
    // Get the click coordinates relative to the chart
    var point = chart.toLocal(event.point);
  
    // X1 and Y1 values are the local coordinates
    var x1 = point.x;
    var y1 = point.y;
  
    console.log("X1:", x1);
    console.log("Y1:", y1);
  });
}
}