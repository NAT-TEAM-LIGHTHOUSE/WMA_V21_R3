import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-no-gap-date-axis',
  templateUrl: './no-gap-date-axis.component.html',
  styleUrls: ['./no-gap-date-axis.component.scss'],
})
export class NoGapDateAxisComponent implements OnInit {

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
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0
    }));
    
    
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none"
    }));
    cursor.lineY.set("visible", false);
    
    
    // Generate random data
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    let value = 1000;
    let volume = 100000;
    
    function generateData() {
      value = Math.round((Math.random() * 10 - 5) + value);
      volume = Math.round((Math.random() * 1000 - 500) + volume);
    
      am5.time.add(date, "day", 1);
      // add another if it's saturday
      if (date.getDay() == 6) {
        am5.time.add(date, "day", 1);
      }
      // add another if it's sunday
      if (date.getDay() == 0) {
        am5.time.add(date, "day", 1);
      }
    
      return {
        date: date.getTime(),
        value: value,
        volume: volume
      };
    }
    
    function generateDatas(count) {
      let data = [];
      for (var i = 0; i < count; ++i) {
        data.push(generateData());
      }
      return data;
    }
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      extraMin: 0.2,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));
    
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));
    
    // y axis for volume
    let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {});
    volumeAxisRenderer.grid.template.set("forceHidden", true);
    volumeAxisRenderer.labels.template.set("forceHidden", true);
    
    let volumeAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      height: am5.percent(25),
      y: am5.percent(100),
      centerY: am5.percent(100),
      panY: false,
      renderer: volumeAxisRenderer
    }));
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let volumeSeries = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Volume Series",
      xAxis: xAxis,
      yAxis: volumeAxis,
      valueYField: "volume",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));
    
    volumeSeries.columns.template.setAll({ fillOpacity: 0.8, strokeOpacity: 0, width: am5.percent(40) })
    
    
    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));
    
    
    // Set data
    let data = generateDatas(200);
    series.data.setAll(data);
    volumeSeries.data.setAll(data);
    
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);  
  }
}
