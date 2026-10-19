import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { PopoverController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
@Component({
standalone : true,
imports : [],
  selector: 'app-radialine-graph-chart',
  templateUrl: './radialine-graph-chart.component.html',
  styleUrls: ['./radialine-graph-chart.component.scss'],
})
export class RadialineGraphChartComponent implements OnInit {

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
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
let root = am5.Root.new("chartdiv");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


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
  behavior: "zoomX"
}));

cursor.lineY.set("visible", false);


// Create axes and their renderers
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  maxDeviation: 0.1,
  groupData: false,
  baseInterval: {
    timeUnit: "month",
    count: 1
  },
  renderer: am5radar.AxisRendererCircular.new(root, {
    minGridDistance: 50
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5radar.AxisRendererRadial.new(root, {})
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
function createSeries(name, field) {
  let series = chart.series.push(am5radar.RadarLineSeries.new(root, {
    name: name,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: field,
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}"
    })
  }));

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: series.get("fill")
      })
    });
  });
  
  return series;
}

let series1 = createSeries("Series #1", "value1");
let series2 = createSeries("Series #2", "value2");


// Add scrollbars
chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical" }));


// Generate and set data
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
let data = [];
let value1 = 500;
let value2 = 600;

for(var i = 0; i < 12; i++){
  let date = new Date();
  date.setMonth(i, 1);
  value1 -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 50);
  value2 -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 50);
  data.push({ date: date.getTime(), value1: value1, value2: value2 });
}

series1.data.setAll(data);
series2.data.setAll(data);


// Animate chart and series in
// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
series1.appear(1000);
series2.appear(1000);
chart.appear(1000, 100);
}




}
