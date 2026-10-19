import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-smoothed-stacked-area',
  templateUrl: './smoothed-stacked-area.component.html',
  styleUrls: ['./smoothed-stacked-area.component.scss'],
})
export class SmoothedStackedAreaComponent implements OnInit {

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
  wheelX: "panX",
  wheelY: "zoomX",
  pinchZoomX: true
}));


chart.set("colors", am5.ColorSet.new(root, {
  step: 2,
  colors: [
    am5.color(0x73556E),
    am5.color(0x9FA1A6),
    am5.color(0xF2AA6B),
    am5.color(0xF28F6B),
    am5.color(0xA95A52),
    am5.color(0xE35B5D),
    am5.color(0xFFA446)
  ]
}))


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "none"
}));
cursor.lineY.set("visible", false);


// The data
let data = [{
  "year": "2001",
  "cars": 1298,
  "motorcycles": 680,
  "bicycles": 101
}, {
  "year": "2002",
  "cars": 1275,
  "motorcycles": 664,
  "bicycles": 97
}, {
  "year": "2003",
  "cars": 1246,
  "motorcycles": 648,
  "bicycles": 93
}, {
  "year": "2004",
  "cars": 1318,
  "motorcycles": 697,
  "bicycles": 111
}, {
  "year": "2005",
  "cars": 1213,
  "motorcycles": 633,
  "bicycles": 87
}, {
  "year": "2006",
  "cars": 1199,
  "motorcycles": 521,
  "bicycles": 145
}, {
  "year": "2007",
  "cars": 1110,
  "motorcycles": 310,
  "bicycles": 91
}, {
  "year": "2008",
  "cars": 1165,
  "motorcycles": 425,
  "bicycles": 120
}, {
  "year": "2009",
  "cars": 1145,
  "motorcycles": 319,
  "bicycles": 102
}, {
  "year": "2010",
  "cars": 1163,
  "motorcycles": 201,
  "bicycles": 145
}, {
  "year": "2011",
  "cars": 1180,
  "motorcycles": 285,
  "bicycles": 100
}, {
  "year": "2012",
  "cars": 1159,
  "motorcycles": 255,
  "bicycles": 122
}];


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "year",
  startLocation: 0.5,
  endLocation: 0.5,
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true,
    minGridDistance: 70
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/

function createSeries(name, field) {
  let series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
    name: name,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: field,
    categoryXField: "year",
    stacked: true,
    stroke: am5.color(0xffffff),
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: "[bold]{name}[/]\n{categoryX}: {valueY}"
    })
  }));

  series.strokes.template.setAll({
    strokeWidth: 4,
    strokeOpacity: 1,
    shadowBlur: 2,
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    shadowColor: am5.color(0x000000),
    shadowOpacity: 0.1
  })

  series.fills.template.setAll({
    fillOpacity: 1,
    visible: true,

    fillPattern: am5.GrainPattern.new(root, {
      maxOpacity: 0.15,
      density: 0.5,
      colors: [am5.color(0x000000), am5.color(0x000000), am5.color(0xffffff)]
    })

  });

  series.data.setAll(data);
  series.appear(1000);
}

createSeries("Cars", "cars");
createSeries("Motorcycles", "motorcycles");
createSeries("Bicycles", "bicycles");

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
  }
}
