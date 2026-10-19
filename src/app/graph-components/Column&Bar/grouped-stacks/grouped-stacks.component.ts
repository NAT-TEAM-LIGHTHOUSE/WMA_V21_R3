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
  selector: 'app-grouped-stacks',
  templateUrl: './grouped-stacks.component.html',
  styleUrls: ['./grouped-stacks.component.scss'],
})
export class GroupedStacksComponent  implements OnInit {


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
  layout: root.verticalLayout
}));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(
  am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  })
);

let data = [
//   {
//   category: ""
// }, 
{
  category: "g1-2021",
  s10: 20,
  s11: 12
}, {
  category: "g1-2022",
  s10: 15,
  s11: 8
}, {
  category: "g1-2023",
  s10: 12,
  s11: 16
}, {
  category: "g1-2024",
  s10: 9,
  s11: 12
}, {
  category: ""
}, {
  category: "g2-2021",
  s20: 15,
  s21: 16
}, {
  category: "g2-2022",
  s20: 20,
  s21: 6
}, {
  category: "g2-2023",
  s20: 14,
  s21: 11
}, {
  category: "g2-2024",
  s20: 19,
  s21: 12
}, {
  category: ""
}, {
  category: "g3-2021",
  s30: 5,
  s31: 10
}, {
  category: "g3-2022",
  s30: 7,
  s31: 12
}, {
  category: "g3-2023",
  s30: 15,
  s31: 10
}, {
  category: "g3-2024",
  s30: 13,
  s31: 14
}];


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "category",
  renderer: am5xy.AxisRendererX.new(root, {
    cellStartLocation: 0.1,
    cellEndLocation: 0.9,
    minGridDistance: 10
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

xAxis.get("renderer").labels.template.adapters.add("text", function(text, target) {
  if (target.dataItem) {
    // return target.dataItem.get("category").split("-")[1];
  }
  return text;
});

xAxis.get("renderer").grid.template.set("forceHidden", true);

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
function makeSeries(name, fieldName, color) {
  let series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: name,
    xAxis: xAxis,
    yAxis: yAxis,
    stacked: true,
    valueYField: fieldName,
    categoryXField: "category",
    stroke: color,
    fill: color
  }));

  series.columns.template.setAll({
    tooltipText: "{name}, {categoryX}:{valueY}",
    width: am5.percent(90),
    tooltipY: 0
  });

  series.data.setAll(data);
  series.appear();
  legend.data.push(series);
}

makeSeries("Series #1", "s10", am5.color(0x133F3D));
makeSeries("Series #2", "s11", am5.color(0x216E6A));

makeSeries("Series #3", "s20", am5.color(0x20320C));
makeSeries("Series #4", "s21", am5.color(0x4A731C));

makeSeries("Series #5", "s30", am5.color(0x3A1603));
makeSeries("Series #6", "s31", am5.color(0x883407));

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
}

}
