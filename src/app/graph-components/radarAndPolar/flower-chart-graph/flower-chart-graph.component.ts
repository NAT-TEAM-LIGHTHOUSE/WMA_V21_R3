import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
@Component({
standalone : true,
imports : [],
  selector: 'app-flower-chart-graph',
  templateUrl: './flower-chart-graph.component.html',
  styleUrls: ['./flower-chart-graph.component.scss'],
})
export class FlowerChartGraphComponent implements OnInit {

  
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

// Data
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
let data = [{
  category: "One",
  value1: 8,
  value2: 2
}, {
  category: "Two",
  value1: 11,
  value2: 4
}, {
  category: "Three",
  value1: 7,
  value2: 6
}, {
  category: "Four",
  value1: 13,
  value2: 8
}, {
  category: "Five",
  value1: 12,
  value2: 10
}, {
  category: "Six",
  value1: 15,
  value2: 12
}, {
  category: "Seven",
  value1: 9,
  value2: 14
}, {
  category: "Eight",
  value1: 6,
  value2: 16
}];

// Create chart
// https://www.amcharts.com/docs/v5/charts/radar-chart/
let chart = root.container.children.push(
  am5radar.RadarChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX"
  })
);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
let cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
  behavior: "zoomX"
}));

cursor.lineY.set("visible", false);

// Create axes and their renderers
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
let xRenderer = am5radar.AxisRendererCircular.new(root, {
  cellStartLocation: 0.2,
  cellEndLocation: 0.8
});

xRenderer.labels.template.setAll({
  radius: 10
});

let xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    maxDeviation: 0,
    categoryField: "category",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5radar.AxisRendererRadial.new(root, {})
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
for (var i = 1; i <= 2; i++) {
  let series = chart.series.push(
    am5radar.RadarColumnSeries.new(root, {
      name: "Series " + i,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value" + i,
      categoryXField: "category"
    })
  );

  series.columns.template.setAll({
    tooltipText: "{name}: {valueY}",
    width: am5.percent(100)
  });

  series.data.setAll(data);
  
  series.appear(1000);
}

// Add scrollbars
chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal", exportable: false }));
chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical", exportable: false }));


// Animate chart
// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
chart.appear(1000, 100);
}
}
