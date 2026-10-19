import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
standalone : true,
imports : [],
  selector: 'app-pie-chart-with-legend',
  templateUrl: './pie-chart-with-legend.component.html',
  styleUrls: ['./pie-chart-with-legend.component.scss'],
})
export class PieChartWithLegendComponent  implements OnInit {


  @Input() data: any;
   @Input() frame: any;
   id="";
   @Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService,  private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "pieChartLegend_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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

let root = am5.Root.new(this.id);


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
let chart = root.container.children.push(am5percent.PieChart.new(root, {
  layout: root.verticalLayout
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
let series = chart.series.push(am5percent.PieSeries.new(root, {
  valueField: "Y1",
  categoryField: "X1"
}));


// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
series.data.setAll(this.data);


// Create legend
// https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
let legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.percent(50),
  x: am5.percent(50),
  marginTop: 15,
  marginBottom: 15
}));

legend.data.setAll(series.dataItems);


// Play initial series animation
// https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
series.appear(1000, 100);
}
}
