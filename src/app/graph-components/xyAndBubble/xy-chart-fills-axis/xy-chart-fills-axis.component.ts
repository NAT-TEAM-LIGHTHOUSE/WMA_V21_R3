import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5stock from "@amcharts/amcharts5/stock";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
@Component({
standalone : true,
imports : [],
  selector: 'app-xy-chart-fills-axis',
  templateUrl: './xy-chart-fills-axis.component.html',
  styleUrls: ['./xy-chart-fills-axis.component.scss'],
})
export class XyChartFillsAxisComponent implements OnInit {

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
    let data = [
      {
        ax: 1,
        ay: 0.5,
        bx: 1,
        by: 2.2
      },
      {
        ax: 2,
        ay: 1.3,
        bx: 2,
        by: 4.9
      },
      {
        ax: 3,
        ay: 2.3,
        bx: 3,
        by: 5.1
      },
      {
        ax: 4,
        ay: 2.8,
        bx: 4,
        by: 5.3
      },
      {
        ax: 5,
        ay: 3.5,
        bx: 5,
        by: 6.1
      },
      {
        ax: 6,
        ay: 5.1,
        bx: 6,
        by: 8.3
      },
      {
        ax: 7,
        ay: 6.7,
        bx: 7,
        by: 10.5
      },
      {
        ax: 8,
        ay: 8,
        bx: 8,
        by: 12.3
      },
      {
        ax: 9,
        ay: 8.9,
        bx: 9,
        by: 14.5
      },
      {
        ax: 10,
        ay: 9.7,
        bx: 10,
        by: 15
      },
      {
        ax: 11,
        ay: 10.4,
        bx: 11,
        by: 18.8
      },
      {
        ax: 12,
        ay: 11.7,
        bx: 12,
        by: 25
      }
    ];
    
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new("chartdiv");
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelY: "none"
      })
    );
    
    chart.get("colors").set("step", 2);
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        strictMinMax: true,
        maxDeviation: 0,
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
        tooltip: am5.Tooltip.new(root, {
          themeTags: ["axis"],
          animationDuration: 300
        })
      })
    );
    
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        strictMinMax: true,
        maxDeviation: 0,
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {
          themeTags: ["axis"],
          animationDuration: 300
        })
      })
    );
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series0 = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "ay",
        valueXField: "ax",
        baseAxis: xAxis,
        tooltip: am5.Tooltip.new(root, {
          labelText: "x:{valueX}, y:{valueY}"
        })
      })
    );
    
    series0.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true
    });
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series1 = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "by",
        valueXField: "bx",
        baseAxis: yAxis,
        tooltip: am5.Tooltip.new(root, {
          labelText: "x:{valueX}, y:{valueY}"
        })
      })
    );
    
    series1.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true
    });
    
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    chart.set("cursor", am5xy.XYCursor.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      snapToSeries: [series0, series1]
    }));
    
    // Add scrollbars
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));
    
    chart.set("scrollbarY", am5.Scrollbar.new(root, {
      orientation: "vertical"
    }));
    
    series0.data.setAll(data);
    series1.data.setAll(data);
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series0.appear(1000);
    series1.appear(1000);
    chart.appear(1000, 100);
  }
}
