import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
@Component({
standalone : true,
imports : [],
  selector: 'app-bubble-chart-pie-bullet',
  templateUrl: './bubble-chart-pie-bullet.component.html',
  styleUrls: ['./bubble-chart-pie-bullet.component.scss'],
})
export class BubbleChartPieBulletComponent implements OnInit {

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
  wheelY: "zoomXY",
  pinchZoomX: true,
  pinchZoomY: true
}));

chart.get("colors").set("step", 2);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {}),
  tooltip: am5.Tooltip.new(root, {})
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series0 = chart.series.push(am5xy.LineSeries.new(root, {
  calculateAggregates: true,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "y",
  valueXField: "x",
  valueField: "value",
  tooltip: am5.Tooltip.new(root, {
    labelText: "x: {valueX}, y: {valueY}, value: {value}"
  })
}));


// Add bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
let pieChartTemplate:any = am5.Template.new({});

series0.bullets.push(function(root, series, dataItem:any) {
  if (dataItem.dataContext.pieData) {
    let pieChart = root.container.children.push(am5percent.PieChart.new(root, {
      width: 100,
      height: 100,
      radius: am5.p100,
      centerX: am5.p50,
      centerY: am5.p50
    }, pieChartTemplate));

    let series = pieChart.series.push(am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "category"
    }));

    series.labels.template.set("forceHidden", true);
    series.ticks.template.set("forceHidden", true);
    series.data.setAll(dataItem.dataContext.pieData);

    return am5.Bullet.new(root, {
      sprite: pieChart
    });
  }
  return null;
});

// Add heat rule
// https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
series0.set("heatRules", [{
  target: pieChartTemplate,
  min: 50,
  max: 150,
  dataField: "value",
  key: "width"
}]);

series0.strokes.template.set("strokeOpacity", 0);

// Add scrollbars
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

chart.set("scrollbarY", am5.Scrollbar.new(root, {
  orientation: "vertical"
}));


let data = [{
  y: 10,
  x: 14,
  value: 20,
  pieData: [{
    category: "Category #1",
    value: 1200
  }, {
    category: "Category #2",
    value: 500
  }, {
    category: "Category #3",
    value: 765
  }, {
    category: "Category #4",
    value: 260
  }]
}, {
  y: 5,
  x: 11,
  value: 80,
  pieData: [{
    category: "Category #1",
    value: 200
  }, {
    category: "Category #2",
    value: 600
  }, {
    category: "Category #3",
    value: 350
  }]
}, {
  y: -10,
  x: 8,
  value: 19,
  pieData: [{
    category: "Category #1",
    value: 352
  }, {
    category: "Category #2",
    value: 266
  }, {
    category: "Category #3",
    value: 512
  }, {
    category: "Category #4",
    value: 199
  }]
}, {
  y: -6,
  x: 5,
  value: 65,
  pieData: [{
    category: "Category #1",
    value: 200
  }, {
    category: "Category #2",
    value: 300
  }, {
    category: "Category #3",
    value: 599
  }, {
    category: "Category #4",
    value: 512
  }]
}]

series0.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series0.appear(1000);
chart.appear(1000, 100);
  }
}
