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
  selector: 'app-line-chart-horizantal-target',
  templateUrl: './line-chart-horizantal-target.component.html',
  styleUrls: ['./line-chart-horizantal-target.component.scss'],
})
export class LineChartHorizantalTargetComponent implements OnInit {

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
    pinchZoomX: true,
    paddingLeft: 0
}));


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineX.set("forceHidden", true);
cursor.lineY.set("forceHidden", true);

// Generate random data
let date = new Date();
date.setHours(0, 0, 0, 0);

let value = 20;
function generateData() {
    value = am5.math.round(Math.random() * 10 - 4.8 + value, 1);
    if (value < 0) {
        value = Math.random() * 10;
    }

    if (value > 100) {
        value = 100 - Math.random() * 10;
    }
    am5.time.add(date, "day", 1);
    return {
        date: date.getTime(),
        value: value
    };
}

function generateDatas(count) {
    let data = [];
    for (var i = 0; i < count; ++i) {
        data.push(generateData());
    }
    return data;
}


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
    baseInterval: {
        timeUnit: "day",
        count: 1
    },
    renderer: am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 80
    })
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.LineSeries.new(root, {
    name: "Series",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
    })
}));

series.fills.template.setAll({
    fillOpacity: 0.2,
    visible: true
});


// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
    orientation: "horizontal"
}));


// Set data
let data = generateDatas(300);
series.data.setAll(data);


let rangeDate = new Date();
am5.time.add(rangeDate, "day", Math.round(series.dataItems.length / 2));
let rangeTime = rangeDate.getTime();

// add series range
let seriesRangeDataItem = yAxis.makeDataItem({ value: 40, endValue: 0 });
let seriesRange = series.createAxisRange(seriesRangeDataItem);
seriesRange.fills.template.setAll({
    visible: true,
    opacity: 0.3
});

seriesRange.fills.template.set("fill", am5.color(0x000000));
seriesRange.strokes.template.set("stroke", am5.color(0x000000));

seriesRangeDataItem.get("grid").setAll({
    strokeOpacity: 1,
    visible: true,
    stroke: am5.color(0x000000),
    strokeDasharray: [2, 2]
})

seriesRangeDataItem.get("label").setAll({
    location:0,
    visible:true,
    text:"Target",
    inside:true,
    centerX:0,
    centerY:am5.p100,
    fontWeight:"bold"
})

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);
  }
}
