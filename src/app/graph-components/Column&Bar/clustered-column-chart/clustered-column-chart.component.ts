import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-clustered-column-chart',
  templateUrl: './clustered-column-chart.component.html',
  styleUrls: ['./clustered-column-chart.component.scss'],
})
export class ClusteredColumnChartComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
  }


 ngOnInit() {
   this.id = "simplePieChart1_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
  paddingLeft: 0,
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


let data = this.data;


let xRenderer = am5xy.AxisRendererX.new(root, {
  cellStartLocation: 0.1,
  cellEndLocation: 0.9,
  minorGridEnabled: true
})

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "X1",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

xRenderer.grid.template.setAll({
  location: 1
})

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));

let xField = "X1";
let y1Field = "Y1";
let y2Field = "Y2";
let y3Field = "Y3"

// Get dynamic labels
let xLabel = data[0]?.[`${xField}_label`] || xField;
let y1Label = data[0]?.[`${y1Field}_label`] || y1Field;
let y2Label = data[0]?.[`${y2Field}_label`] || y2Field;
let y3Label = data[0]?.[`${y3Field}_label`] || y3Field;


const yKeys = Object.keys(data[0])
  .filter(key => /^Y\d+$/.test(key))
  .sort((a, b) =>
    Number(a.slice(1)) - Number(b.slice(1))
  );

yKeys.forEach(yKey => {

  const label =
    data[0]?.[`${yKey}_label`] || yKey;

  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: label,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: yKey,
      categoryXField: "X1"
    })
  );

  series.columns.template.setAll({
    tooltipText: `${label}, {categoryX}: {valueY}`,
    width: am5.percent(90),
    tooltipY: 0,
    strokeOpacity: 0
  });

  series.data.setAll(data);

  series.appear();

  legend.data.push(series);
});

}

}
