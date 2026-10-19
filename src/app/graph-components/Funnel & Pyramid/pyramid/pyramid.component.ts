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
  selector: 'app-pyramid',
  templateUrl: './pyramid.component.html',
  styleUrls: ['./pyramid.component.scss'],
})
export class PyramidComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController,  private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "pyramidChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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


displayChart(){
 // this.setData();
  /* Chart code */
// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
let root = am5.Root.new(this.id);


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/
let chart = root.container.children.push(am5percent.SlicedChart.new(root, {
  layout: root.verticalLayout
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/#Series
let series = chart.series.push(am5percent.PyramidSeries.new(root, {
  orientation: "vertical",
  valueField: "Y1",
  categoryField: "X1"
}));




series.data.setAll(this.data.reverse());

// Play initial series animation
// https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
series.appear();


// Create legend
// https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
let legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.percent(50),
  x: am5.percent(50),
  marginTop: 15,
  marginBottom: 15
}));

legend.data.setAll(am5.array.copy(series.dataItems).reverse());


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
}

}
