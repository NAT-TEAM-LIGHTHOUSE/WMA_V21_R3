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
  selector: 'app-xy-error-chrt',
  templateUrl: './xy-error-chrt.component.html',
  styleUrls: ['./xy-error-chrt.component.scss'],
})
export class XyErrorChrtComponent implements OnInit {

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
    let data = [{
      "x": 10,
      "y": 14,
      "errorX": 3,
      "errorY": 4
    }, {
      "x": 0,
      "y": 0,
      "errorX": 2,
      "errorY": 6
    }, {
      "x": -10,
      "y": 3,
      "errorX": 0.8,
      "errorY": 3.5
    }, {
      "x": -6,
      "y": 5,
      "errorX": 1.2,
      "errorY": 4.2
    }, {
      "x": 11,
      "y": -4,
      "errorX": 2.4,
      "errorY": 3.9
    }, {
      "x": 13,
      "y": 1,
      "errorX": 1.5,
      "errorY": 3.3
    }, {
      "x": 1,
      "y": 6,
      "errorX": 2,
      "errorY": 3.3
    }];
    
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
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelY: "zoomXY",
      pinchZoomX:true,
      pinchZoomY:true
    }));
    
    chart.get("colors").set("step", 2);
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      extraMax: 0.2,
      extraMin: 0.2,
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      extraMax: 0.2,
      extraMin: 0.2,
      renderer: am5xy.AxisRendererY.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.LineSeries.new(root, {
      calculateAggregates: true,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "y",
      valueXField: "x",
      tooltip: am5.Tooltip.new(root, {
        labelText: "x: {valueX}\ny: {valueY}\nerrorX: {errorX}\nerrorY: {errorY}"
      })
    }));
    
    // add error bullet
    series.bullets.push(function() {
      let graphics = am5.Graphics.new(root, {
        strokeWidth: 2,
        stroke: series.get("stroke"),
        draw: function(display, target) {
          let dataItem:any = target.dataItem;
          let errorX = dataItem.dataContext.errorX;
    
          let xPosition0 = xAxis.valueToPosition(0);
          let xPosition1 = xAxis.valueToPosition(errorX);
    
          let width = (xAxis.get("renderer").positionToCoordinate(xPosition1) - xAxis.get("renderer").positionToCoordinate(xPosition0)) / 2;
    
          display.moveTo(-width, 0);
          display.lineTo(width, 0);
    
          display.moveTo(-width, -10);
          display.lineTo(-width, 10);
    
          display.moveTo(width, -10);
          display.lineTo(width, 10);
    
          let errorY = dataItem.dataContext.errorY;
    
          let yPosition0 = yAxis.valueToPosition(0);
          let yPosition1 = yAxis.valueToPosition(errorY);
    
          let height = (yAxis.get("renderer").positionToCoordinate(yPosition1) - yAxis.get("renderer").positionToCoordinate(yPosition0)) / 2;
    
          display.moveTo(0, -height);
          display.lineTo(0, height);
    
          display.moveTo(-10, -height);
          display.lineTo(10, -height);
    
          display.moveTo(-10, height);
          display.lineTo(10, height);
        }
      });
    
      return am5.Bullet.new(root, {
        dynamic: true,
        sprite: graphics
      });
    });
    
    // Add circle bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    series.bullets.push(function() {
      let graphics = am5.Circle.new(root, {
        strokeWidth: 2,
        radius: 5,
        stroke: series.get("stroke"),
        fill: root.interfaceColors.get("background"),
      });
      return am5.Bullet.new(root, {
        sprite: graphics
      });
    });
    
    series.strokes.template.set("strokeOpacity", 0);
    
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    chart.set("cursor", am5xy.XYCursor.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      snapToSeries: [series]
    }));
    
    // Add scrollbars
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));
    
    chart.set("scrollbarY", am5.Scrollbar.new(root, {
      orientation: "vertical"
    }));
    
    series.data.setAll(data);
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
  }
}
