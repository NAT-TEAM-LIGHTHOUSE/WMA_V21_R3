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
  selector: 'app-process-control-chrt',
  templateUrl: './process-control-chrt.component.html',
  styleUrls: ['./process-control-chrt.component.scss'],
})
export class ProcessControlChrtComponent implements OnInit {

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

let data = [
  { x: 1, value: 14 },
  { x: 2, value: 11 },
  { x: 3, value: 12 },
  { x: 4, value: 14 },
  { x: 5, value: 11 },
  { x: 6, value: 11 },
  { x: 7, value: 12 },
  { x: 8, value: 12 },
  { x: 9, value: 13 },
  { x: 10, value: 15 },
  { x: 11, value: 19 },
  { x: 12, value: 21 },
  { x: 13, value: 22 },
  { x: 14, value: 20 },
  { x: 15, value: 18 },
  { x: 16, value: 14 },
  { x: 17, value: 16 },
  { x: 18, value: 18 },
  { x: 19, value: 17 },
  { x: 20, value: 15 },
  { x: 21, value: 12 },
  { x: 22, value: 8 },
  { x: 23, value: 11 }
];

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX"
  })
);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererX.new(root, {
      minGridDistance: 50
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
    minBulletDistance: 10,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    valueXField: "x",
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: "{valueY}"
    })
  })
);

series.strokes.template.setAll({
  strokeWidth: 3
});

series.data.setAll(data);

series.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(root, {
      radius: 6,
      fill: series.get("fill"),
      stroke: root.interfaceColors.get("background"),
      strokeWidth: 2
    })
  });
});

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis
}));
cursor.lineY.set("visible", false);

// add scrollbar
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000, 100);
chart.appear(1000, 100);

// Function to add process control ranges
function addLimits(lower, upper) {
  // Add range fill
  createRange(lower, upper, undefined, am5.color(0xffce00));
  
  // Add upper/average/lower lines
  createRange(lower, undefined, "Lower control limit", am5.color(0x4d00ff));
  createRange(upper, undefined, "Upper control limit", am5.color(0x4d00ff));
  createRange(lower + (upper - lower) / 2, undefined, "Process average", am5.color(0x4d00ff), true);
  
}

addLimits(10, 20)

function createRange(value, endValue, label, color, dashed?) {
  let rangeDataItem = yAxis.makeDataItem({
    value: value,
    endValue: endValue
  });
  
  let range = yAxis.createAxisRange(rangeDataItem);
  
  if (endValue) {
    range.get("axisFill").setAll({
      fill: color,
      fillOpacity: 0.2,
      visible: true
    });
  }
  else {
    range.get("grid").setAll({
      stroke: color,
      strokeOpacity: 1,
      strokeWidth: 2,
      location: 1
    });
    
    if (dashed) {
      range.get("grid").set("strokeDasharray", [5, 3]);
    }
  }

  if (label) {
    range.get("label").setAll({
      text: label,
      location: 1,
      fontSize: 19,
      inside: true,
      centerX: am5.p0,
      centerY: am5.p100
    });
  }
}
  }
}
