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
  selector: 'app-radar-chart-graph',
  templateUrl: './radar-chart-graph.component.html',
  styleUrls: ['./radar-chart-graph.component.scss'],
})
export class RadarChartGraphComponent implements OnInit {

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
let chart = root.container.children.push(am5radar.RadarChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX"
}));

let cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
  behavior: "zoomX"
}));

cursor.lineY.set("visible", false);


let xRenderer = am5radar.AxisRendererCircular.new(root, {});
xRenderer.labels.template.setAll({
  radius: 10
});

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0,
  categoryField: "country",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5radar.AxisRendererRadial.new(root, {})
}));


let series = chart.series.push(am5radar.RadarLineSeries.new(root, {
  name: "Series",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "litres",
  categoryXField: "country",
  tooltip:am5.Tooltip.new(root, {
    labelText:"{valueY}"
  })
}));

series.strokes.template.setAll({
  strokeWidth: 2
});

series.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(root, {
      radius: 5,
      fill: series.get("fill")
    })
  });
});

let data = [{
  "country": "Lithuania",
  "litres": 501
}, {
  "country": "Czechia",
  "litres": 301
}, {
  "country": "Ireland",
  "litres": 266
}, {
  "country": "Germany",
  "litres": 165
}, {
  "country": "Australia",
  "litres": 139
}, {
  "country": "Austria",
  "litres": 336
}, {
  "country": "UK",
  "litres": 290
}, {
  "country": "Belgium",
  "litres": 325
}, {
  "country": "The Netherlands",
  "litres": 40
}];
series.data.setAll(data);
xAxis.data.setAll(data);
series.appear(1000);
chart.appear(1000, 100);
}
}
