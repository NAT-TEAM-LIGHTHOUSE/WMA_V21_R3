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
  selector: 'app-multi-part-gauge',
  templateUrl: './multi-part-gauge.component.html',
  styleUrls: ['./multi-part-gauge.component.scss'],
})
export class MultiPartGaugeComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="chartdiv";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    alert("init");
    // this.id = "compassChart"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    this.displayChart();
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
    alert("this.id : "+this.id);
    let root = am5.Root.new(this.id); 

root.setThemes([
  am5themes_Animated.new(root)
]);

let chart = root.container.children.push(
  am5radar.RadarChart.new(root, {
    panX: false,
    panY: false,
    radius: am5.percent(90),
    innerRadius: -20
  })
);

function createAxis(min, max, start, end, color) {
  let axisRenderer = am5radar.AxisRendererCircular.new(root, {
    strokeOpacity: 0.1,
    minGridDistance: 30,
    startAngle: start,
    endAngle: end,
    stroke: color
  });

  axisRenderer.ticks.template.setAll({
    visible: true,
    strokeOpacity: 0.8,
    stroke: color
  });

  axisRenderer.grid.template.setAll({
    visible: false
  });

  let axis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: min,
      max: max,
      strictMinMax: true,
      renderer: axisRenderer
    })
  );
  

  let rangeDataItem = axis.makeDataItem({
    value: min,
    endValue: max
  });

  let range = axis.createAxisRange(rangeDataItem);
  
  rangeDataItem.get("axisFill").setAll({
    visible: true,
    fill: color,
    fillOpacity: 0.8,
    stroke: color,
    strokeOpacity: 0.8,
    strokeWidth: 1
  });
  
  rangeDataItem.get("tick").setAll({
    visible: false
  });
  
  return axis;
}

function createHand(axis) {
  let color = axis.get("renderer").get("stroke");
  let handDataItem = axis.makeDataItem({
    value: 0
  });

  let hand = handDataItem.set("bullet", am5xy.AxisBullet.new(root, {
    sprite: am5radar.ClockHand.new(root, {
      radius: am5.percent(90),
      innerRadius: am5.percent(70)
    })
  }));
  
  hand.get("sprite").pin.setAll({
    forceHidden: true
  });

  hand.get("sprite").hand.setAll({
    fill: color,
    fillOpacity: 0.9
  });

  axis.createAxisRange(handDataItem);
  
  return hand;
}

let axis1 = createAxis(0, 100, -85, -5, am5.color(0xEF6F6C));
let axis2 = createAxis(0, 200, 5, 85, am5.color(0x426A5A));
let axis3 = createAxis(0, 20, 95, 175, am5.color(0x7FB685));
let axis4 = createAxis(0, 100, 185, 265, am5.color(0xDDAE7E));

let hand1 = createHand(axis1);
let hand2 = createHand(axis2);
let hand3 = createHand(axis3);
let hand4 = createHand(axis4);

setInterval(function() {
  hand1.get("sprite").dataItem.animate({
    key: "value",
    to: Math.random() * hand1.axis.get("max"),
    duration: 800,
    easing: am5.ease.out(am5.ease.cubic)
  });
  
  hand2.get("sprite").dataItem.animate({
    key: "value",
    to: Math.random() * hand2.axis.get("max"),
    duration: 800,
    easing: am5.ease.out(am5.ease.cubic)
  });
  
  hand3.get("sprite").dataItem.animate({
    key: "value",
    to: Math.random() * hand3.axis.get("max"),
    duration: 800,
    easing: am5.ease.out(am5.ease.cubic)
  });
  
  hand4.get("sprite").dataItem.animate({
    key: "value",
    to: Math.random() * hand4.axis.get("max"),
    duration: 800,
    easing: am5.ease.out(am5.ease.cubic)
  });
}, 2000);
  }

}
