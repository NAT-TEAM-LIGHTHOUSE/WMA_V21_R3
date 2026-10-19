import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
standalone : true,
imports : [],
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent  implements OnInit {


  @Input() data: any;
   @Input() frame: any;
   id='';
   @Input() subData: Subject<any>;
  emitPass: any;
   
  constructor(private gloabalObject : GlobalObjectsService,  private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "pieChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
let chart = root.container.children.push(
  am5percent.PieChart.new(root, {
    endAngle: 270
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
let series = chart.series.push(
  am5percent.PieSeries.new(root, {
    valueField: "value",
    categoryField: "category",
    endAngle: 270
  })
);

series.states.create("hidden", {
  endAngle: -90
});


this.data = this.data.map(item => {
  return { 
     value:item.Y1,
     category:item.X1
       // Add a new 'status' property
  };
});


series.data.setAll(this.data);

series.events.on("click", ($event) => {
  // var dataItem = event.target.dataItem;
  // alert("Hello World");
  console.log($event);
  // console.log("Clicked on category:", dataItem.get(""));
})

// series.events.on("click", function (event) {
//   var dataItem = event.target.dataItem;

//   if (dataItem) {
//     console.log("Clicked on category:", dataItem.get(""));
//     console.log("Value:", dataItem.get(""));
//   }
// });




series.appear(1000, 100);





chart.events.on("click", function (event) {
  // Get the click coordinates relative to the chart
  var point = chart.toLocal(event.point);

  // X1 and Y1 values are the local coordinates
  var x1 = point.x;
  var y1 = point.y;

  console.log("X1:", x1);
  console.log("Y1:", y1);
});
  }
  

}
