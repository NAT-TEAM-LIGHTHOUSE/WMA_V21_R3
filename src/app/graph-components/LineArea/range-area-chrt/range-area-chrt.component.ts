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
  selector: 'app-range-area-chrt',
  templateUrl: './range-area-chrt.component.html',
  styleUrls: ['./range-area-chrt.component.scss'],
})
export class RangeAreaChrtComponent implements OnInit {

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
root.setThemes([am5themes_Animated.new(root)]);

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
let value0 = 100;
let value1 = 150;

function generateData() {
  value0 = Math.round(Math.random() * 10 - 5 + value0);
  value1 = Math.round(Math.random() * 10 - 5 + value1);

  if (value0 < 10) {
    value0 = 10;
  }

  if (value1 <= value0) {
    value1 = value0 + 10;
  }

  if (value1 < 10) {
    value1 = 10;
  }

  am5.time.add(date, "day", 1);
  return { date: date.getTime(), value0: value0, value1: value1 };
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
let xAxis = chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    maxDeviation: 0.5,
    baseInterval: { timeUnit: "day", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {
      pan: "zoom",
      minorGridEnabled: true
    }),
    tooltip: am5.Tooltip.new(root, {})
  })
);

let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 1,
    renderer: am5xy.AxisRendererY.new(root, { pan: "zoom" })
  })
);

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series0 = chart.series.push(
  am5xy.LineSeries.new(root, {
    name: "Series",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value0",
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}",
      pointerOrientation: "horizontal"
    })
  })
);

let series1 = chart.series.push(
  am5xy.LineSeries.new(root, {
    name: "Series",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value1",
    openValueYField: "value0",
    valueXField: "date",
    stroke: series0.get("stroke"),
    fill: series0.get("stroke"),
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}",
      pointerOrientation: "horizontal"
    })
  })
);

series1.fills.template.setAll({
  fillOpacity: 0.3,
  visible: true
});

series0.strokes.template.set("strokeWidth", 2);
series1.strokes.template.set("strokeWidth", 2);

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

let data = generateDatas(200);
series0.data.setAll(data);
series1.data.setAll(data);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series0.appear(1000);
series1.appear(1000);
chart.appear(1000, 100);
  }
}
