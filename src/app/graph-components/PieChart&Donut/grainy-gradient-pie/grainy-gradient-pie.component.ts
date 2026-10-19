import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Subject } from 'rxjs';

@Component({
standalone : true,
imports : [],
  selector: 'app-grainy-gradient-pie',
  templateUrl: './grainy-gradient-pie.component.html',
  styleUrls: ['./grainy-gradient-pie.component.scss'],
})
export class GrainyGradientPieComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;


  constructor(private gloabalObject : GlobalObjectsService, private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "grainyGradient_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
let chart = root.container.children.push(
  am5percent.PieChart.new(root, {
    endAngle: 270,
    layout:root.verticalLayout,
    innerRadius: am5.percent(60)
  })
);
/*
let bg = root.container.set("background", am5.Rectangle.new(root, {
  fillPattern: am5.GrainPattern.new(root, {
    density: 0.1,
    maxOpacity: 0.2
  })
}))

*/

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
let series = chart.series.push(
  am5percent.PieSeries.new(root, {
    valueField: "value",
    categoryField: "category",
    endAngle: 270
  })
);
this.data = this.data.map(item => {
  return { 
     value:item.Y1,
     category:item.X1
       // Add a new 'status' property
  };
});
series.set("colors", am5.ColorSet.new(root, {
  colors: [
    am5.color(0x73556E),
    am5.color(0x9FA1A6),
    am5.color(0xF2AA6B),
    am5.color(0xF28F6B),
    am5.color(0xA95A52),
    am5.color(0xE35B5D),
    am5.color(0xFFA446)
  ]
}))

let gradient = am5.RadialGradient.new(root, {
  stops: [
    { color: am5.color(0x000000) },
    { color: am5.color(0x000000) },
    {}
  ]
})

series.slices.template.setAll({
  fillGradient: gradient,
  strokeWidth: 2,
  stroke: am5.color(0xffffff),
  cornerRadius: 10,
  shadowOpacity: 0.1,
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  shadowColor: am5.color(0x000000),
  fillPattern: am5.GrainPattern.new(root, {
    maxOpacity: 0.2,
    density: 0.5,
    colors: [am5.color(0x000000)]
  })
})

series.slices.template.states.create("hover", {
  shadowOpacity: 1,
  shadowBlur: 10
})

series.ticks.template.setAll({
   strokeOpacity:0.4,
strokeDasharray:[2,2]
})

series.states.create("hidden", {
  endAngle: -90
});

// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
series.data.setAll(this.data);

let legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.percent(50),
  x: am5.percent(50),
  marginTop: 15,
  marginBottom: 15,
}));
legend.markerRectangles.template.adapters.add("fillGradient", function() {
  return undefined;
})
legend.data.setAll(series.dataItems);

series.appear(1000, 100);

  }

}
