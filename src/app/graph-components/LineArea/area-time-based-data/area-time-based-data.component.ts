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
  selector: 'app-area-time-based-data',
  templateUrl: './area-time-based-data.component.html',
  styleUrls: ['./area-time-based-data.component.scss'],
})
export class AreaTimeBasedDataComponent implements OnInit {

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

root.setThemes([
  am5themes_Animated.new(root)
]);

let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: true,
  wheelY: "zoomX",
  layout: root.verticalLayout,
  pinchZoomX: true
}));

// Create Y-axis
let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 1,
  renderer: am5xy.AxisRendererY.new(root, {
    pan: "zoom"
  })
}));

// Create X-Axis
let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  groupData: true,
  maxDeviation: 0.5,
  baseInterval: { timeUnit: "minute", count: 1 },
  renderer: am5xy.AxisRendererX.new(root, {
    minGridDistance: 60,
    pan: "zoom",
    minorGridEnabled: true
  })
}));

// xAxis.get("dateFormats")["day"] = "MM/dd";
// xAxis.get("periodChangeDateFormats")["day"] = "MMMM";

// Generate random data
function generateChartData() {
  let chartData = [];
  // current date
  let firstDate = new Date();
  // now set 500 minutes back
  firstDate.setMinutes(firstDate.getDate() - 500, 0, 0);

  // and generate 500 data items
  let visits = 500;
  for (var i = 0; i < 500; i++) {
    let newDate = new Date(firstDate);
    // each time we add one minute
    newDate.setMinutes(newDate.getMinutes() + i);
    // some random number
    visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    // add data item to the array
    chartData.push({
      date: newDate.getTime(),
      visits: visits
    });
  }
  return chartData;
}
let data = generateChartData();

// Create series
let series:any = chart.series.push(am5xy.LineSeries.new(root, {
  name: "Series",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "visits",
  valueXField: "date",
  tooltip: am5.Tooltip.new(root, {
    pointerOrientation: "horizontal",
    labelText: "[bold]{name}[/]\n{valueX.formatDate()}: {valueY}"
  })
}));

series.strokes.template.set("strokeWidth", 2);
series.fills.template.setAll({
  visible: true,
  fillOpacity: 0.4
});

series.data.setAll(data);

// Pre-zoom X axis to last hour
series.events.once("datavalidated", function (ev, target) {
  let lastDate = new Date(data[data.length - 1].date);
  let firstDate = new Date(lastDate.getTime() - 3600000);
  xAxis.zoomToDates(firstDate, lastDate);
})

// Add cursor
chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "none",
  xAxis: xAxis
}));

xAxis.set("tooltip", am5.Tooltip.new(root, {}));

yAxis.set("tooltip", am5.Tooltip.new(root, {}));


let scrollbarX = am5xy.XYChartScrollbar.new(root, {
  orientation: "horizontal",
  height: 50
});

chart.set("scrollbarX", scrollbarX);

let sbxAxis = scrollbarX.chart.xAxes.push(am5xy.DateAxis.new(root, {
  baseInterval: { timeUnit: "minute", count: 1 },
  renderer: am5xy.AxisRendererX.new(root, {
    opposite: false,
    strokeOpacity: 0,
    minorGridEnabled: true,
    minGridDistance: 60
  })
}));

let sbyAxis = scrollbarX.chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));

let sbseries = scrollbarX.chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: sbxAxis,
  yAxis: sbyAxis,
  valueYField: "visits",
  valueXField: "date"
}));
sbseries.data.setAll(data);
  }
}
