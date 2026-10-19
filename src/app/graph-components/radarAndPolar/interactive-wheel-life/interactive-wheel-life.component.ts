import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
@Component({
standalone : true,
imports : [],
  selector: 'app-interactive-wheel-life',
  templateUrl: './interactive-wheel-life.component.html',
  styleUrls: ['./interactive-wheel-life.component.scss'],
})
export class InteractiveWheelLifeComponent implements OnInit {

  
  
  
  
  
  
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
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  // Create chart
  // https://www.amcharts.com/docs/v5/charts/radar-chart/
  let chart = root.container.children.push(am5radar.RadarChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX"
  }));
  
  // Create axes and their renderers
  // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
  let xRenderer = am5radar.AxisRendererCircular.new(root, {});
  xRenderer.labels.template.setAll({
    radius: 10
  });
  
  let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0,
    categoryField: "category",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));
  
  let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    min: 0,
    max: 10,
    renderer: am5radar.AxisRendererRadial.new(root, {
      minGridDistance: 20
    })
  }));
  
  yAxis.get("renderer").labels.template.set("forceHidden", true);
  
  // Create series
  // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
  let series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    categoryXField: "category"
  }));
  
  series.columns.template.setAll({
    tooltipText: "{categoryX}: {valueY}",
    templateField: "columnSettings",
    strokeOpacity: 0,
    width: am5.p100
  });
  
  // Set data
  // https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
  let data = [{
    category: "Health",
    value: 0,
    columnSettings: {
      fill: chart.get("colors").next()
    }
  }, {
    category: "Career",
    value: 0,
    columnSettings: {
      fill: chart.get("colors").next()
              }
  }, {
    category: "Love",
    value: 0,
    columnSettings: {
      fill: chart.get("colors").next()
    }
  }, {
    category: "Spirituality",
    value: 0,
    columnSettings: {
      fill: chart.get("colors").next()
    }
  }, {
    category: "Family",
    value: 0,
    columnSettings: {
      fill: chart.get("colors").next()
    }
  }, {
    category: "Money",
    value: 0,
    columnSettings: {
      fill: chart.get("colors").next()
    }
  }, {
    category: "Fun",
    value: 0,
    columnSettings: {
      fill: chart.get("colors").next()
    }
  }, {
    category: "Friends",
    value: 0,
    columnSettings: {
      fill: chart.get("colors").next()
    }
  }];
  
  series.data.setAll(data);
  xAxis.data.setAll(data);
  
  // Animate chart
  // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
  series.appear(1000);
  chart.appear(1000, 100);
  
  // Function for updating value
  function setValue(index, value) {
    
    // Set value
    let row = data[index];
    row.value = value;
    console.log(row)
    series.data.setIndex(index, {
      category: row.category,
      value: value,
      columnSettings: row.columnSettings
    });
    
    // Reveal next question
    let areas:any = document.getElementsByClassName("area");
    for(var i = 0; i < areas.length; i++) {
      areas[i].style.display = (index + 1) === i ? "block" : "none";
    }
    
  }
}
}
