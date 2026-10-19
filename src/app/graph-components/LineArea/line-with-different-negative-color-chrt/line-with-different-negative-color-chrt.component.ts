import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CommonModule } from '@angular/common';
@Component({
standalone : true,
imports : [CommonModule],
  selector: 'app-line-with-different-negative-color-chrt',
  templateUrl: './line-with-different-negative-color-chrt.component.html',
  styleUrls: ['./line-with-different-negative-color-chrt.component.scss'],
})
export class LineWithDifferentNegativeColorChrtComponent implements OnInit {

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

root.setThemes([am5themes_Animated.new(root)]);

let chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    wheelY: "zoomX"
  })
);

// Define data
let data = generatechartData();
function generatechartData() {
  let chartData = [];
  let firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 150);
  let visits = -40;
  let b = 0.6;
  for (var i = 0; i < 150; i++) {
    let newDate = new Date(firstDate);
    newDate.setHours(0, 0, 0);
    newDate.setDate(newDate.getDate() + i);
    if (i > 80) {
      b = 0.4;
    }
    visits += Math.round((Math.random() < b ? 1 : -1) * Math.random() * 10);

    chartData.push({
      date: newDate.getTime(),
      visits: visits
    });
  }
  return chartData;
}

// Create Y-axis
let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    extraTooltipPrecision: 1,
    renderer: am5xy.AxisRendererY.new(root, {
      minGridDistance: 30
    })
  })
);

// Create X-Axis
let xAxis = chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    baseInterval: { timeUnit: "day", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      cellStartLocation: 0.2,
      cellEndLocation: 0.8
    })
  })
);

// Create series
let series = chart.series.push(
  am5xy.SmoothedXLineSeries.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "visits",
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, {
      labelText:"{valueX.formatDate()}: {valueY}",
      pointerOrientation:"horizontal"
    })
  })
);

series.strokes.template.setAll({
  strokeWidth: 3
});

series.fills.template.setAll({
  fillOpacity: 0.5,
  visible: true
});


series.data.setAll(data);

// Create axis ranges

let rangeDataItem = yAxis.makeDataItem({
  value: -1000,
  endValue: 0
});

let range = series.createAxisRange(rangeDataItem);

range.strokes.template.setAll({
  stroke: am5.color(0xff621f),
  strokeWidth: 3
});

range.fills.template.setAll({
  fill: am5.color(0xff621f),
  fillOpacity: 0.5,
  visible: true
});


// Add cursor
chart.set(
  "cursor",
  am5xy.XYCursor.new(root, {
    behavior: "zoomX",
    xAxis: xAxis
  })
);

xAxis.set(
  "tooltip",
  am5.Tooltip.new(root, {
    themeTags: ["axis"]
  })
);

yAxis.set(
  "tooltip",
  am5.Tooltip.new(root, {
    themeTags: ["axis"]
  })
);
  }
}
