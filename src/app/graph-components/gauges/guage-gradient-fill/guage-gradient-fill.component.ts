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
  selector: 'app-guage-gradient-fill',
  templateUrl: './guage-gradient-fill.component.html',
  styleUrls: ['./guage-gradient-fill.component.scss'],
})
export class GuageGradientFillComponent implements OnInit {
  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    // alert("init");
    //  this.displayChart();
    this.id = "GuageGradient_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
// displayChart(){
//   let root = am5.Root.new(this.id);

// // Set themes
// // https://www.amcharts.com/docs/v5/concepts/themes/
// root.setThemes([
//   am5themes_Animated.new(root)
// ]);

// // Create chart
// // https://www.amcharts.com/docs/v5/charts/radar-chart/
// let chart = root.container.children.push(
//   am5radar.RadarChart.new(root, {
//     panX: false,
//     panY: false,
//     startAngle: 180,
//     endAngle: 360
//   })
// );

// // Create axis and its renderer
// // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
// let axisRenderer = am5radar.AxisRendererCircular.new(root, {
//   innerRadius: -10,
//   strokeOpacity: 1,
//   strokeWidth: 15,
//   strokeGradient: am5.LinearGradient.new(root, {
//     rotation: 0,
//     stops: [
//       { color: am5.color(0x19d228) },
//       { color: am5.color(0xf4fb16) },
//       { color: am5.color(0xf6d32b) },
//       { color: am5.color(0xfb7116) }
//     ]
//   })
// });

// let xAxis = chart.xAxes.push(
//   am5xy.ValueAxis.new(root, {
//     maxDeviation: 0,
//     min: 0,
//     max: 100,
//     strictMinMax: true,
//     renderer: axisRenderer
//   })
// );

// // Add clock hand
// // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
// let axisDataItem = xAxis.makeDataItem({});
// axisDataItem.set("value", 0);

// let bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
//   sprite: am5radar.ClockHand.new(root, {
//     radius: am5.percent(99)
//   })
// }));

// xAxis.createAxisRange(axisDataItem);

// axisDataItem.get("grid").set("visible", false);

// // setInterval(() => {
//   axisDataItem.animate({
//     key: "value",
//     to: Math.round(Math.random() * 100),
//     duration: 800,
//     // easing: am5.ease.out(am5.ease.cubic)
//   });
// // }, 2000);

// // Make stuff animate on load
// chart.appear(1000, 100);
// }
// }



displayChart(){
  let root = am5.Root.new(this.id);

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
    startAngle: 180,
    endAngle: 360
  })
);

// Create axis and its renderer
// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
let axisRenderer = am5radar.AxisRendererCircular.new(root, {
  innerRadius: -10,
  strokeOpacity: 1,
  strokeWidth: 15,
  strokeGradient: am5.LinearGradient.new(root, {
    rotation: 0,
    stops: [
      { color: am5.color(0x19d228) },
      { color: am5.color(0xf4fb16) },
      { color: am5.color(0xf6d32b) },
      { color: am5.color(0xfb7116) }
    ]
  })
});

let xAxis = chart.xAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 0,
    min: this.data[0].FROM_VAL,
    max: this.data[0].TO_VAL,
    strictMinMax: true,
    renderer: axisRenderer
  })
);

// Add clock hand
// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
let axisDataItem = xAxis.makeDataItem({});
axisDataItem.set("value", 0);

let bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
  sprite: am5radar.ClockHand.new(root, {
    radius: am5.percent(99)
  })
}));

xAxis.createAxisRange(axisDataItem);

axisDataItem.get("grid").set("visible", false);

// setInterval(() => {
  axisDataItem.animate({
    key: "value",
    to: this.data[0].Y1,
    duration: 800,
    easing: am5.ease.out(am5.ease.cubic)
  });
// }, 2000);

// Make stuff animate on load
chart.appear(1000, 100);
}
}