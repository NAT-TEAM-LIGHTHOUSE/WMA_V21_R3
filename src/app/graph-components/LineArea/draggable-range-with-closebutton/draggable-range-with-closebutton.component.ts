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
  selector: 'app-draggable-range-with-closebutton',
  templateUrl: './draggable-range-with-closebutton.component.html',
  styleUrls: ['./draggable-range-with-closebutton.component.scss'],
})
export class DraggableRangeWithClosebuttonComponent implements OnInit {

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
    minGridDistance: 90
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

// DRAGGABLE RANGE
// add series range
let rangeDataItem = yAxis.makeDataItem({});
yAxis.createAxisRange(rangeDataItem);

// create container for all elements, you can put anything you want top it
let container = am5.Container.new(root, {
  centerY: am5.p50,
  draggable: true,
  layout: root.horizontalLayout
})

// restrict from being dragged vertically
container.adapters.add("x", function() {
  return 0;
});

// restrict from being dragged outside of plot
container.adapters.add("y", function(y:any) {
  return Math.max(0, Math.min(chart.plotContainer.height(), y));
});

// change range when y changes
container.events.on("dragged", function() {
  updateLabel();
});

// this is needed for the bullets to be interactive, above the plot
yAxis.topGridContainer.children.push(container);

// create bullet and set container as a bullets sprite
rangeDataItem.set("bullet", am5xy.AxisBullet.new(root, {
  sprite: container
}));

// decorate grid of a range
rangeDataItem.get("grid").setAll({
  strokeOpacity: 1,
  visible: true,
  stroke: am5.color(0x000000),
  strokeDasharray: [2, 2]
})

// create background for the container
let background = am5.RoundedRectangle.new(root, {
  fill: am5.color(0xffffff),
  fillOpacity: 1,
  strokeOpacity: 0.5,
  cornerRadiusTL: 0,
  cornerRadiusBL: 0,
  cursorOverStyle: "ns-resize",
  stroke: am5.color(0xff0000)
})

container.set("background", background);

// add label to container, this one will show value and text
let label = container.children.push(am5.Label.new(root, {
  paddingTop: 5,
  paddingBottom: 5
}))

// add x button 
let xButton = container.children.push(am5.Button.new(root, {
  cursorOverStyle: "pointer",
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 2,
  paddingRight: 8
}))

// add label to the button (you can add icon instead of a label)
xButton.set("label", am5.Label.new(root, {
  text: "X",
  paddingBottom: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingLeft: 0,
  fill: am5.color(0xff0000)
}))

// modify background of x button
xButton.get("background").setAll({
  strokeOpacity: 0,
  fillOpacity: 0
})

// dispose item when x button is clicked
xButton.events.on("click", function() {
  yAxis.disposeDataItem(rangeDataItem);
})

function updateLabel(value?) {
  let y = container.y();
  let position = yAxis.toAxisPosition(y / chart.plotContainer.height());

  if(value == null){
    value = yAxis.positionToValue(position);
  }

  label.set("text", root.numberFormatter.format(value, "#.00") + ">Stop loss");

  rangeDataItem.set("value", value);
}

// when data is validated, set range value to the middle
series.events.on("datavalidated", () => {
  let max = yAxis.getPrivate("max", 1);
  let min = yAxis.getPrivate("min", 0);

  let value = min + (max - min) / 2;
  rangeDataItem.set("value", value);
  updateLabel(value);
})

// Set data
let data = generateDatas(300);
series.data.setAll(data);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);
  }
}
