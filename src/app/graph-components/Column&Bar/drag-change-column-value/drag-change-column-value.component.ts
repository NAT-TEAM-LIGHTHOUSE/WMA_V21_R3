import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-drag-change-column-value',
  templateUrl: './drag-change-column-value.component.html',
  styleUrls: ['./drag-change-column-value.component.scss'],
})
export class DragChangeColumnValueComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
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

const myTheme = am5.Theme.new(root);

myTheme.rule("AxisLabel", ["minor"]).setAll({
  dy: 1
});

myTheme.rule("AxisLabel").setAll({
  fontSize: "0.9em"
});


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root),
  myTheme,
  am5themes_Responsive.new(root)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  wheelX: "panX",
  wheelY: "zoomX",
  paddingLeft: 0
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
let value = 100;

function generateData() {
  value = Math.round((Math.random() * 10 - 5) + value);
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
  maxDeviation: 0.2,
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true,
    minorLabelsEnabled: true
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

xAxis.set("minorDateFormats", {
  "day":"dd",
  "month":"MM"
});

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {
    pan: "zoom"
  })
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Series",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  valueXField: "date",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueY}"
  })
}));

series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
series.columns.template.adapters.add("fill", function (fill, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.columns.template.adapters.add("stroke", function (stroke, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});


// manipulating with mouse code
let isDown = false;

// register down
chart.plotContainer.events.on("pointerdown", function () {
  isDown = true;
})
// register up
chart.plotContainer.events.on("globalpointerup", function () {
  isDown = false;
})

chart.plotContainer.events.on("globalpointermove", function (e) {
  // if pointer is down
  if (isDown) {
    // get tooltip data item 
    let tooltipDataItem = series.get("tooltipDataItem");
    if (tooltipDataItem) {
      if (e.originalEvent) {

        let position = yAxis.coordinateToPosition(chart.plotContainer.toLocal(e.point).y);
        let value = yAxis.positionToValue(position);
        // need to set bot working and original value
        tooltipDataItem.set("valueY", value);
        tooltipDataItem.set("valueYWorking", value);
      }
    }
  }
})

chart.plotContainer.children.push(am5.Label.new(root, {
  text: "Click and move mouse anywhere on plot area to change the graph"
}))

// Set data
let data = generateDatas(20);
series.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);


}

}
