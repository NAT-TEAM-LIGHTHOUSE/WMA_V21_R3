import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-clustered-bar-chart',
  templateUrl: './clustered-bar-chart.component.html',
  styleUrls: ['./clustered-bar-chart.component.scss'],
})
export class ClusteredBarChartComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
  }


 
 ngOnInit() {
   // alert("init");
   this.id = "simplePieChart12_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
  paddingLeft:0,
  layout: root.verticalLayout
}));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.p50,
  x: am5.p50
}))

let data = this.data;
// Data
// let data = [{
//   year: "2017",
//   income: 23.5,
//   expenses: 18.1
// }, {
//   year: "2018",
//   income: 26.2,
//   expenses: 22.8
// }, {
//   year: "2019",
//   income: 30.1,
//   expenses: 23.9
// }, {
//   year: "2020",
//   income: 29.5,
//   expenses: 25.1
// }, {
//   year: "2021",
//   income: 24.6,
//   expenses: 25
// }];
// let data=[{
//     "X1": "601",
//     "X1_label": "X1",
//     "Y1": 30433805,
//     "Y1_label": "abc",
//     "Y2": 30433805,
//     "Y2_label": "xyz"
// },
// {
//     "X1": "601",
//     "X1_label": "X1",
//     "Y1": 22633,
//     "Y1_label": "abc",
//     "Y2": 32283944,
//     "Y2_label": "xyz"
// },{
//     "X1": "A M",
//     "X1_label": "X1",
//     "Y1": 22614,
//     "Y1_label": "abc",
//     "Y2": 32283428,
//     "Y2_label": "xyz"
// },
// {
//     "X1": "ACHI",
//     "X1_label": "X1",
//     "Y1": 22613,
//     "Y1_label": "abc",
//     "Y2": 32283427,
//     "Y2_label": "xyz"
// }]


let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "X1",
  renderer: am5xy.AxisRendererY.new(root, {
    inversed: true,
    cellStartLocation: 0.1,
    cellEndLocation: 0.9,
    minorGridEnabled: true
  })
}));

yAxis.data.setAll(data);

let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererX.new(root, {
    strokeOpacity: 0.1,
    minGridDistance: 50
  }),
  min: 0
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
function createSeries(field, name) {
  let series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: name,
    xAxis: xAxis,
    yAxis: yAxis,
    valueXField: field,
    categoryYField: "X1",
    sequencedInterpolation: true,
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
    })
  }));

  series.columns.template.setAll({
    height: am5.p100,
    strokeOpacity: 0
  });


  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      locationX: 1,
      locationY: 0.5,
      sprite: am5.Label.new(root, {
        centerY: am5.p50,
        text: "{valueX}",
        populateText: true
      })
    });
  });

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      locationX: 1,
      locationY: 0.5,
      sprite: am5.Label.new(root, {
        centerX: am5.p100,
        centerY: am5.p50,
        text: "{name}",
        fill: am5.color(0xffffff),
        populateText: true
      })
    });
  });

  series.data.setAll(data);
  series.appear();

  return series;
}
let xField = "X1";
let y1Field = "Y1";
let y2Field = "Y2";
let xLabel = data[0]?.[`${xField}_label`] || xField;
let y1Label = data[0]?.[`${y1Field}_label`] || y1Field;
let y2Label = data[0]?.[`${y2Field}_label`] || y2Field;

createSeries("Y1", y1Label);
createSeries("Y2", y2Label);


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
 legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.p50,
  x: am5.p50
}));

legend.data.setAll(chart.series.values);


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "zoomY"
}));
cursor.lineY.set("forceHidden", true);
cursor.lineX.set("forceHidden", true);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
}

}
