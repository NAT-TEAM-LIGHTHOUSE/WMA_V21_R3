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
  selector: 'app-radar-with-date-axis-chart',
  templateUrl: './radar-with-date-axis-chart.component.html',
  styleUrls: ['./radar-with-date-axis-chart.component.scss'],
})
export class RadarWithDateAxisChartComponent implements OnInit {

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
  root.setThemes([am5themes_Animated.new(root)]);
  
  // Create chart
  // https://www.amcharts.com/docs/v5/charts/radar-chart/
  let chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      innerRadius: am5.percent(40)
    })
  );
  
  chart.get("colors").set("step", 2);
  
  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
  let cursor = chart.set("cursor",
  am5radar.RadarCursor.new(root, {
    behavior: "zoomX"
  }));
  
  cursor.lineY.set("visible", false);
  
  // Create axes and their renderers
  // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
  let yRenderer = am5radar.AxisRendererRadial.new(root, { minGridDistance: 20 });
  
  let yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "category",
      renderer: yRenderer
    })
  );
  
  let xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      min: new Date("2021-01-01 00:00:00").getTime(),
      max: new Date("2022-01-01 00:00:00").getTime(),
      baseInterval: { timeUnit: "day", count: 1 },
      renderer: am5radar.AxisRendererCircular.new(root, {})
    })
  );
  
  let data = [
    {
      category: "One",
      startDate1: new Date("2021-01-01").getTime(),
      endDate1: new Date("2021-03-01").getTime()
    },
    {
      category: "One",
      startDate1: new Date("2021-04-01").getTime(),
      endDate1: new Date("2021-08-15").getTime()
    },
    {
      category: "Two",
      startDate2: new Date("2021-03-01").getTime(),
      endDate2: new Date("2021-06-01").getTime()
    },
    {
      category: "Two",
      startDate2: new Date("2021-08-01").getTime(),
      endDate2: new Date("2021-10-01").getTime()
    },
    {
      category: "Three",
      startDate3: new Date("2021-02-01").getTime(),
      endDate3: new Date("2021-07-01").getTime()
    },
    {
      category: "Four",
      startDate4: new Date("2021-06-09").getTime(),
      endDate4: new Date("2021-09-01").getTime()
    },
    {
      category: "Four",
      startDate4: new Date("2021-10-01").getTime(),
      endDate4: new Date("2021-12-15").getTime()
    },
    {
      category: "Five",
      startDate5: new Date("2021-02-01").getTime(),
      endDate5: new Date("2021-04-15").getTime()
    },
    {
      category: "Five",
      startDate5: new Date("2021-10-01").getTime(),
      endDate5: new Date("2021-12-31").getTime()
    }
  ];
  
  // Set date fields
  // https://www.amcharts.com/docs/v5/concepts/data/#Parsing_dates
  root.dateFormatter.setAll({
    dateFormat: "yyyy-MM-dd",
    dateFields: ["valueX", "openValueX"]
  });
  
  // Create series
  // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
  for (var i = 1; i < 6; i++) {
    let series = chart.series.push(
      am5radar.RadarColumnSeries.new(root, {
        clustered: false,
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        categoryYField: "category",
        valueXField: "endDate" + i,
        openValueXField: "startDate" + i
      })
    );
  
    series.columns.template.set("cornerRadius", 25);
    series.columns.template.set(
      "tooltipText",
      "{category}: {openValueX} - {valueX}"
    );
  
    series.data.setAll(data);
    series.appear(2000, 100);
    series.data.setAll(data);
  }
  
  yAxis.data.setAll([
    { category: "One" },
    { category: "Two" },
    { category: "Three" },
    { category: "Four" },
    { category: "Five" }
  ]);
  
  chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal", exportable: false }));
  chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical", exportable: false }));
  
  xAxis.data.setAll(data);
  
  // Animate chart and series in
  // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
  chart.appear(2000, 100);
}
}
