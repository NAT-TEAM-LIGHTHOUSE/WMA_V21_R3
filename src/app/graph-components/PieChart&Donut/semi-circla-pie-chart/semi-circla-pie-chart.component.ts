import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
standalone : true,
imports : [],
  selector: 'app-semi-circla-pie-chart',
  templateUrl: './semi-circla-pie-chart.component.html',
  styleUrls: ['./semi-circla-pie-chart.component.scss'],
})
export class SemiCirclaPieChartComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id ="";
  @Input() subData: Subject<any>;

 constructor(private gloabalObject : GlobalObjectsService,  private ngZone:NgZone) { }

 ngOnInit() {
   this.id = "semiCirclePieChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
 // start and end angle must be set both for chart and series
 let chart = root.container.children.push(am5percent.PieChart.new(root, {
   startAngle: 180,
   endAngle: 360,
   layout: root.verticalLayout,
   innerRadius: am5.percent(50)
 }));
 
 // Create series
 // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
 // start and end angle must be set both for chart and series
 let series = chart.series.push(am5percent.PieSeries.new(root, {
   startAngle: 180,
   endAngle: 360,
   valueField: "Y1",
   categoryField: "X1",
   alignLabels: false
 }));
 
 series.states.create("hidden", {
   startAngle: 180,
   endAngle: 180
 });
 
 series.slices.template.setAll({
   cornerRadius: 5
 });
 
 series.ticks.template.setAll({
   forceHidden: true
 });
//   let showData:any=[];


// for(let i=0;i<this.data.length;i++){
//   let showDataObj={
//         value:this.data[i].Y1,
//         category:this.data[i].X1
//   }
//   showData.push(showDataObj);
// }
 // Set data
 // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
 series.data.setAll(this.data);
 
 series.appear(1000, 100);








}
}
