import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
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
  selector: 'app-drawing-chart-series-mouse-or-touch',
  templateUrl: './drawing-chart-series-mouse-or-touch.component.html',
  styleUrls: ['./drawing-chart-series-mouse-or-touch.component.scss'],
})
export class DrawingChartSeriesMouseOrTouchComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="chartdiv";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    // alert("init");
    // this.id = "compassChart"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
    let root = am5.Root.new("chartdiv");


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
  pinchZoomX: true,
  paddingLeft: 0
}));

chart.get("colors").set("step", 3);


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);


// Generate random data
let date = new Date();
date.setHours(0, 0, 0, 0);
let value = 100;

function generateData() {
  value = Math.round((Math.random() * 10 - 5) + value);
  am5.time.add(date, "day", 1);
  return {
    date: date.getTime(),
    value: value
  };
}

function generateDatas(count) {
  let data = [];
  for (var i = 0; i < count; ++i) {
    data.push(generateData());
  }
  return data;
}


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  maxDeviation: 0.3,
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true,
    minGridDistance: 70
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  renderer: am5xy.AxisRendererY.new(root, {})
}));


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

let drawingSeries = chart.series.push(am5xy.LineSeries.new(root, {
  name: "Series",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  valueXField: "date"
}));

// Invisible bullet which will be dragged (to avoid some conflicting between
// drag position and bullet position which results flicker)
drawingSeries.bullets.push(function () {
  let bulletCircle = am5.Circle.new(root, {
    radius: 6,
    fillOpacity: 0,
    fill: drawingSeries.get("fill"),
    draggable: true,
    cursorOverStyle: "pointer"
  });
  bulletCircle.events.on("dragged", function (e) {
    handleDrag(e);
  })
  return am5.Bullet.new(root, {
    sprite: bulletCircle
  })
})

// Actual bullet
drawingSeries.bullets.push(function () {
  let bulletCircle = am5.Circle.new(root, {
    radius: 5,
    fill: drawingSeries.get("fill")
  });
  return am5.Bullet.new(root, {
    sprite: bulletCircle
  })
})

// Drag handler
function handleDrag(e) {
  let point = chart.plotContainer.toLocal(e.point);
  let date = xAxis.positionToValue(xAxis.coordinateToPosition(point.x));
  let value = yAxis.positionToValue(yAxis.coordinateToPosition(point.y));

  let dataItem = e.target.dataItem;
  dataItem.set("valueX", date);
  dataItem.set("valueXWorking", date);
  dataItem.set("valueY", value);
  dataItem.set("valueYWorking", value);
}


// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));


// Set data
let data = generateDatas(1200);
series.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);

// Interactivity
chart.plotContainer.get("background").events.on("click", function (e) {
  let point = chart.plotContainer.toLocal(e.point);
  let date = xAxis.positionToValue(xAxis.coordinateToPosition(point.x));
  let value = yAxis.positionToValue(yAxis.coordinateToPosition(point.y));
  drawingSeries.data.push({
    date: date,
    value: value
  });

  drawingSeries.setPrivate("endIndex", drawingSeries.data.length);
  sortData();
})


// Sort data so that if clicked between existing data items, the item would
// be added between
function sortData() {
  drawingSeries.dataItems.sort(function (a, b) {
    let atime = a.get("valueX");
    let btime = b.get("valueX");

    if (atime < btime) {
      return -1;
    } else if (atime == btime) {
      return 0;
    } else {
      return 1;
    }
  })
}

// Explanatory labels
chart.plotContainer.children.push(am5.Label.new(root, {
  x: 10,
  y: 10,
  text: "Click on plot area to draw a series"
}));
  }
}
