import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
standalone : true,
imports : [],
  selector: 'app-donut-with-radial-gradient',
  templateUrl: './donut-with-radial-gradient.component.html',
  styleUrls: ['./donut-with-radial-gradient.component.scss'],
})
export class DonutWithRadialGradientComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id=""
  @Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService,private ngZone:NgZone) { }

  ngOnInit() {
    
    this.id = "donutRadialGradient_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    this.gloabalObject.chartId++;
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        this.data =  this.frame.chartData; 
      this.displayChart() 
    });
    }, 1000);

    
    this.subData.subscribe(data => {
      this.data = data;
      this.displayChart();
    })

  }


displayChart(){
  // this.setData();
let root = am5.Root.new(this.id);

root.setThemes([
  am5themes_Animated.new(root)
]);

let chart = root.container.children.push(am5percent.PieChart.new(root, {
  radius: am5.percent(90),
  innerRadius: am5.percent(50),
  layout: root.horizontalLayout
}));

let series = chart.series.push(am5percent.PieSeries.new(root, {
  name: "Series",
  valueField: "Y1",
  categoryField: "X1"
}));

series.data.setAll(this.data);
// Disabling labels and ticks
series.labels.template.set("visible", false);
series.ticks.template.set("visible", false);

// Adding gradients
series.slices.template.set("strokeOpacity", 0);
series.slices.template.set("fillGradient", am5.RadialGradient.new(root, {
  stops: [{
    brighten: -0.8
  }, {
    brighten: -0.8
  }, {
    brighten: -0.5
  }, {
    brighten: 0
  }, {
    brighten: -0.5
  }]
}));

let legend = chart.children.push(am5.Legend.new(root, {
  centerY: am5.percent(50),
  y: am5.percent(50),
  layout: root.verticalLayout
}));
legend.valueLabels.template.setAll({ textAlign: "right" })
legend.labels.template.setAll({ 
  maxWidth: 140,
  width: 140,
  oversizedBehavior: "wrap"
});

legend.data.setAll(series.dataItems);

series.appear(1000, 100);
}
}
