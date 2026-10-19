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
  selector: 'app-evenly-spaced-date-axis',
  templateUrl: './evenly-spaced-date-axis.component.html',
  styleUrls: ['./evenly-spaced-date-axis.component.scss'],
})
export class EvenlySpacedDateAxisComponent implements OnInit {

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
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  pinchZoomX:true
}));


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "none"
}));
cursor.lineY.set("visible", false);

// Generate random data
let date = new Date();
date.setHours(0, 0, 0, 0);
let value = 1;

function generateData() {
  value = Math.round((Math.random() * 10 - 5) + value);
  if (date.getDay() == 5) {
    am5.time.add(date, "day", 3);
  } else {
    am5.time.add(date, "day", 1);
  }

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
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/category-date-axis/
let xRenderer = am5xy.AxisRendererX.new(root, {});
xRenderer.labels.template.set("minPosition", 0.01);
xRenderer.labels.template.set("maxPosition", 0.99);

let xAxis = chart.xAxes.push(
  am5xy.CategoryDateAxis.new(root, {
    categoryField: "date",
    baseInterval: {
      timeUnit: "day",
      count: 1
    },
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.LineSeries.new(root, {
  name: "Series",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  categoryXField: "date"
}));

let tooltip = series.set("tooltip", am5.Tooltip.new(root, {}));
tooltip.label.set("text", "{valueY}");

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));


// Set data
let data = generateDatas(200);
series.data.setAll(data);
xAxis.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);

    
  }
}
