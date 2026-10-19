import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
@Component({
standalone : true,
imports : [],
  selector: 'app-variable-radius-pie-chart',
  templateUrl: './variable-radius-pie-chart.component.html',
  styleUrls: ['./variable-radius-pie-chart.component.scss'],
})
export class VariableRadiusPieChartComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;

 constructor(private gloabalObject : GlobalObjectsService, private ngZone:NgZone) { }

 ngOnInit() {
   this.id = "variableRadiusPieChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
   this.gloabalObject.chartId++;
   setTimeout(() => {
     this.ngZone.runOutsideAngular(() => {
       this.data =  this.frame.chartData; 
     this.displayChart();
     })
   }, 100);   




   console.log(this.data);
   this.subData.subscribe(data => {
     this.data = data;
     this.displayChart();
   })

 }




displayChart(){






 let root = am5.Root.new(this.id);

 // Set themes
 root.setThemes([
   am5themes_Animated.new(root)
 ]);
 
 let chart = root.container.children.push(am5percent.PieChart.new(root, {
   layout: root.verticalLayout
 }));
 

 let series = chart.series.push(am5percent.PieSeries.new(root, {
   alignLabels: true,
   calculateAggregates: true,
   valueField: "Y1",
   categoryField: "X1"
 }));
 series.slices.template.setAll({
   strokeWidth: 3,
   stroke: am5.color(0xffffff)
 });
 
 series.labelsContainer.set("paddingTop", 30)
 
 series.slices.template.adapters.add("radius", function (radius: number, target: any) {
   let dataItem = target.dataItem;
   let high = series.getPrivate("valueHigh");
   if (dataItem) {
     let valueWorking: number = dataItem.get("valueWorking", 0);
     return radius * valueWorking / high;
   }
   return radius;
 });
 
 // Set data
 series.data.setAll(this.data);
 
 // Create legend
 let legend = chart.children.push(am5.Legend.new(root, {
   centerX: am5.p50,
   x: am5.p50,
   marginTop: 15,
   marginBottom: 15
 }));
 
 legend.data.setAll(series.dataItems);
 
 series.appear(1000, 100);



}



}
