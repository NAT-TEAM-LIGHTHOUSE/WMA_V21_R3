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
  selector: 'app-stream-or-theme-river-chart',
  templateUrl: './stream-or-theme-river-chart.component.html',
  styleUrls: ['./stream-or-theme-river-chart.component.scss'],
})
export class StreamOrThemeRiverChartComponent implements OnInit {

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
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.horizontalLayout
    }));
    
    
    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerY: am5.p50,
        y: am5.p50,
        layout: root.verticalLayout,
        clickTarget: "none"
      })
    );
    
    legend.valueLabels.template.set("forceHidden", true);
    
    
    // Data
    let data = [
      { year: "1896", uk: 7, ussr: 0, russia: 0, usa: 20, china: 0 },
      { year: "1900", uk: 78, ussr: 0, russia: 0, usa: 55, china: 0 },
      { year: "1904", uk: 2, ussr: 0, russia: 0, usa: 394, china: 0 },
      { year: "1908", uk: 347, ussr: 0, russia: 0, usa: 63, china: 0 },
      { year: "1912", uk: 160, ussr: 0, russia: 0, usa: 101, china: 0 },
      { year: "1916", uk: 0, ussr: 0, russia: 0, usa: 0, china: 0 },
      { year: "1920", uk: 107, ussr: 0, russia: 0, usa: 193, china: 0 },
      { year: "1924", uk: 66, ussr: 0, russia: 0, usa: 198, china: 0 },
      { year: "1928", uk: 55, ussr: 0, russia: 0, usa: 84, china: 0 },
      { year: "1932", uk: 34, ussr: 0, russia: 0, usa: 181, china: 0 },
      { year: "1936", uk: 36, ussr: 0, russia: 0, usa: 92, china: 0 },
      { year: "1940", uk: 0, ussr: 0, russia: 0, usa: 0, china: 0 },
      { year: "1944", uk: 0, ussr: 0, russia: 0, usa: 0, china: 0 },
      { year: "1948", uk: 56, ussr: 0, russia: 0, usa: 148, china: 0 },
      { year: "1952", uk: 31, ussr: 117, russia: 0, usa: 130, china: 0 },
      { year: "1956", uk: 45, ussr: 169, russia: 0, usa: 118, china: 0 },
      { year: "1960", uk: 28, ussr: 169, russia: 0, usa: 112, china: 0 },
      { year: "1964", uk: 28, ussr: 174, russia: 0, usa: 150, china: 0 },
      { year: "1968", uk: 18, ussr: 188, russia: 0, usa: 149, china: 0 },
      { year: "1972", uk: 29, ussr: 211, russia: 0, usa: 155, china: 0 },
      { year: "1976", uk: 32, ussr: 285, russia: 0, usa: 155, china: 0 },
      { year: "1980", uk: 45, ussr: 442, russia: 0, usa: 0, china: 0 },
      { year: "1984", uk: 72, ussr: 0, russia: 0, usa: 333, china: 76 },
      { year: "1988", uk: 53, ussr: 294, russia: 0, usa: 193, china: 53 },
      { year: "1992", uk: 50, ussr: 0, russia: 0, usa: 224, china: 83 },
      { year: "1996", uk: 26, ussr: 0, russia: 115, usa: 260, china: 110 },
      { year: "2000", uk: 55, ussr: 0, russia: 188, usa: 248, china: 79 },
      { year: "2004", uk: 57, ussr: 0, russia: 192, usa: 264, china: 94 },
      { year: "2008", uk: 77, ussr: 0, russia: 143, usa: 315, china: 184 }
    ];
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "year",
      startLocation: 0.5,
      endLocation: 0.5,
      renderer: am5xy.AxisRendererX.new(root, {
        pan: "zoom",
        minorGridEnabled: true,
        minGridDistance: 50
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    xAxis.data.setAll(data);
    
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom"
      })
    }));
    
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function createSeries(field, name) {
      let series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueField: field,
        valueYField: field + "_hi",
        openValueYField: field + "_low",
        categoryXField: "year",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "[fontSize: 18px]{name}[/]\n{categoryX}: [bold]{" + field + "}[/]"
        })
      }));
      
      // Do not show tooltip for zero values
      series.get("tooltip").adapters.add("visible", function(visible, target:any) {
        if (target.dataItem && (target.dataItem.get("value") > 0)) {
          return true;
        }
        return false;
      });
    
      series.strokes.template.setAll({
        forceHidden: true
      });
      
      series.fills.template.setAll({
        visible: true,
        fillOpacity: 1
      });
    
    
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();
    
      legend.data.push(series);
    }
    
    createSeries("uk", "United Kingdom");
    createSeries("ussr", "Soviet Union");
    createSeries("russia", "Russia");
    createSeries("usa", "United States");
    createSeries("china", "China");
    
    // Prepare data for the river-stacked series
    for (var i = 0; i < data.length; i++) {
      let row = data[i];
      let sum = 0;
    
      // Calculate open and close values
      chart.series.each(function(series) {
        let field = series.get("valueField");
        let val = Number(row[field]);
        row[field + "_low"] = sum;
        row[field + "_hi"] = sum + val;
        sum += val;
      });
    
      // Adjust values so they are centered
      let offset = sum / 2;
      chart.series.each(function(series) {
        let field = series.get("valueField");
        row[field + "_low"] -= offset;
        row[field + "_hi"] -= offset;
      });
      
      chart.series.each(function(series) {
        let field = series.get("valueField");
        series.data.setAll(data);
      });
    
    }
    
    
    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomXY",
      xAxis: xAxis
    }));
    
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100); 
  }
}
