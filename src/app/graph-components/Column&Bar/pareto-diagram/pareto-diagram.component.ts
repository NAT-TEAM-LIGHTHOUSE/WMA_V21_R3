import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController, Platform } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';



import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);

@Component({
standalone : true,
imports : [],
  selector: 'app-pareto-diagram',
  templateUrl: './pareto-diagram.component.html',
  styleUrls: ['./pareto-diagram.component.scss'],
})
export class ParetoDiagramComponent implements OnInit {

  @Input() subData: Subject<any>;
  data = [];
   @Input() frame: any;
   id=""
   doubleLineFlag = false

  constructor(private gloabalObject : GlobalObjectsService,public platform: Platform,private PopoverController: PopoverController,  private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "paretoChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    this.gloabalObject.chartId++;
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        this.data =  this.frame.chartData; 
      // this.displayChart();
      this.displayChart();

      })
    }, 100);

    this.subData.subscribe(data => {
      this.data = data;
      this.displayChart();
      // this.displayChartam5();

    })

  }



displayChart(){
    // alert("pareto data : "+JSON.stringify(this.data));
    console.log("pareto data : "+JSON.stringify(this.data));
    let root = am5.Root.new(this.id);


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
  paddingLeft: 0,
  paddingRight: 0,
  layout: root.verticalLayout
}));

let colors = chart.get("colors");

// let data:any = [{
//   "X1": "US",
//   "Y1": 725
// }, {
//   "X1": "UK",
//   "Y1": 625
// }, {
//   "X1": "China",
//   "Y1": 602
// }, {
//   "X1": "Japan",
//   "Y1": 509
// }, {
//   "X1": "Germany",
//   "Y1": 322
// }, {
//   "X1": "France",
//   "Y1": 214
// }, {
//   "X1": "India",
//   "Y1": 204
// }, {
//   "X1": "Spain",
//   "Y1": 198
// }, {
//   "X1": "Netherlands",
//   "Y1": 165
// }, {
//   "X1": "South Korea",
//   "Y1": 93
// }, {
//   "X1": "Canada",
//   "Y1": 41
// }];
let data:any = []


// let showData:any=[];


// for(let i=0;i<this.data.length;i++){
//   let showDataObj={
//         Y1:this.data[i].Y1,
//         X1:this.data[i].X1+i
//   }
//   data.push(showDataObj);
// }

data=this.data;
prepareParetoData();

function prepareParetoData() {
  let total = 0;

  for (var i = 0; i < data.length; i++) {
    let value = data[i].Y1;
    total += value;
  }

  let sum = 0;
  for (var i = 0; i < data.length; i++) {
    let value = data[i].Y1;
    sum += value;
    data[i].pareto = sum / total * 100;
  }
}



// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  minGridDistance: 85,
  minorGridEnabled: true
})

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "X1",
  renderer: xRenderer
}));

xRenderer.grid.template.setAll({
  location: 1
})

xRenderer.labels.template.setAll({
  paddingTop: 20
});

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));

let paretoAxisRenderer = am5xy.AxisRendererY.new(root, { opposite: true });
let paretoAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: paretoAxisRenderer,
  min: 0,
  max: 100,
  strictMinMax: true
}));

paretoAxisRenderer.grid.template.set("forceHidden", true);
paretoAxis.set("numberFormat", "#'%");


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
// let series = chart.series.push(am5xy.ColumnSeries.new(root, {
//   xAxis: xAxis,
//   yAxis: yAxis,
//   valueYField: "Y1",
//   categoryXField: "X1"
// }));
let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "Y1",
  categoryXField: "X1"
}));

series.columns.template.setAll({
  tooltipText: "{categoryX}: {valueY}",
  tooltipY: 0,
  strokeOpacity: 0,
  cornerRadiusTL: 6,
  cornerRadiusTR: 6
});

series.columns.template.adapters.add("fill", function (fill, target) {
  return chart.get("colors").getIndex(series.dataItems.indexOf(target.dataItem));
})


// pareto series
let paretoSeries = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: paretoAxis,
  valueYField: "pareto",
  categoryXField: "X1",
  stroke: root.interfaceColors.get("alternativeBackground"),
  maskBullets: false
}));

paretoSeries.bullets.push(function () {
  return am5.Bullet.new(root, {
    locationY: 1,
    sprite: am5.Circle.new(root, {
      radius: 5,
      fill: series.get("fill"),
      stroke: root.interfaceColors.get("alternativeBackground")
    })
  })
})

series.data.setAll(data);
paretoSeries.data.setAll(data);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear();
chart.appear(1000, 100);
  }


}