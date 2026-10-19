import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular/standalone';
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
  selector: 'app-date-based-data',
  templateUrl: './date-based-data.component.html',
  styleUrls: ['./date-based-data.component.scss'],
})
export class DateBasedDataComponent implements OnInit {


    @Input() data: any;
  @Input() frame: any;
  id="";
  doubleLineFlag = false
  @Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService,public platform: Platform,private PopoverController: PopoverController,private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "dateBaseData_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    this.gloabalObject.chartId++;
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        this.data =  this.frame.chartData; 
      this.displayChart()
      })
    }, 100);

    this.subData.subscribe(data => {
      this.data = data;
      this.displayChart();
    })

  }


async closeModal() {
  await this.PopoverController.dismiss();
}



displayChart(){
  let root = am5.Root.new(this.id);


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

root.dateFormatter.setAll({
  dateFormat: "yyyy",
  dateFields: ["valueX"]
});



let data:any=[];
for(let i=0;i<this.data.length;i++){
  let dateObj={
     date:this.gloabalObject.formatDate(getSuitableDateFormat(this.data[i].D1), "yyyy-MM-dd"),
     value:this.data[i].Y1
  }
  data.push(dateObj);
}

// data=[{"date":"2023-01-10","value":6000},
// {"date":"2023-01-11","value":7000},
// {"date":"2023-01-12","value":7500},
// {"date":"2023-01-13","value":9000},
// {"date":"2023-01-14","value":8500},
// {"date":"2023-01-15","value":7700},
// {"date":"2023-01-16","value":6000},
// {"date":"2023-01-17","value":6900},
// {"date":"2023-01-18","value":5100},
// {"date":"2023-01-19","value":9700},
// {"date":"2023-01-20","value":3200},
// {"date":"2023-01-21","value":5400}]
console.log("final Date Based Data : "+JSON.stringify(data));


function getSuitableDateFormat(dateString){
  const parts = dateString.split("-");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const dateObject = new Date(year, month, day);
  return dateObject;
}

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
  maxDeviation: 0.1,
  groupData: false,
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
  maxDeviation: 0.2,
  renderer: am5xy.AxisRendererY.new(root, {})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.LineSeries.new(root, {
  minBulletDistance: 10,
  connect: false,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  valueXField: "date",
  tooltip: am5.Tooltip.new(root, {
    pointerOrientation: "horizontal",
    labelText: "{valueY}"
  })
}));

series.fills.template.setAll({
  fillOpacity: 0.2,
  visible: true
});

series.strokes.template.setAll({
  strokeWidth: 2
});


// Set up data processor to parse string dates
// https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
series.data.processor = am5.DataProcessor.new(root, {
  dateFormat: "yyyy-MM-dd",
  dateFields: ["date"]
});

series.data.setAll(data);

series.bullets.push(function() {
  let circle = am5.Circle.new(root, {
    radius: 4,
    fill: root.interfaceColors.get("background"),
    stroke: series.get("fill"),
    strokeWidth: 2
  })

  return am5.Bullet.new(root, {
    sprite: circle
  })
});


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis,
  behavior: "none"
}));
cursor.lineY.set("visible", false);

// add scrollbar
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
}
}
