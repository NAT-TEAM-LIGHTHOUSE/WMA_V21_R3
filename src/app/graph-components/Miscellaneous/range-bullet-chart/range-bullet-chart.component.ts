import { Component, OnInit } from '@angular/core';
import * as  am5xy from "@amcharts/amcharts5/xy";
import * as  am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-range-bullet-chart',
  templateUrl: './range-bullet-chart.component.html',
  styleUrls: ['./range-bullet-chart.component.scss'],
})
export class RangeBulletChartComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    this.displayChart()
  }


  displayChart(){
    let root = am5.Root.new("chartdiv27");


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
      wheelX: "none",
      wheelY: "none",
      layout: root.verticalLayout
    }));
    
    
    let data = [{
      category: "Reduce Expenses",
      open: 0.05,
      close: 2.8,
      average: 1.6
    }, {
      category: "Increase Expenses",
      open: 0.4,
      close: 3,
      average: 1.6
    }];
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererY.new(root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    yAxis.data.setAll(data);
    
    let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 40
      })
    }));
    
    xAxis.get("renderer").grid.template.set("visible", false);
    
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      openValueXField: "open",
      valueXField: "close",
      categoryYField: "category",
      fill: am5.color(0x888888)
    }));
    
    series.columns.template.setAll({
      height: 5
    });
    
    series.data.setAll(data);
    
    // Add bullets
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 0,
        sprite: am5.Circle.new(root, {
          fill: am5.color(0x009dd9),
          radius: 10
        })
      });
    });
    
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Circle.new(root, {
          fill: am5.color(0x009dd9),
          radius: 10
        })
      });
    });
    
    
    let series2 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Average Score",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "average",
      categoryYField: "category"
    }));
    
    series2.strokes.template.setAll({
      visible: false
    });
    
    series2.data.setAll(data);
    
    // Add bullets
    series2.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Triangle.new(root, {
          fill: am5.color(0x70b603),
          rotation: 180,
          width: 24,
          height: 24
        })
      });
    });
    
    
    let series3 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Minimum Score / Maximum Score",
      xAxis: xAxis,
      yAxis: yAxis,
      // valueXField: "average",
      // categoryYField: "category"
    }));
    
    series3.strokes.template.setAll({
      visible: false
    });
    
    series3.data.setAll(data);
    
    // Add bullets
    series3.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 0,
        sprite: am5.Circle.new(root, {
          fill: am5.color(0x009dd9),
          radius: 10
        })
      });
    });
    
    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {
      layout: root.horizontalLayout,
      clickTarget: "none"
    }));
    
    legend.data.setAll([series3, series2]);
    
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear();
    chart.appear(1000, 100);
  }

}
