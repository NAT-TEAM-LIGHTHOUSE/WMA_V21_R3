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
  selector: 'app-selecting-and-marking-multiple-ranges',
  templateUrl: './selecting-and-marking-multiple-ranges.component.html',
  styleUrls: ['./selecting-and-marking-multiple-ranges.component.scss'],
})
export class SelectingAndMarkingMultipleRangesComponent implements OnInit {

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
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  pinchZoomX: true,
  paddingLeft: 0
}));


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "selectX"
}));
cursor.lineY.set("visible", false);

let selectStatedX;

cursor.events.on("selectstarted", function () {
  selectStatedX = cursor.getPrivate("positionX");
})

cursor.events.on("selectended", function () {

  let selectEndedX = cursor.getPrivate("positionX");

  let startValue = xAxis.positionToValue(xAxis.toAxisPosition(selectStatedX));
  let endValue = xAxis.positionToValue(xAxis.toAxisPosition(selectEndedX));

  // flip if start > end
  if (startValue > endValue) {
    [startValue, endValue] = [endValue, startValue];
  }

  let skip = false;
  // check for overlapping
  let len = xAxis.axisRanges.length;
  for (var i = len - 1; i >= 0; i--) {
    let axisRange = xAxis.axisRanges.getIndex(i);
    let axisRangeStartValue = axisRange.get("value");
    let axisRangeEndValue = axisRange.get("endValue");
    // flip if start > end
    if (axisRangeStartValue > axisRangeEndValue) {
      [axisRangeStartValue, axisRangeEndValue] = [axisRangeEndValue, axisRangeStartValue];
    }

    // if both end and start values are within old range, do not do anything
    if (startValue >= axisRangeStartValue && startValue <= axisRangeEndValue && endValue >= axisRangeStartValue && endValue <= axisRangeEndValue) {
      skip = true
    }
    else {
      if (startValue >= axisRangeStartValue && startValue <= axisRangeEndValue) {
        startValue = axisRangeEndValue;
      }

      if (endValue >= axisRangeStartValue && endValue <= axisRangeEndValue) {
        endValue = axisRangeStartValue;
      }
    }

    // if a new range takes within itself whole old range, remove old range
    if (startValue <= axisRangeStartValue && endValue >= axisRangeEndValue) {
      xAxis.axisRanges.removeValue(axisRange);
    }
  }

  if (!skip) {
    let dataItem = xAxis.makeDataItem({});
    dataItem.set("value", startValue);
    dataItem.set("endValue", endValue);

    xAxis.createAxisRange(dataItem);
    dataItem.get("axisFill").setAll({ fill: chart.get("colors").getIndex(7), fillOpacity: 0.4, visible: true });
    dataItem.get("grid").set("forceHidden", true);
  }

  cursor.selection.hide();
})


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
  maxDeviation: 0.2,
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minGridDistance: 80,
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
  }
}
