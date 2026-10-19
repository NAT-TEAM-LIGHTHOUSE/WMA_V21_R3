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
  selector: 'app-animated-bullet-end-series',
  templateUrl: './animated-bullet-end-series.component.html',
  styleUrls: ['./animated-bullet-end-series.component.scss'],
})
export class AnimatedBulletEndSeriesComponent implements OnInit {

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
  pinchZoomX:true,
  paddingLeft: 0
}));

chart.get("colors").set("step", 3);


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  maxDeviation: 0.3,
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true,
    minGridDistance: 70
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  renderer: am5xy.AxisRendererY.new(root, {})
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.LineSeries.new(root, {
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  valueXField: "date",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueY}"
  })
}));
series.strokes.template.setAll({
  strokeWidth: 2,
  strokeDasharray: [3, 3]
});

// Create animating bullet by adding two circles in a bullet container and
// animating radius and opacity of one of them.
series.bullets.push(function(root, series, dataItem:any) {  
  if (dataItem.dataContext.bullet) {    
    let container = am5.Container.new(root, {});
    let circle0 = container.children.push(am5.Circle.new(root, {
      radius: 5,
      fill: am5.color(0xff0000)
    }));
    let circle1 = container.children.push(am5.Circle.new(root, {
      radius: 5,
      fill: am5.color(0xff0000)
    }));

    circle1.animate({
      key: "radius",
      to: 20,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic),
      loops: Infinity
    });
    circle1.animate({
      key: "opacity",
      to: 0,
      from: 1,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic),
      loops: Infinity
    });

    return am5.Bullet.new(root, {
      sprite: container
    })
  }
  return null;
})

// Set data
let data = [{
  date: new Date(2021, 5, 12).getTime(),
  value: 50
}, {
  date: new Date(2021, 5, 13).getTime(),
  value: 53
}, {
  date: new Date(2021, 5, 14).getTime(),
  value: 56
}, {
  date: new Date(2021, 5, 15).getTime(),
  value: 52
}, {
  date: new Date(2021, 5, 16).getTime(),
  value: 48
}, {
  date: new Date(2021, 5, 17).getTime(),
  value: 47
}, {
  date: new Date(2021, 5, 18).getTime(),
  value: 59,
  bullet: true
}]

series.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);
  }
}
