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
  selector: 'app-scatter-chrt',
  templateUrl: './scatter-chrt.component.html',
  styleUrls: ['./scatter-chrt.component.scss'],
})
export class ScatterChrtComponent implements OnInit {

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

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
  tooltip: am5.Tooltip.new(root, {})
}));

xAxis.ghostLabel.set("forceHidden", true);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {}),
  tooltip: am5.Tooltip.new(root, {})
}));

yAxis.ghostLabel.set("forceHidden", true);

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series0 = chart.series.push(am5xy.LineSeries.new(root, {
  calculateAggregates: true,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "ay",
  valueXField: "ax",
  tooltip: am5.Tooltip.new(root, {
    labelText: "x: {valueX} y:{valueY}"
  })
}));


// Add bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
series0.bullets.push(function() {
  let graphics = am5.Triangle.new(root, {
    fill: series0.get("fill"),
    width: 15,
    height: 13
  });
  return am5.Bullet.new(root, {
    sprite: graphics
  });
});


// Create second series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series1 = chart.series.push(am5xy.LineSeries.new(root, {
  calculateAggregates: true,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "by",
  valueXField: "bx",
  tooltip: am5.Tooltip.new(root, {
    labelText: "x: {valueX} y:{valueY}"
  })
}));

series0.strokes.template.set("strokeOpacity", 0);
series1.strokes.template.set("strokeOpacity", 0);

// Add bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
series1.bullets.push(function() {
  let graphics = am5.Triangle.new(root, {
    fill: series1.get("fill"),
    width: 15,
    height: 13,
    rotation: 180
  });
  return am5.Bullet.new(root, {
    sprite: graphics
  });
});

// trend series
let trendSeries0 = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "y",
  valueXField: "x",
  stroke: series0.get("stroke")
}));

trendSeries0.data.setAll([
  { x: 1, y: 2 },
  { x: 12, y: 11 }
])

let trendSeries1 = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "y",
  valueXField: "x",
  stroke: series1.get("stroke")
}));

trendSeries1.data.setAll([
  { x: 1, y: 1 },
  { x: 12, y: 19 }
])

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
  "ax": 1,
  "ay": 0.5,
  "bx": 1,
  "by": 2.2
}, {
  "ax": 2,
  "ay": 1.3,
  "bx": 2,
  "by": 4.9
}, {
  "ax": 3,
  "ay": 2.3,
  "bx": 3,
  "by": 5.1
}, {
  "ax": 4,
  "ay": 2.8,
  "bx": 4,
  "by": 5.3
}, {
  "ax": 5,
  "ay": 3.5,
  "bx": 5,
  "by": 6.1
}, {
  "ax": 6,
  "ay": 5.1,
  "bx": 6,
  "by": 8.3
}, {
  "ax": 7,
  "ay": 6.7,
  "bx": 7,
  "by": 10.5
}, {
  "ax": 8,
  "ay": 8,
  "bx": 8,
  "by": 12.3
}, {
  "ax": 9,
  "ay": 8.9,
  "bx": 9,
  "by": 14.5
}, {
  "ax": 10,
  "ay": 9.7,
  "bx": 10,
  "by": 15
}, {
  "ax": 11,
  "ay": 10.4,
  "bx": 11,
  "by": 18.8
}, {
  "ax": 12,
  "ay": 11.7,
  "bx": 12,
  "by": 19
}]

series0.data.setAll(data);
series1.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series0.appear(1000);
series1.appear(1000);

trendSeries0.appear(1000);
trendSeries1.appear(1000);

chart.appear(1000, 100);
  }
}
