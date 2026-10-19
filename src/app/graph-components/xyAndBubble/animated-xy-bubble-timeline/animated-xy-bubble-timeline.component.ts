import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5stock from "@amcharts/amcharts5/stock";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"

@Component({
standalone : true,
imports : [],
  selector: 'app-animated-xy-bubble-timeline',
  templateUrl: './animated-xy-bubble-timeline.component.html',
  styleUrls: ['./animated-xy-bubble-timeline.component.scss'],
})
export class AnimatedXyBubbleTimelineComponent implements OnInit {

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

let yearData = {};
let firstYear = 1950;
let lastYear = 2022;
let currentYear = firstYear;

for (var year = firstYear; year <= lastYear; year++) {
  let data = [];
  yearData[year] = data;

  for (var i = 0; i < 50; i++) {
    if (year == firstYear) {
      data.push({
        x: Math.round(Math.random() * 100 - 90),
        y: Math.round(Math.random() * 100 - 90),
        value: Math.round(Math.random() * 1000)
      });
    } else {
      let previous = yearData[year - 1][i];
      data.push({
        x: previous.x + Math.round(Math.random() * 5 - 2 + i / 50),
        y: previous.y + Math.round(Math.random() * 5 - 2 + i / 50),
        value: Math.abs(previous.value + Math.round(Math.random() * 100 - 45))
      });
    }
  }
}

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: true,
  wheelY: "zoomXY",
  pinchZoomX:true,
  pinchZoomY:true
}));

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  min: -100,
  max: 100,
  renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  min: -100,
  max: 100,
  renderer: am5xy.AxisRendererY.new(root, {}),
  tooltip: am5.Tooltip.new(root, {})
}));

// color fills
let series0 = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueXField: "ax",
  valueYField: "ay",
  fill: am5.color(0xe3853c)
}));
series0.fills.template.setAll({ fillOpacity: 0.9, visible: true });
series0.strokes.template.set("forceHidden", true);
series0.data.setAll([
  { ax: -200, ay: 0 },
  { ax: 0, ay: 0 },
  { ax: 0, ay: 200 },
  { ax: -200, ay: 200 }
]);

let series1 = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueXField: "ax",
  valueYField: "ay",
  fill: am5.color(0x48b2b7)
}));
series1.fills.template.setAll({ fillOpacity: 0.9, visible: true });
series1.strokes.template.set("forceHidden", true);
series1.data.setAll([
  { ax: -200, ay: 0 },
  { ax: 0, ay: 0 },
  { ax: 0, ay: -200 },
  { ax: -200, ay: -200 }
]);

let series2 = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueXField: "ax",
  valueYField: "ay",
  fill: am5.color(0x91d1da)
}));
series2.fills.template.setAll({ fillOpacity: 0.9, visible: true });
series2.strokes.template.set("forceHidden", true);
series2.data.setAll([
  { ax: 200, ay: 0 },
  { ax: 0, ay: 0 },
  { ax: 0, ay: -200 },
  { ax: 200, ay: -200 }
]);

let series3 = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueXField: "ax",
  valueYField: "ay",
  fill: am5.color(0xe8c634)
}));
series3.fills.template.setAll({ fillOpacity: 0.9, visible: true });
series3.strokes.template.set("forceHidden", true);
series3.data.setAll([
  { ax: 200, ay: 0 },
  { ax: 0, ay: 0 },
  { ax: 0, ay: 200 },
  { ax: 200, ay: 200 }
]);

// move grid forward
chart.plotContainer.children.moveValue(
  chart.gridContainer,
  chart.plotContainer.children.length - 1
);

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.LineSeries.new(root, {
  calculateAggregates: true,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "y",
  valueXField: "x",
  valueField: "value"
}));

series.strokes.template.set("visible", false);

// Add bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
let circleTemplate:any = am5.Template.new({});
series.bullets.push(function () {
  let bulletCircle = am5.Circle.new(root, {
    radius: 5,
    fill: am5.color(0x000000),
    fillOpacity: 0.6,
    tooltipText: "x: {valueX} y:{valueY} value: {value}"
  }, circleTemplate);
  return am5.Bullet.new(root, {
    sprite: bulletCircle
  });
});

// Add heat rule
// https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
series.set("heatRules", [{
  target: circleTemplate,
  min: 3,
  max: 35,
  dataField: "value",
  key: "radius", maxValue:2000
}]);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis,
  yAxis: yAxis
}));

// Add scrollbars
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

chart.set("scrollbarY", am5.Scrollbar.new(root, {
  orientation: "vertical"
}));

// Label
let label = chart.plotContainer.children.push(am5.Label.new(root, {
  text: currentYear.toString(),
  fontSize: "5em",
  fill: am5.color(0x000000),
  opacity: 0.3
}));

// Create controls
let container = chart.plotContainer.children.push(am5.Container.new(root, {
  y: am5.p100,
  centerX: am5.p50,
  centerY: am5.p100,
  x: am5.p50,
  width: am5.percent(90),
  layout: root.horizontalLayout,
  paddingBottom: 10
}));

let playButton = container.children.push(am5.Button.new(root, {
  themeTags: ["play"],
  centerY: am5.p50,
  marginRight: 20,
  icon: am5.Graphics.new(root, {
    themeTags: ["icon"]
  })
}));

playButton.events.on("click", function () {
  if (playButton.get("active")) {
    slider.set("start", slider.get("start") + 0.0001);
  } else {
    slider.animate({
      key: "start",
      to: 1,
      duration: 15000 * (1 - slider.get("start"))
    });
  }
});

let slider = container.children.push(am5.Slider.new(root, {
  orientation: "horizontal",
  start: 0,
  centerY: am5.p50
}));

slider.on("start", function (start) {
  if (start === 1) {
    playButton.set("active", false);
  }
});

slider.events.on("rangechanged", function () {
  updateSeriesData(
    firstYear + Math.round(slider.get("start", 0) * (lastYear - firstYear))
  );
});

function updateSeriesData(year) {
  if (currentYear != year) {
    currentYear = year;
    let data = yearData[year];

    let i = 0;
    am5.array.each(data, function (item) {
      series.data.setIndex(i, item);
      i++;
    });

    label.set("text", year.toString());
  }
}

series.data.setAll(yearData[currentYear]);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);
  }

}
