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
  selector: 'app-stacked-area-radar-chart',
  templateUrl: './stacked-area-radar-chart.component.html',
  styleUrls: ['./stacked-area-radar-chart.component.scss'],
})
export class StackedAreaRadarChartComponent implements OnInit {

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
// https://www.amcharts.com/docs/v5/charts/radar-chart/
let chart = root.container.children.push(
  am5radar.RadarChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    innerRadius: am5.percent(40),
    radius: am5.percent(70),
    arrangeTooltips: false
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
  minGridDistance: 30
});
xRenderer.labels.template.setAll({
  textType: "radial",
  radius: 10,
  paddingTop: 0,
  paddingBottom: 0,
  centerY: am5.p50,
  fontSize: "0.8em"
});

xRenderer.grid.template.setAll({
  location: 0.5,
  strokeDasharray: [2, 2]
});

let xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    maxDeviation: 0,
    categoryField: "name",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

let yRenderer = am5radar.AxisRendererRadial.new(root, {
  minGridDistance: 30
});

let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: yRenderer
  })
);

yRenderer.grid.template.setAll({
  strokeDasharray: [2, 2]
});

// Create series
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
let series1 = chart.series.push(
  am5radar.RadarLineSeries.new(root, {
    name: "Cash held outside",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value1",
    categoryXField: "name"
  })
);

series1.strokes.template.setAll({
  strokeOpacity: 0
});

series1.fills.template.setAll({
  visible: true,
  fillOpacity: 0.5
});

let series2 = chart.series.push(
  am5radar.RadarLineSeries.new(root, {
    name: "Cash held in US",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value2",
    categoryXField: "name",
    stacked: true,
    tooltip: am5.Tooltip.new(root, {
      labelText: "Outside: {value1}\nInside:{value2}"
    })
  })
);

series2.strokes.template.setAll({
  strokeOpacity: 0
});

series2.fills.template.setAll({
  visible: true,
  fillOpacity: 0.5
});

let legend = chart.radarContainer.children.push(
  am5.Legend.new(root, {
    width: 150,
    centerX: am5.p50,
    centerY: am5.p50
  })
);
legend.data.setAll([series1, series2]);

// Set data
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
let data = [
  {
    name: "Openlane",
    value1: 160.2,
    value2: 66.9
  },
  {
    name: "Yearin",
    value1: 150.1,
    value2: 50.5
  },
  {
    name: "Goodsilron",
    value1: 120.7,
    value2: 32.3
  },
  {
    name: "Condax",
    value1: 89.4,
    value2: 74.5
  },
  {
    name: "Opentech",
    value1: 78.5,
    value2: 29.7
  },
  {
    name: "Golddex",
    value1: 77.6,
    value2: 102.2
  },
  {
    name: "Isdom",
    value1: 69.8,
    value2: 22.6
  },
  {
    name: "Plusstrip",
    value1: 63.6,
    value2: 45.3
  },
  {
    name: "Kinnamplus",
    value1: 59.7,
    value2: 12.8
  },
  {
    name: "Zumgoity",
    value1: 54.3,
    value2: 19.6
  },
  {
    name: "Stanredtax",
    value1: 52.9,
    value2: 96.3
  },
  {
    name: "Conecom",
    value1: 42.9,
    value2: 11.9
  },
  {
    name: "Zencorporation",
    value1: 40.9,
    value2: 16.8
  },
  {
    name: "Iselectrics",
    value1: 39.2,
    value2: 9.9
  },
  {
    name: "Treequote",
    value1: 36.6,
    value2: 36.9
  },
  {
    name: "Sumace",
    value1: 34.8,
    value2: 14.6
  },
  {
    name: "Lexiqvolax",
    value1: 32.1,
    value2: 35.6
  },
  {
    name: "Sunnamplex",
    value1: 31.8,
    value2: 5.9
  },
  {
    name: "Faxquote",
    value1: 29.3,
    value2: 14.7
  },
  {
    name: "Donware",
    value1: 23.0,
    value2: 2.8
  },
  {
    name: "Warephase",
    value1: 21.5,
    value2: 12.1
  },
  {
    name: "Donquadtech",
    value1: 19.7,
    value2: 10.8
  },
  {
    name: "Nam-zim",
    value1: 15.5,
    value2: 4.1
  },
  {
    name: "Y-corporation",
    value1: 14.2,
    value2: 11.3
  }
];

series1.data.setAll(data);
series2.data.setAll(data);
xAxis.data.setAll(data);

// Animate chart and series in
// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
series1.appear(1000);
series2.appear(1000);
chart.appear(1000, 100);
}
}
