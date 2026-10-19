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
  selector: 'app-bubble-chrt',
  templateUrl: './bubble-chrt.component.html',
  styleUrls: ['./bubble-chrt.component.scss'],
})
export class BubbleChrtComponent implements OnInit {

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
  wheelY: "zoomXY",
  pinchZoomX:true,
  pinchZoomY:true
}));

chart.get("colors").set("step", 2);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {}),
  tooltip: am5.Tooltip.new(root, {})
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series0 = chart.series.push(am5xy.LineSeries.new(root, {
  calculateAggregates: true,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "y",
  valueXField: "x",
  valueField: "value",
  tooltip: am5.Tooltip.new(root, {
    labelText: "x: {valueX}, y: {valueY}, value: {value}"
  })
}));


// Add bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
let circleTemplate:any = am5.Template.new({});
series0.bullets.push(function() {
  let graphics = am5.Circle.new(root, {
    fill: series0.get("fill"),
  }, circleTemplate);
  return am5.Bullet.new(root, {
    sprite: graphics
  });
});

// Add heat rule
// https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
series0.set("heatRules", [{
  target: circleTemplate,
  min: 3,
  max: 35,
  dataField: "value",
  key: "radius"
}]);


// Create second series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series1 = chart.series.push(am5xy.LineSeries.new(root, {
  calculateAggregates: true,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "y2",
  valueXField: "x2",
  valueField: "value",
  tooltip: am5.Tooltip.new(root, {
    labelText: "x: {valueX}, y: {valueY}, value: {value}"
  })
}));

// Add bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
let starTemplate:any = am5.Template.new({});
series1.bullets.push(function() {
  let graphics = am5.Star.new(root, {
    fill: series1.get("fill"),
    spikes: 8,
    innerRadius: am5.percent(70),
  }, starTemplate);
  return am5.Bullet.new(root, {
    sprite: graphics
  });
});


// Add heat rule
// https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
series1.set("heatRules", [{
  target: starTemplate,
  min: 3,
  max: 50,
  dataField: "value",
  key: "radius"
}]);


series0.strokes.template.set("strokeOpacity", 0);
series1.strokes.template.set("strokeOpacity", 0);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  snapToSeries: [series0, series1]
}));

// Add scrollbars
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

chart.set("scrollbarY", am5.Scrollbar.new(root, {
  orientation: "vertical"
}));


let data = [{
  "y": 10,
  "x": 14,
  "value": 59,
  "y2": -5,
  "x2": -3,
  "value2": 44
}, {
  "y": 5,
  "x": 3,
  "value": 50,
  "y2": -15,
  "x2": -8,
  "value2": 12
}, {
  "y": -10,
  "x": 8,
  "value": 19,
  "y2": -4,
  "x2": 6,
  "value2": 35
}, {
  "y": -6,
  "x": 5,
  "value": 65,
  "y2": -5,
  "x2": -6,
  "value2": 168
}, {
  "y": 15,
  "x": -4,
  "value": 92,
  "y2": -10,
  "x2": -8,
  "value2": 102
}, {
  "y": 13,
  "x": 1,
  "value": 8,
  "y2": -2,
  "x2": 0,
  "value2": 41
}, {
  "y": 1,
  "x": 6,
  "value": 35,
  "y2": 0,
  "x2": -3,
  "value2": 16
}]

series0.data.setAll(data);
series1.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series0.appear(1000);
series1.appear(1000);

chart.appear(1000, 100);
  }
}
