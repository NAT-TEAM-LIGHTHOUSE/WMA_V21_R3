import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';


import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";



@Component({
standalone : true,
imports : [],
  selector: 'app-compass-chart',
  templateUrl: './compass-chart.component.html',
  styleUrls: ['./compass-chart.component.scss'],
})
export class CompassChartComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="chartdiv";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
    // console.log("compass chart");
   }


  ngOnInit() {
    // this.id = "compassChart"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    // this.id="compassChart";
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


    // this.displayChart();
  }
displayChart(){ 
  let root = am5.Root.new(this.id);

root.setThemes([
  am5themes_Animated.new(root)
]);

let chart = root.container.children.push(
  am5radar.RadarChart.new(root, {
    panX: false,
    panY: false,
    startAngle: -90,
    endAngle: 270
  })
);

let axisRenderer = am5radar.AxisRendererCircular.new(root, {
  strokeOpacity: 1,
  strokeWidth: 5,
  minGridDistance: 10
});
axisRenderer.ticks.template.setAll({
  forceHidden: true
});
axisRenderer.grid.template.setAll({
  forceHidden: true
});

axisRenderer.labels.template.setAll({ forceHidden: true });

let xAxis = chart.xAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 0,
    min: 0,
    max: 360,
    strictMinMax: true,
    renderer: axisRenderer
  })
);

let axisDataItemN = xAxis.makeDataItem({ value: 0 });

let clockHandN = am5radar.ClockHand.new(root, {
  pinRadius: 0,
  radius: am5.percent(90),
  bottomWidth: 40
});

clockHandN.hand.set("fill", am5.color(0xff0000));
// do not change angle at all
clockHandN.adapters.add("rotation", function () {
  return -90;
});

axisDataItemN.set(
  "bullet",
  am5xy.AxisBullet.new(root, {
    sprite: clockHandN
  })
);

xAxis.createAxisRange(axisDataItemN);

//south
let axisDataItemS = xAxis.makeDataItem({ value: 180 });

let clockHandS = am5radar.ClockHand.new(root, {
  pinRadius: 0,
  radius: am5.percent(90),
  bottomWidth: 40
});

// do not change angle at all
clockHandS.adapters.add("rotation", function () {
  return 90;
});

axisDataItemS.set(
  "bullet",
  am5xy.AxisBullet.new(root, {
    sprite: clockHandS
  })
);

xAxis.createAxisRange(axisDataItemS);

function createLabel(text, value, tickOpacity) {
  let axisDataItem = xAxis.makeDataItem({ value: value });
  xAxis.createAxisRange(axisDataItem);
  let label:any = axisDataItem.get("label");
  label.setAll({
    text: text,
    forceHidden: false,
    inside: true,
    radius: 20
  });

  let tick = axisDataItem
    .get("tick")
    .setAll({
      forceHidden: false,
      strokeOpacity: tickOpacity,
      length: 12 * tickOpacity,
      visible: true,
      inside: true
    });
}

createLabel("N", 0, 1);
createLabel("NE", 45, 1);
createLabel("E", 90, 1);
createLabel("SE", 135, 1);
createLabel("S", 180, 1);
createLabel("SW", 225, 1);
createLabel("W", 270, 1);
createLabel("NW", 315, 1);

for (var i = 0; i < 360; i = i + 5) {
  createLabel("", i, 0.5);
}

setInterval(function () {
  let newAngle = Math.random() * 360;
  chart.animate({
    key: "startAngle",
    to: newAngle,
    duration: 1000,
    easing: am5.ease.out(am5.ease.cubic)
  });
  chart.animate({
    key: "endAngle",
    to: newAngle + 360,
    duration: 1000,
    easing: am5.ease.out(am5.ease.cubic)
  });
  axisDataItemN.animate({
    key: "value",
    to: am5.math.normalizeAngle(-90 - newAngle),
    duration: 1000,
    easing: am5.ease.out(am5.ease.cubic)
  });
  axisDataItemS.animate({
    key: "value",
    to: am5.math.normalizeAngle(90 - newAngle),
    duration: 1000,
    easing: am5.ease.out(am5.ease.cubic)
  });
}, 2000);

chart.appear(1000, 100);
}
}















