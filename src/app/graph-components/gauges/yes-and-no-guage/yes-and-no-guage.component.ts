import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';

import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
@Component({
standalone : true,
imports : [],
  selector: 'app-yes-and-no-guage',
  templateUrl: './yes-and-no-guage.component.html',
  styleUrls: ['./yes-and-no-guage.component.scss'],
})
export class YesAndNoGuageComponent implements OnInit {
  
  
  
  
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
let chart = root.container.children.push(am5radar.RadarChart.new(root, {
  panX: false,
  panY: false,
  startAngle: 180,
  endAngle: 360
}));


// Create axis and its renderer
// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
let axisRenderer = am5radar.AxisRendererCircular.new(root, {
  innerRadius: -30,
  strokeOpacity: 0.1
});

axisRenderer.labels.template.set("forceHidden", true);
axisRenderer.grid.template.set("forceHidden", true);

let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0,
  min: 0,
  max: 1,
  strictMinMax: true,
  renderer: axisRenderer
}));


// add yes and no labels
let yesDataItem = xAxis.makeDataItem({});
yesDataItem.set("value", 0);
yesDataItem.set("endValue", 0.5);
xAxis.createAxisRange(yesDataItem);
yesDataItem.get("label").setAll({text: "YES", forceHidden:false});
yesDataItem.get("axisFill").setAll({visible:true, fillOpacity:1, fill:root.interfaceColors.get("positive")});

let noDataItem = xAxis.makeDataItem({});
noDataItem.set("value", 1);
noDataItem.set("endValue", 0.5);
xAxis.createAxisRange(noDataItem);
noDataItem.get("label").setAll({text: "NO", forceHidden:false});
noDataItem.get("axisFill").setAll({visible:true, fillOpacity:1, fill:root.interfaceColors.get("negative")});

// Add clock hand
// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
let axisDataItem = xAxis.makeDataItem({});
axisDataItem.set("value", 0.25);

let bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
  sprite: am5radar.ClockHand.new(root, {
    radius: am5.percent(99)
  })
}));

xAxis.createAxisRange(axisDataItem);

axisDataItem.get("grid").set("visible", false);

let value = 0.25;
setInterval(function() {
  if (value == 0.25) {
    value = 0.75;
  }
  else {
    value = 0.25;
  }

  axisDataItem.animate({
    key: "value",
    to: value,
    duration: 800,
    easing: am5.ease.out(am5.ease.cubic)
  });
}, 2000);


// Make stuff animate on load
chart.appear(1000, 100);
  }
}
