import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CommonModule } from '@angular/common';

@Component({
standalone : true,
imports : [CommonModule],
  selector: 'app-column-line-mix',
  templateUrl: './column-line-mix.component.html',
  styleUrls: ['./column-line-mix.component.scss'],
})
export class ColumnLineMixComponent  implements OnInit {


  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    // alert("init");
    this.id = "compassChart"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
  let root = am5.Root.new(this.id);

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([am5themes_Animated.new(root)]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    paddingLeft: 0,
    layout: root.verticalLayout
  })
);

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set(
  "scrollbarX",
  am5.Scrollbar.new(root, {
    orientation: "horizontal"
  })
);


let data = this.data;

let xRenderer = am5xy.AxisRendererX.new(root, {
  minorGridEnabled: true,
  minGridDistance: 60
});
let xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "X1",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);
xRenderer.grid.template.setAll({
  location: 1
})

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    min: 0,
    extraMax: 0.1,
    renderer: am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
    })
  })
);




let xField = "X1";
let y1Field = "Y1";
let y2Field = "Y2";

let xLabel = data[0]?.[`${xField}_label`] || xField;
let y1Label = data[0]?.[`${y1Field}_label`] || y1Field;
let y2Label = data[0]?.[`${y2Field}_label`] || y2Field;

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/

let series1 = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    name: y1Label,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "Y1",
    categoryXField: "X1",
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: "{name} in {categoryX}: {valueY} {info}"
    })
  })
);

series1.columns.template.setAll({
  tooltipY: am5.percent(10),
  templateField: "columnSettings"
});

series1.data.setAll(data);
// series1.events.on("click", ($event) => {
//   // var dataItem = event.target.dataItem;
//   alert("Hello World");
//   console.log("sereies 1"+$event);
//   // console.log("Clicked on category:", dataItem.get(""));
// })
let series2 = chart.series.push(
  am5xy.LineSeries.new(root, {
    name: y2Label,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "Y2",
    categoryXField: "X1",
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: "{name} in {categoryX}: {valueY} {info}"
    })
  })
);

series2.strokes.template.setAll({
  strokeWidth: 3,
  templateField: "strokeSettings"
});


series2.data.setAll(data);

series2.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(root, {
      strokeWidth: 3,
      stroke: series2.get("stroke"),
      radius: 5,
      fill: root.interfaceColors.get("background")
    })
  });
});

// series2.events.on("click", ($event) => {
//   // var dataItem = event.target.dataItem;
//   alert("Hello World");
//   console.log("sereies2"+$event);
//   // console.log("Clicked on category:", dataItem.get(""));
// })


chart.set("cursor", am5xy.XYCursor.new(root, {}));

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
series1.appear();
series1.events.on("click", ($event) => {
  
  // var dataItem = event.target.dataItem;
  // alert("Hello World");

  console.log($event);
  // console.log("Clicked on category:", dataItem.get(""));
})




chart.plotContainer.events.on("click", function (event) {
  // Get the coordinates of the click
  var point = chart.plotContainer.toLocal(event.point);
  
  // Convert pixel position to axis values
  var xValue = xAxis.indexToPosition(xAxis.coordinateToPosition(point.x));
  var yValue = yAxis.positionToValue(yAxis.coordinateToPosition(point.y));

  console.log("Clicked on x-axis value:", xValue);
  console.log("Clicked on y-axis value:", yValue);
});

}

}
