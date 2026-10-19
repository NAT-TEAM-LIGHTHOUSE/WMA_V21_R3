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
  selector: 'app-show-perc-change',
  templateUrl: './show-perc-change.component.html',
  styleUrls: ['./show-perc-change.component.scss'],
})
export class ShowPercChangeComponent implements OnInit {

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

chart.get("colors").set("step", 5);

let legend = chart.plotContainer.children.push(am5.Legend.new(root, {
  centerY: am5.p100,
  y: am5.p100
}));

legend.valueLabels.template.set("width", 120);


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "none"
}));
cursor.lineY.set("visible", false);


// Generate random data
let date = new Date();
let value = 0;

function generateData() {
  value = am5.math.round((Math.random() * 2 - 1) + value, 2);
  am5.time.add(date, "day", 1);
  return {
    date: date.getTime(),
    value: value
  };
}

function generateDatas(count) {
  value = Math.random() * 50;
  date.setFullYear(2023, 0, 1);
  date.setHours(0, 0, 0, 0);
  let data = [];
  for (var i = 0; i < count; ++i) {
    data.push(generateData());
  }
  return data;
}


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  maxDeviation: 0.2,
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true,
    minGridDistance: 70
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {
    pan: "zoom"
  }),
  numberFormat: "#'%'"
}));


function createSeries(name) {
  let tooltip = am5.Tooltip.new(root, {
    getStrokeFromSprite: true,
    getFillFromSprite: false,
    labelText: "${valueY} {valueYChangeSelectionPercent.formatNumber('[#0f0]+0.00|[#f00]0.00|[#000]0.00')}%"
  })

  tooltip.get("background").setAll({
    fill: am5.color(0xffffff)
  })

  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  let series = chart.series.push(am5xy.LineSeries.new(root, {
    name: name,
    xAxis: xAxis,
    yAxis: yAxis,
    calculateAggregates: true,
    valueYField: "value",
    valueXField: "date",
    valueYShow: "valueYChangeSelectionPercent",
    legendValueText: "${valueY} {valueYChangeSelectionPercent.formatNumber('[#0f0]+0.00|[#f00]0.00|[#000]0.00')}%",
    tooltip: tooltip
  }));

  // Set data
  let data = generateDatas(800);
  series.data.setAll(data);
  series.appear(1000);

  legend.data.push(series);
}

createSeries("Series one");
createSeries("Series two");


// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));


// switch button
let cont = chart.plotContainer.children.push(am5.Container.new(root, {
  layout: root.horizontalLayout,
  x: 20,
  y: 25
}));

// Add labels and controls
cont.children.push(am5.Label.new(root, {
  centerY: am5.p50,
  text: "Since selection"
}));

let switchButton = cont.children.push(am5.Button.new(root, {
  themeTags: ["switch"],
  centerY: am5.p50,
  icon: am5.Circle.new(root, {
    themeTags: ["icon"]
  })
}));

switchButton.on("active", function () {
  if (!switchButton.get("active")) {
    chart.series.each(function (series) {
      series.set("valueYShow", "valueYChangeSelectionPercent");
      series.set("legendValueText", "${valueY} {valueYChangeSelectionPercent.formatNumber('[#0f0]+0.00|[#f00]0.00|[#000]0.00')}%");
      series.get("tooltip").set("labelText", "${valueY} {valueYChangeSelectionPercent.formatNumber('[#0f0]+0.00|[#f00]0.00|[#000]0.00')}%");
    })
  } else {
    chart.series.each(function (series) {
      series.set("valueYShow", "valueYChangePercent")
      series.set("legendValueText", "${valueY} {valueYChangePercent.formatNumber('[#0f0]+0.00|[#f00]0.00|[#000]0.00')}%");
      series.get("tooltip").set("labelText", "${valueY} {valueYChangePercent.formatNumber('[#0f0]+0.00|[#f00]0.00|[#000]0.00')}%");
    })
  }
});

cont.children.push(
  am5.Label.new(root, {
    centerY: am5.p50,
    text: "Since start"
  })
);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/

chart.appear(1000, 100);
  }
}
