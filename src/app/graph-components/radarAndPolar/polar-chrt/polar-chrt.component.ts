import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { PopoverController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"

@Component({
standalone : true,
imports : [],
  selector: 'app-polar-chrt',
  templateUrl: './polar-chrt.component.html',
  styleUrls: ['./polar-chrt.component.scss'],
})
export class PolarChrtComponent implements OnInit {

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

// Generate and set data
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
let cat = -1;
let value = 10;

function generateData() {
  value = Math.round(Math.random() * 10);
  cat++;
  return {
    category: "cat" + cat,
    value: value
  };
}

function generateDatas(count) {
  cat = -1;
  let data = [];
  for (var i = 0; i < count; ++i) {
    data.push(generateData());
  }
  return data;
}

// Create chart
// https://www.amcharts.com/docs/v5/charts/radar-chart/
let chart = root.container.children.push(am5radar.RadarChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX"
}));

// Add cursor
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
let cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
  behavior: "none"
}));

cursor.lineY.set("visible", false);
cursor.lineX.set("visible", false);

// Create axes and their renderers
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
let xRenderer = am5radar.AxisRendererCircular.new(root, {});
xRenderer.labels.template.setAll({
  radius: 10
});

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0,
  categoryField: "direction",
  renderer: xRenderer
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5radar.AxisRendererRadial.new(root, {})
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series

let series = chart.series.push(am5radar.RadarLineSeries.new(root, {
  stacked: true,
  name: "Series ",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  categoryXField: "direction",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{categoryX}: {valueY}"
  })
}));


series.strokes.template.set("strokeWidth", 2);
series.bullets.push(function() {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(root, {
      radius: 5,
      fill: series.get("fill"),
      strokeWidth: 2,
      stroke: root.interfaceColors.get("background")
    })
  })
})

let data = [{
  "direction": "N",
  "value": 8
}, {
  "direction": "NE",
  "value": 9
}, {
  "direction": "E",
  "value": 4.5
}, {
  "direction": "SE",
  "value": 3.5
}, {
  "direction": "S",
  "value": 9.2
}, {
  "direction": "SW",
  "value": 8.4
}, {
  "direction": "W",
  "value": 11.1
}, {
  "direction": "NW",
  "value": 10
}]

series.data.setAll(data);
xAxis.data.setAll(data);

let range0 = xAxis.createAxisRange(xAxis.makeDataItem({ category: "NW", endCategory: "NW" }));
range0.get("axisFill").setAll({
  visible: true,
  fill: am5.color(0x0000ff),
  fillOpacity: 0.3
})

let range1 = xAxis.createAxisRange(xAxis.makeDataItem({ category: "N", endCategory: "N" }));
range1.get("axisFill").setAll({
  visible: true,
  fill: am5.color(0x0000ff),
  fillOpacity: 0.3
})

let range2 = xAxis.createAxisRange(xAxis.makeDataItem({ category: "SE", endCategory: "S" }));
range2.get("axisFill").setAll({
  visible: true,
  fill: am5.color(0xFF0000),
  fillOpacity: 0.3
})

chart.radarContainer.children.moveValue(chart.topGridContainer, 0);

// Animate chart
// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
series.appear(1000);
chart.appear(1000, 100);
  }

}
