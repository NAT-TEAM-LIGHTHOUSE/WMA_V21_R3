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
  selector: 'app-divergent-lines-chrt',
  templateUrl: './divergent-lines-chrt.component.html',
  styleUrls: ['./divergent-lines-chrt.component.scss'],
})
export class DivergentLinesChrtComponent implements OnInit {

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
  wheelX: "panX",
  wheelY: "zoomX",
  layout: root.verticalLayout,
  pinchZoomX:true
}));

chart.get("colors").set("step", 3);

// Data
let data = [{
  "date": new Date(2020, 0, 1).getTime(),
  "observed": 0
}, {
  "date": new Date(2020, 1, 1).getTime(),
  "observed": 4000
}, {
  "date": new Date(2020, 2, 1).getTime(),
  "observed": 55000
}, {
  "date": new Date(2020, 3, 1).getTime(),
  "observed": 220000
}, {
  "date": new Date(2020, 4, 1).getTime(),
  "observed": 390000
}, {
  "date": new Date(2020, 5, 1).getTime(),
  "observed": 550000
}, {
  "date": new Date(2020, 6, 1).getTime(),
  "observed": 720000,
  "easing": 720000,
  "projection": 720000,
  "stricter": 720000
}, {
  "date": new Date(2020, 7, 1).getTime(),
  "easing": 900000,
  "projection": 900000,
  "stricter": 900000
}, {
  "date": new Date(2020, 8, 1).getTime(),
  "easing": 1053000,
  "projection": 1053000,
  "stricter": 1053000
}, {
  "date": new Date(2020, 9, 1).getTime(),
  "easing": 1252000,
  "projection": 1249000,
  "stricter": 1232000
}, {
  "date": new Date(2020, 10, 1).getTime(),
  "easing": 1674000,
  "projection": 1604000,
  "stricter": 1415000
}, {
  "date": new Date(2020, 11, 1).getTime(),
  "easing": 3212000,
  "projection": 2342000,
  "stricter": 1751000
}];


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  maxDeviation: 0.3,
  baseInterval: {
    timeUnit: "month",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true,
    minGridDistance: 60
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  renderer: am5xy.AxisRendererY.new(root, {})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
function createSeries(field, name, color, dashed?) {
  let series:any = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
    name: name,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: field,
    valueXField: "date",
    stroke: color,
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      getFillFromSprite: false,
      labelText: "[bold]{name}[/]\n{valueX}: [bold]{valueY}[/]"
    })
  }));
  
  series.get("tooltip").get("background").setAll({
    fillOpacity: 0.7,
    fill: color,
    pointerBaseWidth: 0
  });
  
  series.strokes.template.setAll({
    strokeWidth: 2
  });
  
  if (dashed) {
    series.strokes.template.set("strokeDasharray", [5, 3]);
  }
  
  series.data.setAll(data);
  series.appear(1000);
  
  return series;
}

createSeries("observed", "Observed", am5.color(0xB1B106));
createSeries("easing", "Easing rules", am5.color(0xD68C45), true);
createSeries("stricter", "Stricter rules", am5.color(0x2C6E49), true);
createSeries("projection", "Projection", am5.color(0xB1B106), true);


// Set date fields
// https://www.amcharts.com/docs/v5/concepts/data/#Parsing_dates
root.dateFormatter.setAll({
  dateFormat: "yyyy-MM-dd",
  dateFields: ["valueX"]
});


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(
  am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  })
);

legend.data.setAll(chart.series.values);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
  }
}
