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
  selector: 'app-waterfall-chart',
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.scss'],
})
export class WaterfallChartComponent  implements OnInit {

 
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
    panX: false,
    panY: false,
    paddingLeft: 0
  }));
  
  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  let xRenderer = am5xy.AxisRendererX.new(root, { 
    minGridDistance: 30,
    minorGridEnabled: true
   });
  
  let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0,
    categoryField: "category",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));
  
  xRenderer.grid.template.setAll({
    location: 1
  })
  
  let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0,
    min: 0,
    renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
    tooltip: am5.Tooltip.new(root, {})
  }));
  
  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    xAxis: xAxis,
    yAxis: yAxis
  }));
  
  // Create series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  let series = chart.series.push(am5xy.ColumnSeries.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    openValueYField: "open",
    categoryXField: "category"
  }));
  
  series.columns.template.setAll({
    templateField: "columnConfig",
    strokeOpacity: 0
  })
  
  series.bullets.push(function() {
    return am5.Bullet.new(root, {
      sprite: am5.Label.new(root, {
        text: "${displayValue} K",
        centerY: am5.p50,
        centerX: am5.p50,
        populateText: true
      })
    });
  });
  
  
  let stepSeries = chart.series.push(am5xy.StepLineSeries.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "stepValue",
    categoryXField: "category",
    noRisers: true,
    locationX: 0.65,
    stroke: root.interfaceColors.get("alternativeBackground")
  }));
  
  stepSeries.strokes.template.setAll({
    strokeDasharray: [3, 3]
  })
  
  let colorSet = am5.ColorSet.new(root, {});
  
  // Set data
  let data = [{
    category: "Net revenue",
    value: 8786,
    open: 0,
    stepValue: 8786,
    columnConfig: {
      fill: colorSet.getIndex(13),
    },
    displayValue: 8786
  }, {
    category: "Cost of sales",
    value: 8786 - 2786,
    open: 8786,
    stepValue: 8786 - 2786,
    columnConfig: {
      fill: colorSet.getIndex(8),
    },
    displayValue: 2786
  }, {
    category: "Operating expenses",
    value: 8786 - 2786 - 1786,
    open: 8786 - 2786,
    stepValue: 8786 - 2786 - 1786,
    columnConfig: {
      fill: colorSet.getIndex(9),
    },
    displayValue: 1786
  }, {
    category: "Amortisation",
    value: 8786 - 2786 - 1786 - 453,
    open: 8786 - 2786 - 1786,
    stepValue: 8786 - 2786 - 1786 - 453,
    columnConfig: {
      fill: colorSet.getIndex(10),
    },
    displayValue: 453
  }, {
    category: "Income from equity",
    value: 8786 - 2786 - 1786 - 453 + 1465,
    open: 8786 - 2786 - 1786 - 453,
    stepValue: 8786 - 2786 - 1786 - 453 + 1465,
    columnConfig: {
      fill: colorSet.getIndex(16),
    },
    displayValue: 1465
  }, {
    category: "Operating income",
    value: 8786 - 2786 - 1786 - 453 + 1465,
    open: 0,
    columnConfig: {
      fill: colorSet.getIndex(17),
    },
    displayValue: 8786 - 2786 - 1786 - 453 + 1465
  }];
  
  xAxis.data.setAll(data);
  series.data.setAll(data);
  stepSeries.data.setAll(data);
  
  
  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear(1000);
  chart.appear(1000, 100);
  
  // amCharts
}
}
