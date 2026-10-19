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
  selector: 'app-mixed-daily-intra-day-chrt',
  templateUrl: './mixed-daily-intra-day-chrt.component.html',
  styleUrls: ['./mixed-daily-intra-day-chrt.component.scss'],
})
export class MixedDailyIntraDayChrtComponent implements OnInit {

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

root.dateFormatter.setAll({
  dateFields: ["valueX"]
});

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    focusable: true,
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
  pinchZoomX:true
  })
);

// Create line series and related axes
let xAxis1 = chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    maxDeviation: 0.1,
    tooltipDateFormat: "MMM d, hh:00",
    baseInterval: { timeUnit: "hour", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {
      minGridDistance: 50,
      minorGridEnabled: true
    }),
    tooltip: am5.Tooltip.new(root, {})
  })
);

xAxis1.get("renderer").labels.template.set("forceHidden", true);
xAxis1.get("renderer").grid.template.set("forceHidden", true);

let yAxis1 = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 0.1,
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);

yAxis1.get("renderer").labels.template.set("forceHidden", true);
yAxis1.get("renderer").grid.template.set("forceHidden", true);

let series1 = chart.series.push(
  am5xy.LineSeries.new(root, {
    xAxis: xAxis1,
    yAxis: yAxis1,
    valueYField: "value",
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: "{valueY}"
    })
  })
);

series1.strokes.template.setAll({
  strokeWidth: 2
});

series1.data.setAll(generateHourlyData());

// Create column series and related axes
let xAxis2 = chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    maxDeviation: 0.1,
    baseInterval: { timeUnit: "day", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {
      minGridDistance: 50
    })
  })
);

let yAxis2 = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 0.1,
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);

let series2 = chart.series.unshift(
  am5xy.ColumnSeries.new(root, {
    xAxis: xAxis2,
    yAxis: yAxis2,
    valueYField: "value",
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: "{valueY}"
    })    
  })
);

series2.data.setAll(generateDailyData());

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis1
}));
cursor.lineY.set("visible", false);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series1.appear(1000, 100);
series2.appear(1000, 100);
chart.appear(1000, 100);

// Functions to generate random data
function generateDailyData() {
  let firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 10);
  firstDate.setHours(0, 0, 0, 0);
  let data = [];
  for (var i = 0; i < 10; i++) {
    let newDate = new Date(firstDate);
    newDate.setDate(newDate.getDate() + i);
    data.push({
      date: newDate.getTime(),
      value: Math.round(Math.random() * 12) + 1
    });
  }
  return data;
}

function generateHourlyData() {
  let firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 10);
  let data:any = [];
  for (var i = 0; i < 10 * 24; i++) {
    let newDate = new Date(firstDate);
    newDate.setHours(newDate.getHours() + i, 0, 0);
    let value:any =""
    if (i == 0) {
       value = Math.round(Math.random() * 10) + 1;
    } else {
       value = Math.round(data[data.length - 1].value / 100 * (90 + Math.round(Math.random() * 20)) * 100) / 100;
    }
    data.push({
      date: newDate.getTime(),
      value: value
    });
  }
  return data;
}
  }
}
