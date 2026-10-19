import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-funnel-gradient-fill',
  templateUrl: './funnel-gradient-fill.component.html',
  styleUrls: ['./funnel-gradient-fill.component.scss'],
})
export class FunnelGradientFillComponent  implements OnInit {

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
root.setThemes([am5themes_Animated.new(root)]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/
let chart = root.container.children.push(
  am5percent.SlicedChart.new(root, {
    layout: root.verticalLayout
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/#Series
let series = chart.series.push(
  am5percent.FunnelSeries.new(root, {
    alignLabels: false,
    orientation: "vertical",
    valueField: "value",
    categoryField: "category"
  })
);

// make fills gradients
series.slices.template.setAll({
  strokeOpacity: 0,
  fillGradient: am5.LinearGradient.new(root, {
    // rotation: 0,
    stops: [{ brighten: -0.4 }, { brighten: 0.4 }, { brighten: -0.4 }]
  })
});

// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/#Setting_data
series.data.setAll([
  { value: 10, category: "One" },
  { value: 9, category: "Two" },
  { value: 6, category: "Three" },
  { value: 5, category: "Four" },
  { value: 4, category: "Five" },
  { value: 3, category: "Six" },
  { value: 1, category: "Seven" }
]);

// Play initial series animation
// https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
series.appear();

// Create legend
// https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
let legend = chart.children.push(
  am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50,
    marginTop: 15,
    marginBottom: 15
  })
);

legend.data.setAll(series.dataItems);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
  }

}
