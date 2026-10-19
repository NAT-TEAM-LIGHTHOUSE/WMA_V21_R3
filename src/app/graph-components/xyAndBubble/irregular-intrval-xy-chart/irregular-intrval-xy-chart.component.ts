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
  selector: 'app-irregular-intrval-xy-chart',
  templateUrl: './irregular-intrval-xy-chart.component.html',
  styleUrls: ['./irregular-intrval-xy-chart.component.scss'],
})
export class IrregularIntrvalXyChartComponent implements OnInit {

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
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  layout: root.verticalLayout
}));


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  max: 50,
  numberFormat: "#,###'km'",
  renderer: am5xy.AxisRendererX.new(root, {}),
  tooltip: am5.Tooltip.new(root, {})
}));

xAxis.get("renderer").grid.template.set("forceHidden", true);
xAxis.get("renderer").labels.template.set("forceHidden", true);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  numberFormat: "#,###'m'",
  renderer: am5xy.AxisRendererY.new(root, {}),
  tooltip: am5.Tooltip.new(root, {})
}));


// Data
let colors = chart.get("colors");
let data = [{
  x: 0,
  y: 400,
  fillSettings: {
    fillOpacity: 1,
    visible: true,
    fill: colors.getIndex(0)
  }
}, {
  x: 14,
  y: 500,
  fillSettings: {
    fillOpacity: 1,
    visible: true,
    fill: colors.getIndex(1)
            }
}, {
  x: 22,
  y: 550,
  fillSettings: {
    fillOpacity: 1,
    visible: true,
    fill: colors.getIndex(0)
  }
}, {
  x: 26,
  y: 750,
  fillSettings: {
    fillOpacity: 1,
    visible: true,
    fill: colors.getIndex(0)
  }
}, {
  x: 29,
  y: 930,
  fillSettings: {
    fillOpacity: 1,
    visible: true,
    fill: colors.getIndex(1)
  }
}, {
  x: 43,
  y: 1020,
  fillSettings: {
    fillOpacity: 1,
    visible: true,
    fill: colors.getIndex(0)
  }
}, {
  x: 50,
  y: 1200,
  fillSettings: {
    fillOpacity: 1,
    visible: true,
    fill: colors.getIndex(1)
  }
}]


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.StepLineSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  baseAxis: xAxis,
  valueXField: "x",
  valueYField: "y",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueX}km: [bold]{valueY}m[/]"
  })
}));

series.strokes.template.setAll({
  visible: false
});

series.fills.template.setAll({
  fillOpacity: 1,
  visible: true,
  templateField: "fillSettings"
});

series.data.setAll(data);

// Create grid/ranges for X axis
for(var i = 0; i < data.length; i++) {
  let value = data[i].x;
  
  let rangeDataItem = xAxis.makeDataItem({
    value: value
  });
  
  let range = xAxis.createAxisRange(rangeDataItem);
  
  rangeDataItem.get("label").setAll({
    forceHidden: false,
    text: value + "km"
  });

  rangeDataItem.get("grid").setAll({
    forceHidden: false,
    strokeOpacity: 0.2,
    location: 1
  });
}


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  snapToSeries: [series]
}));


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear();
chart.appear(1000, 10);
  }
}
