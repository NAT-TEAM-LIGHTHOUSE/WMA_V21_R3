import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Subject } from 'rxjs';

@Component({
standalone : true,
imports : [],
  selector: 'app-simple-pie-chart',
  templateUrl: './simple-pie-chart.component.html',
  styleUrls: ['./simple-pie-chart.component.scss'],
})
export class SimplePieChartComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;
  
  constructor(private gloabalObject : GlobalObjectsService,  private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "simplePieChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
      valueField: "value",
      categoryField: "category"
    }));
    
    this.data = this.data.map(item => {
      return { 
         value:item.Y1,
         category:item.X1
           // Add a new 'status' property
      };
    });
    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    series.data.setAll(this.data);
    
    
    // Play initial series animation
    // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
    series.appear(1000, 100);



   
  }

}
