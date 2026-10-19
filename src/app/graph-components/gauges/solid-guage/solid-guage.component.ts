import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';

import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
standalone : true,
imports : [CommonModule,FormsModule],
  selector: 'app-solid-guage',
  templateUrl: './solid-guage.component.html',
  styleUrls: ['./solid-guage.component.scss'],
})
export class SolidGuageComponent implements OnInit {
  
  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    // alert("init");
    this.id = "SolidGauge_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/radar-chart/
let chart = root.container.children.push(am5radar.RadarChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  innerRadius: am5.percent(20),
  startAngle: -90,
  endAngle: 180,
  // colors: am5.ColorSet.new(root, {
  //   colors: [
  //     am5.color(0xEF6F6C),
  //     am5.color(0x426A5A),
  //     am5.color(0x7FB685),
  //     am5.color(0xDDAE7E),
  //     am5.color(0x4D7EA8)
  //   ]
  // })
}));

  let data = (this.data ?? []).map((item: any, index: number) => ({
    ...item,
    columnSettings: {
      ...item.columnSettings,
      fill: chart.get("colors").getIndex(index % 5)
    }
  }));

// // Data
// let data = [{
//   category: "Research",
//   value: 80,
//   full: 100,
//   columnSettings: {
//     fill: chart.get("colors").getIndex(0)
//   }
// }, {
//   category: "Marketing",
//   value: 35,
//   full: 100,
//   columnSettings: {
//     fill: chart.get("colors").getIndex(1)
//   }
// }, {
//   category: "Distribution",
//   value: 92,
//   full: 100,
//   columnSettings: {
//     fill: chart.get("colors").getIndex(2)
//   }
// }, {
//   category: "Human Resources",
//   value: 68,
//   full: 100,
//   columnSettings: {
//     fill: chart.get("colors").getIndex(3)
//   }
// }];

// Add cursor
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
let cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
  behavior: "zoomX"
}));

cursor.lineY.set("visible", false);

// Create axes and their renderers
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
let xRenderer = am5radar.AxisRendererCircular.new(root, {
  //minGridDistance: 50
});

xRenderer.labels.template.setAll({
  radius: 10
});

xRenderer.grid.template.setAll({
  forceHidden: true
});

let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  renderer: xRenderer,
  min: 0,
  max: 100,
  strictMinMax: true,
  numberFormat: "#'%'",
  tooltip: am5.Tooltip.new(root, {})
}));


let yRenderer = am5radar.AxisRendererRadial.new(root, {
  minGridDistance: 20
});

yRenderer.labels.template.setAll({
  centerX: am5.p100,
  fontWeight: "500",
  fontSize: 18,
  templateField: "columnSettings"
});

yRenderer.grid.template.setAll({
  forceHidden: true
});

let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "X1",
  renderer: yRenderer
}));

yAxis.data.setAll(data);


// Create series
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
let series1 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  clustered: false,
  valueXField: "full",
  categoryYField: "X1",
  fill: root.interfaceColors.get("alternativeBackground")
}));

series1.columns.template.setAll({
  width: am5.p100,
  fillOpacity: 0.08,
  strokeOpacity: 0,
  cornerRadius: 20
});

series1.data.setAll(data);


let series2 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  clustered: false,
  valueXField: "Y1",
  categoryYField: "X1"
}));

series2.columns.template.setAll({
  width: am5.p100,
  strokeOpacity: 0,
  tooltipText: "{X1}: {valueX}%",
  cornerRadius: 20,
  templateField: "columnSettings"
});

series2.data.setAll(data);

// let series2 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
//   xAxis: xAxis,
//   yAxis: yAxis,
//   clustered: false,
//   valueXField: "Y1",
//   categoryYField: "category"
// }));

// series2.columns.template.setAll({
//   width: am5.p100,
//   strokeOpacity: 0,
//   tooltipText: "{category}: {valueX}%",
//   cornerRadius: 20,
//   templateField: "columnSettings"
// });

// series2.data.setAll(data);

// Animate chart and series in
// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
series1.appear(1000);
series2.appear(1000);
chart.appear(1000, 100);
}
}
