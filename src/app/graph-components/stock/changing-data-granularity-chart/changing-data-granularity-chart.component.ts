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
  selector: 'app-changing-data-granularity-chart',
  templateUrl: './changing-data-granularity-chart.component.html',
  styleUrls: ['./changing-data-granularity-chart.component.scss'],
})
export class ChangingDataGranularityChartComponent implements OnInit {

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

const myTheme = am5.Theme.new(root);

myTheme.rule("Grid", ["scrollbar", "minor"]).setAll({
  visible:false
});

root.setThemes([
  am5themes_Animated.new(root),
  myTheme
]);

// Create a stock chart
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/#Instantiating_the_chart
let stockChart = root.container.children.push(am5stock.StockChart.new(root, {
}));


// Set global number format
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/
root.numberFormatter.set("numberFormat", "#,###.00");


// Create a main stock panel (chart)
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/#Adding_panels
let mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
  wheelY: "zoomX",
  panX: true,
  panY: true
}));


// Create value axis
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {
    pan: "zoom"
  }),
  extraMin: 0.1, // adds some space for for main series
  tooltip: am5.Tooltip.new(root, {}),
  numberFormat: "#,###.00",
  extraTooltipPrecision: 2
}));

let dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true
  }),
  tooltip: am5.Tooltip.new(root, {})
}));


// Add series
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let valueSeries = mainPanel.series.push(am5xy.CandlestickSeries.new(root, {
  name: "MSFT",
  clustered: false,
  valueXField: "Date",
  valueYField: "Close",
  highValueYField: "High",
  lowValueYField: "Low",
  openValueYField: "Open",
  calculateAggregates: true,
  xAxis: dateAxis,
  yAxis: valueAxis,
  legendValueText: "open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]",
  legendRangeValueText:""
}));


// Set main value series
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/#Setting_main_series
stockChart.set("stockSeries", valueSeries);


// Add a stock legend
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/stock-legend/
let valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
  stockChart: stockChart
}));


// Create volume axis
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {});

volumeAxisRenderer.labels.template.set("forceHidden", true);
volumeAxisRenderer.grid.template.set("forceHidden", true);

let volumeValueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
  numberFormat: "#.#a",
  height: am5.percent(20),
  y: am5.percent(100),
  centerY: am5.percent(100),
  renderer: volumeAxisRenderer
}));

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let volumeSeries = mainPanel.series.push(am5xy.ColumnSeries.new(root, {
  name: "Volume",
  clustered: false,
  valueXField: "Date",
  valueYField: "Volume",
  xAxis: dateAxis,
  yAxis: volumeValueAxis,
  legendValueText: "[bold]{valueY.formatNumber('#,###.0a')}[/]"
}));

volumeSeries.columns.template.setAll({
  strokeOpacity: 0,
  fillOpacity: 0.5
});

// color columns by stock rules
volumeSeries.columns.template.adapters.add("fill", function(fill, target) {
  let dataItem = target.dataItem;
  if (dataItem) {
    return stockChart.getVolumeColor(dataItem);
  }
  return fill;
})


// Set main series
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/#Setting_main_series
stockChart.set("volumeSeries", volumeSeries);
valueLegend.data.setAll([valueSeries, volumeSeries]);


// Add cursor(s)
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
mainPanel.set("cursor", am5xy.XYCursor.new(root, {
  yAxis: valueAxis,
  xAxis: dateAxis,
  snapToSeries: [valueSeries],
  snapToSeriesBy: "y!"
}));


// Add scrollbar
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
let scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
  orientation: "horizontal",
  height: 50
}));
stockChart.toolsContainer.children.push(scrollbar);

let sbDateAxis = scrollbar.chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true
  })
}));

let sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));

let sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
  valueYField: "Close",
  valueXField: "Date",
  xAxis: sbDateAxis,
  yAxis: sbValueAxis
}));

sbSeries.fills.template.setAll({
  visible: true,
  fillOpacity: 0.3
});


// Function that dynamically loads data
function loadData(ticker, series, granularity) {

  // Load external data
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Setting_data
  am5.net.load("https://www.amcharts.com/wp-content/uploads/assets/docs/stock/" + ticker + "_" + granularity + ".csv").then(function(result) {

    // Parse loaded data
    let data = am5.CSVParser.parse(result.response, {
      delimiter: ",",
      skipEmpty: true,
      useColumnNames: true
    });

    // Process data (convert dates and values)
    let processor = am5.DataProcessor.new(root, {
      dateFields: ["Date"],
      dateFormat: granularity == "minute" ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd",
      numericFields: ["Open", "High", "Low", "Close", "Adj Close", "Volume"]
    });
    processor.processMany(data);

    // Set data
    am5.array.each(series, function(item:any) {
      item.data.setAll(data);
    });
  });
}

// Load initial data for the first series
let currentGranularity = "day";
loadData("MSFT", [valueSeries, volumeSeries, sbSeries], currentGranularity);

// Set up series type switcher
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/toolbar/series-type-control/
let seriesSwitcher = am5stock.SeriesTypeControl.new(root, {
  stockChart: stockChart
});

seriesSwitcher.events.on("selected", function(ev:any) {
  setSeriesType(ev.item.id);
});

function getNewSettings(series) {
  let newSettings = [];
  am5.array.each(["name", "valueYField", "highValueYField", "lowValueYField", "openValueYField", "calculateAggregates", "valueXField", "xAxis", "yAxis", "legendValueText", "legendRangeValueText", "stroke", "fill"], function(setting) {
    newSettings[setting] = series.get(setting);
  });
  return newSettings;
}

function setSeriesType(seriesType) {
  // Get current series and its settings
  let currentSeries = stockChart.get("stockSeries");
  let newSettings:any = getNewSettings(currentSeries);

  // Remove previous series
  let data = currentSeries.data.values;
  mainPanel.series.removeValue(currentSeries);

  // Create new series
  let series;
  switch (seriesType) {
    case "line":
      series = mainPanel.series.push(am5xy.LineSeries.new(root, newSettings));
      break;
    case "candlestick":
    case "procandlestick":
      newSettings.clustered = false;
      series = mainPanel.series.push(am5xy.CandlestickSeries.new(root, newSettings));
      if (seriesType == "procandlestick") {
        series.columns.template.get("themeTags").push("pro");
      }
      break;
    case "ohlc":
      newSettings.clustered = false;
      series = mainPanel.series.push(am5xy.OHLCSeries.new(root, newSettings));
      break;
  }

  // Set new series as stockSeries
  if (series) {
    valueLegend.data.removeValue(currentSeries);
    series.data.setAll(data);
    stockChart.set("stockSeries", series);
    let cursor = mainPanel.get("cursor");
    if (cursor) {
      cursor.set("snapToSeries", [series]);
    }
    valueLegend.data.insertIndex(0, series);
  }
}

// Interval switcher
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/toolbar/interval-control/
let intervalSwitcher = am5stock.IntervalControl.new(root, {
  stockChart: stockChart,
  items: [
    { id: "1 minute", label: "1 minute", interval: { timeUnit: "minute", count: 1 } },
    { id: "1 day", label: "1 day", interval: { timeUnit: "day", count: 1 } },
    { id: "1 week", label: "1 week", interval: { timeUnit: "week", count: 1 } },
    { id: "1 month", label: "1 month", interval: { timeUnit: "month", count: 1 } }
  ]
});

intervalSwitcher.events.on("selected", function(ev:any) {
  // Determine selected granularity
  currentGranularity = ev.item.interval.timeUnit;
  
  // Get series
  let valueSeries = stockChart.get("stockSeries");
  let volumeSeries = stockChart.get("volumeSeries");

  // Set up zoomout
  valueSeries.events.once("datavalidated", function() {
    mainPanel.zoomOut();
  });

  // Load data for all series (main series + comparisons)
  let promises = [];
  promises.push(loadData("MSFT", [valueSeries, volumeSeries, sbSeries], currentGranularity));
  am5.array.each(stockChart.getPrivate("comparedSeries", []), function(series) {
    promises.push(loadData(series.get("name"), [series], currentGranularity));
  });

  // Once data loading is done, set `baseInterval` on the DateAxis
  Promise.all(promises).then(function() {
    dateAxis.set("baseInterval", ev.item.interval);
    sbDateAxis.set("baseInterval", ev.item.interval);

  stockChart.indicators.each(function(indicator){
    if(indicator instanceof am5stock.ChartIndicator){
      indicator.xAxis.set("baseInterval", ev.item.interval);
    }
  })

  });
});


// Stock toolbar
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/toolbar/
let toolbar = am5stock.StockToolbar.new(root, {
  container: document.getElementById("chartcontrols"),
  stockChart: stockChart,
  controls: [
    am5stock.IndicatorControl.new(root, {
      stockChart: stockChart,
      legend: valueLegend
    }),
    am5stock.DateRangeSelector.new(root, {
      stockChart: stockChart
    }),
    am5stock.PeriodSelector.new(root, {
      stockChart: stockChart
    }),
    intervalSwitcher,
    seriesSwitcher,
    am5stock.DrawingControl.new(root, {
      stockChart: stockChart
    }),
    am5stock.ResetControl.new(root, {
      stockChart: stockChart
    }),
    am5stock.SettingsControl.new(root, {
      stockChart: stockChart
    })
  ]
})
  }

}
