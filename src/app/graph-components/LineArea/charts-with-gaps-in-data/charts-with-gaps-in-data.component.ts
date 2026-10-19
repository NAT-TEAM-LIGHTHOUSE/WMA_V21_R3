import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CommonModule } from '@angular/common';
@Component({
standalone : true,
imports : [CommonModule],
  selector: 'app-charts-with-gaps-in-data',
  templateUrl: './charts-with-gaps-in-data.component.html',
  styleUrls: ['./charts-with-gaps-in-data.component.scss'],
})
export class ChartsWithGapsInDataComponent implements OnInit {

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

root.dateFormatter.setAll({
  dateFormat: "yyyy",
  dateFields: ["valueX"]
});

let data = [{
  "year": "1950",
  "value": -0.307
}, {
  "year": "1951",
  "value": -0.168
}, {
  "year": "1952",
  "value": -0.073
}, {
  "year": "1953",
  "value": -0.027
}, {
  "year": "1954",
  "value": -0.251
}, {
  "year": "1955",
  "value": -0.281
}, {
  "year": "1956",
  "value": -0.348
}, {
  "year": "1957",
  "value": -0.074
}, {
  "year": "1958",
  "value": -0.011
}, {
  "year": "1959",
  "value": -0.074
}, {
  "year": "1960",
  "value": -0.124
}, {
  "year": "1961",
  "value": -0.024
}, {
  "year": "1962",
  "value": -0.022
}, {
  "year": "1963",
  "value": 0
}, {
  "year": "1964",
  "value": -0.296
}, {
  "year": "1965",
  "value": -0.217
}, {
  "year": "1966",
  "value": -0.147
}, {
  "year": "1967"
}, {
  "year": "1971",
  "value": -0.19
}, {
  "year": "1972",
  "value": -0.056
}, {
  "year": "1973",
  "value": 0.077
}, {
  "year": "1974",
  "value": -0.213
}, {
  "year": "1975",
  "value": -0.17
}, {
  "year": "1976",
  "value": -0.254
}, {
  "year": "1977",
  "value": 0.019
}, {
  "year": "1978",
  "value": -0.063
}, {
  "year": "1979",
  "value": 0.05
}, {
  "year": "1980",
  "value": 0.077
}, {
  "year": "1981",
  "value": 0.12
}, {
  "year": "1982",
  "value": 0.011
}, {
  "year": "1983",
  "value": 0.177
}, {
  "year": "1984"
}, {
  "year": "1989",
  "value": 0.104
}, {
  "year": "1990",
  "value": 0.255
}, {
  "year": "1991",
  "value": 0.21
}, {
  "year": "1992",
  "value": 0.065
}, {
  "year": "1993",
  "value": 0.11
}, {
  "year": "1994",
  "value": 0.172
}, {
  "year": "1995",
  "value": 0.269
}, {
  "year": "1996",
  "value": 0.141
}, {
  "year": "1997",
  "value": 0.353
}, {
  "year": "1998",
  "value": 0.548
}, {
  "year": "1999",
  "value": 0.298
}, {
  "year": "2000",
  "value": 0.267
}, {
  "year": "2001",
  "value": 0.411
}, {
  "year": "2002",
  "value": 0.462
}, {
  "year": "2003",
  "value": 0.47
}, {
  "year": "2004",
  "value": 0.445
}, {
  "year": "2005",
  "value": 0.47
}];


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  focusable: true,
  panX: true,
  panY: true,
  wheelX: "panX",
  wheelY: "zoomX",
  pinchZoomX:true,
  paddingLeft: 0
}));

let easing = am5.ease.linear;


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  maxDeviation: 0.5,
  baseInterval: {
    timeUnit: "year",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minGridDistance: 50,
    pan:"zoom",
    minorGridEnabled: true
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 1,
  renderer: am5xy.AxisRendererY.new(root, {pan:"zoom"})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
  minBulletDistance: 10,
  connect: false,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  valueXField: "year",
  tooltip: am5.Tooltip.new(root, {
    pointerOrientation: "horizontal",
    labelText: "{valueY}"
  })
}));

series.fills.template.setAll({ fillOpacity: 0.2, visible: true });

// Add series axis range for a different stroke/fill
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/#Series_axis_ranges
let rangeDataItem = yAxis.makeDataItem({
  value: 0,
  endValue: 1000
});

let color = chart.get("colors").getIndex(3);

let range = series.createAxisRange(rangeDataItem);

range.strokes.template.setAll({
  stroke: color
});

range.fills.template.setAll({
  fill: color,
  fillOpacity: 0.2,
  visible: true
});


// Set up data processor to parse string dates
// https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
series.data.processor = am5.DataProcessor.new(root, {
  dateFormat: "yyyy",
  dateFields: ["year"]
});

series.data.setAll(data);

series.bullets.push(function() {
  let circle = am5.Circle.new(root, {
    radius: 4,
    fill: series.get("fill"),
    stroke: root.interfaceColors.get("background"),
    strokeWidth: 2
  })

  circle.adapters.add("fill", function(fill, target) {
    let dataItem:any = circle.dataItem;
    if (dataItem.get("valueY") >= 0) {
      return color;
    }
    return fill
  })

  return am5.Bullet.new(root, {
    sprite: circle
  })
});


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis
}));
cursor.lineY.set("visible", false);

// add scrollbar
chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
  }
}
