import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Platform, PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-step-count-chart',
  templateUrl: './step-count-chart.component.html',
  styleUrls: ['./step-count-chart.component.scss'],
})
export class StepCountChartComponent  implements OnInit {

 
  @Input() data: any;
  @Input() frame: any;
  id=""
doubleLineFlag = true;
@Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService,public platform: Platform,private PopoverController: PopoverController,  private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "stepCountChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
    //console.log(this.data)
  
  }

  displayChart(){
    let root = am5.Root.new(this.id);
  
  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  root.dateFormatter.setAll({
    dateFormat: "yyyy-MM-dd",
    dateFields: ["valueX"]
  });
  




  let data:any=[];
for(let i=0;i<this.data.length;i++){
  let dateObj={
     date:this.gloabalObject.formatDate(getSuitableDateFormat(this.data[i].D1), "yyyy-MM-dd"),
     steps:this.data[i].Y1
  }
  data.push(dateObj);
}

// data=[{"date":"2023-01-10","steps":1000},
// {"date":"2023-01-11","steps":2000},
// {"date":"2023-01-12","steps":3000},
// {"date":"2023-01-13","steps":4000},
// {"date":"2023-01-14","steps":5000},
// {"date":"2023-01-15","steps":6000},
// {"date":"2023-01-16","steps":7000},
// {"date":"2023-01-17","steps":8000},
// {"date":"2023-01-18","steps":9000},
// {"date":"2023-01-19","steps":10000},
// {"date":"2023-01-20","steps":11000},
// {"date":"2023-01-21","steps":12000}]

console.log("final Data steps count: "+JSON.stringify(data));

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
  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      focusable: true,
      panX: true,
      panY: false,
      wheelX: "panX",
      wheelY: "none",
      paddingLeft: 0,
      paddingRight: 0
    })
  );
  
  let easing = am5.ease.linear;
  
  // hide zoomout button
  chart.zoomOutButton.set("forceHidden", true);
  
  // add label
  chart.plotContainer.children.push(
    am5.Label.new(root, { text: "Pan chart to change date", x: 100, y: 50 })
  );
  
  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  let xRenderer = am5xy.AxisRendererX.new(root, {
    minGridDistance: 50,
    strokeOpacity: 0.2,
    minorGridEnabled: true
  });
  xRenderer.grid.template.set("forceHidden", true);
  
  let xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      maxDeviation: 0.49,
      snapTooltip: false,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    })
  );
  
  let yRenderer = am5xy.AxisRendererY.new(root, { inside: true });
  yRenderer.grid.template.set("forceHidden", true);
  
  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      renderer: yRenderer
    })
  );
  
  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  let series:any = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "steps",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "vertical",
        labelText: "{valueY}"
      })
    })
  );
  
  series.columns.template.setAll({
    cornerRadiusTL: 15,
    cornerRadiusTR: 15,
    maxWidth: 30,
    strokeOpacity: 0
  });
  
  series.columns.template.adapters.add("fill", function (fill, target:any) {
    if (target.dataItem.get("valueY") < 6000) {
      return am5.color(0xdadada);
    }
    return fill;
  });
  
  // Set up data processor to parse string dates
  // https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
  series.data.processor = am5.DataProcessor.new(root, {
    dateFormat: "yyyy-MM-dd",
    dateFields: ["date"]
  });
  
  series.data.setAll(data);
  
  // do not allow tooltip  to move horizontally
  series.get("tooltip").adapters.add("x", function (x) {
    return chart.plotContainer.toGlobal({
      x: chart.plotContainer.width() / 2,
      y: 0
    }).x;
  });
  
  // add ranges
  let goalRange = yAxis.createAxisRange(yAxis.makeDataItem({
    value: 6000
  }));
  
  goalRange.get("grid").setAll({
    forceHidden: false,
    strokeOpacity: 0.2
  });
  
  let goalLabel = goalRange.get("label");
  
  goalLabel.setAll({
    centerY: am5.p100,
    centerX: am5.p100,
    text: "Goal"
  });
  
  // put to other side
  goalLabel.adapters.add("x", function (x) {
    return chart.plotContainer.width();
  });
  
  let goalRange2 = yAxis.createAxisRange(yAxis.makeDataItem({
    value: 12000
  }));
  
  goalRange2.get("grid").setAll({
    forceHidden: false,
    strokeOpacity: 0.2
  });
  
  let goalLabel2 = goalRange2.get("label");
  
  goalLabel2.setAll({
    centerY: am5.p100,
    centerX: am5.p100,
    text: "2 x Goal"
  });
  
  // put to other side
  goalLabel2.adapters.add("x", function (x) {
    return chart.plotContainer.width();
  });
  
  // reposition when width changes
  chart.plotContainer.onPrivate("width", function () {
    goalLabel.markDirtyPosition();
    goalLabel2.markDirtyPosition();
  });
  
  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    alwaysShow: true,
    behavior: "none",
    positionX: 0.5 // make it always be at the center
  }));
  cursor.lineY.set("visible", false);
  
  // zoom to last 11 days
  series.events.on("datavalidated", function () {
    let toTime =
      series.dataItems[series.dataItems.length - 1].get("valueX") +
      am5.time.getDuration("day", 1);
    let fromTime = series.dataItems[series.dataItems.length - 9].get("valueX");
  
    xAxis.zoomToValues(fromTime, toTime);
  });
  
  // when plot are is released, round zoom to nearest days
  chart.plotContainer.events.on("globalpointerup", function () {
    let dayDuration = am5.time.getDuration("day", 1);
  
    let firstTime = am5.time
      .round(new Date(series.dataItems[0].get("valueX")), "day", 1)
      .getTime();
    let lastTime =
      series.dataItems[series.dataItems.length - 1].get("valueX") + dayDuration;
    let totalTime = lastTime - firstTime;
    let days = totalTime / dayDuration;
  
    let roundedStart =
      firstTime + Math.round(days * xAxis.get("start")) * dayDuration;
    let roundedEnd =
      firstTime + Math.round(days * xAxis.get("end")) * dayDuration;
  
    xAxis.zoomToValues(roundedStart, roundedEnd);
  });
  
  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  chart.appear(1000, 50);
  }
  


}
