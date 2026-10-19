import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { PopoverController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"

@Component({
standalone : true,
imports : [],
  selector: 'app-variable-radius-radar-chart',
  templateUrl: './variable-radius-radar-chart.component.html',
  styleUrls: ['./variable-radius-radar-chart.component.scss'],
})
export class VariableRadiusRadarChartComponent implements OnInit {

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
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
let root = am5.Root.new("chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Generate and set data
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
let cat = -1;
let value = 10;

function generateData() {
  value = Math.round(Math.random() * 10);
  cat++;
  return {
    category: "cat" + cat,
    value: value
  };
}

function generateDatas(count) {
  cat = -1;
  let data = [];
  for (var i = 0; i < count; ++i) {
    data.push(generateData());
  }
  return data;
}

// Create chart
// https://www.amcharts.com/docs/v5/charts/radar-chart/
let chart = root.container.children.push(
  am5radar.RadarChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    innerRadius: am5.p50,
    layout: root.verticalLayout
  })
);

// Create axes and their renderers
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
let xRenderer = am5radar.AxisRendererCircular.new(root, {});
xRenderer.labels.template.setAll({
  textType:"adjusted"
});

let xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    maxDeviation: 0,
    categoryField: "category",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

let yAxis:any = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5radar.AxisRendererRadial.new(root, {})
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
for (var i = 0; i < 4; i++) {
  let series = chart.series.push(
    am5radar.RadarColumnSeries.new(root, {
      stacked: true,
      name: "Series " + i,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      categoryXField: "category"
    })
  );

  series.columns.template.setAll({
    tooltipText: "{name}: {valueY}"
  });

  series.data.setAll(generateDatas(6));
  series.appear(1000);
}

// slider
let slider = chart.children.push(
  am5.Slider.new(root, {
    orientation: "horizontal",
    start: 0.5,
    width: am5.percent(60),
    centerY: am5.p50,
    centerX: am5.p50,
    x: am5.p50
  })
);
slider.events.on("rangechanged", function () {
  let start = slider.get("start");
  let startAngle = 270 - start * 179 - 1;
  let endAngle = 270 + start * 179 + 1;

  chart.setAll({ startAngle: startAngle, endAngle: endAngle });
  yAxis.get("renderer").set("axisAngle", startAngle);
});

let data = generateDatas(6);
xAxis.data.setAll(data);

// Animate chart
// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
chart.appear(1000, 100);
  }

}
