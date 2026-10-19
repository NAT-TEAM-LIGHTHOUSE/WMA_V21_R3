import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-waffle-chart',
  templateUrl: './waffle-chart.component.html',
  styleUrls: ['./waffle-chart.component.scss'],
})
export class WaffleChartComponent  implements OnInit {

 
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


displayChart(){// https://www.amcharts.com/docs/v5/getting-started/#Root_element
  let root = am5.Root.new("chartdiv");
  
  
  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  
  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  let chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    layout: root.verticalLayout,
    paddingLeft:5,
    paddingRight:5
  }));
  
  
  // Add legend
  // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
  let legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    })
  );
  
  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  let xRenderer = am5xy.AxisRendererX.new(root, {
    strokeOpacity: 0.1,
    minGridDistance: 40,
    minorGridEnabled:true
  });
  let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "x",
    renderer: xRenderer
  }));
  
  xRenderer.grid.template.setAll({
    location: 1
  })
  
  xRenderer.labels.template.set("forceHidden", true);
  
  xAxis.data.setAll([{ x: "1" }, { x: "2" }, { x: "3" }, { x: "4" }, { x: "5" }, { x: "6" }, { x: "7" }, { x: "8" }, { x: "9" }, { x: "10" }]);
  
  let yRenderer = am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1,
    minGridDistance: 20,
    minorGridEnabled:true
  });
  
  let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "y",
    renderer: yRenderer
  }));
  
  yRenderer.grid.template.setAll({
    location: 1
  })
  
  yRenderer.labels.template.set("forceHidden", true);
  
  yAxis.data.setAll([{ y: "1" }, { y: "2" }, { y: "3" }, { y: "4" }, { y: "5" }, { y: "6" }, { y: "7" }, { y: "8" }, { y: "9" }, { y: "10" }]);
  
  
  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  function makeSeries(name) {
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: name,
      xAxis: xAxis,
      yAxis: yAxis,
      categoryYField: "y",
      openCategoryYField: "y",
      categoryXField: "x",
      openCategoryXField: "x",
      clustered: false
    }));
  
    series.columns.template.setAll({
      width: am5.percent(100),
      height: am5.percent(100),
      stroke: am5.color(0xffffff),
    });
  
    series.appear();
    legend.data.push(series);
  
    return series;
  }
  
  let series1 = makeSeries("Democratic");
  series1.data.setAll([
    { x: "1", y: "1" },
    { x: "1", y: "2" },
    { x: "1", y: "3" },
    { x: "1", y: "4" },
    { x: "1", y: "5" },
    { x: "1", y: "6" },
    { x: "1", y: "7" },
    { x: "1", y: "8" },
    { x: "1", y: "9" },
    { x: "1", y: "10" },
  
    { x: "2", y: "1" },
    { x: "2", y: "2" },
    { x: "2", y: "3" },
    { x: "2", y: "4" },
    { x: "2", y: "5" },
    { x: "2", y: "6" },
    { x: "2", y: "7" },
    { x: "2", y: "8" },
    { x: "2", y: "9" },
    { x: "2", y: "10" },
  
    { x: "3", y: "1" },
    { x: "3", y: "2" },
    { x: "3", y: "3" },
  ]);
  
  let series2 = makeSeries("Republican");
  series2.data.setAll([
    { x: "3", y: "4" },
    { x: "3", y: "5" },
    { x: "3", y: "6" },
    { x: "3", y: "7" },
    { x: "3", y: "8" },
    { x: "3", y: "9" },
    { x: "3", y: "10" },
  
    { x: "4", y: "1" },
    { x: "4", y: "2" },
    { x: "4", y: "3" },
    { x: "4", y: "4" },
    { x: "4", y: "5" },
    { x: "4", y: "6" },
    { x: "4", y: "7" },
    { x: "4", y: "8" },
    { x: "4", y: "9" },
    { x: "4", y: "10" },
  
    { x: "5", y: "1" },
    { x: "5", y: "2" },
    { x: "5", y: "3" },
    { x: "5", y: "4" },
    { x: "5", y: "5" },
    { x: "5", y: "6" },
  ]);
  
  let series3 = makeSeries("Libertarian");
  series3.data.setAll([
    { x: "5", y: "7" },
    { x: "5", y: "8" },
    { x: "5", y: "9" },
    { x: "5", y: "10" },
  
    { x: "6", y: "1" },
    { x: "6", y: "2" },
    { x: "6", y: "3" },
    { x: "6", y: "4" },
    { x: "6", y: "5" },
    { x: "6", y: "6" },
    { x: "6", y: "7" },
    { x: "6", y: "8" },
    { x: "6", y: "9" },
    { x: "6", y: "10" },
  
    { x: "7", y: "1" },
    { x: "7", y: "2" },
    { x: "7", y: "3" },
    { x: "7", y: "4" },
    { x: "7", y: "5" },
    { x: "7", y: "6" },
    { x: "7", y: "7" },
    { x: "7", y: "8" },
    { x: "7", y: "9" },
  ]);
  
  
  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  chart.appear(1000, 100);
}  

}
