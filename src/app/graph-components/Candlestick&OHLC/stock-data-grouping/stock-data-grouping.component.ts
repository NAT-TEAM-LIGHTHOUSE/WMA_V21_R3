import { Component, OnInit } from '@angular/core';
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5 from "@amcharts/amcharts5";
import * as am5stock from "@amcharts/amcharts5/stock";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-stock-data-grouping',
  templateUrl: './stock-data-grouping.component.html',
  styleUrls: ['./stock-data-grouping.component.scss'],
})
export class StockDataGroupingComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
displayChart(){
  let root = am5.Root.new("chartdiv777");

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
  height: am5.percent(70),
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
  tooltip: am5.Tooltip.new(root, {}),
  numberFormat: "#,###.00",
  extraTooltipPrecision: 2
}));

let dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
  groupData: true,
  groupCount: 150,
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
  name: "AMCH",
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
  legendRangeValueText: ""
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


// Create a volume panel (chart)
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/#Adding_panels
let volumePanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
  wheelY: "zoomX",
  panX: true,
  panY: false,
  height: am5.percent(30),
  paddingTop: 6
}));

// hide close button as we don't want this panel to be closed
volumePanel.panelControls.closeButton.set("forceHidden", true);

let volumeDateAxis = volumePanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  groupData: true,
  groupCount: 150,
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true
  }),
  tooltip: am5.Tooltip.new(root, {
    forceHidden: true
  }),
  height: 0
}));

// we don't need it to be visible
volumeDateAxis.get("renderer").labels.template.set("forceHidden", true);

// Create volume axis
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {
  pan: "zoom"
});

let volumeValueAxis = volumePanel.yAxes.push(am5xy.ValueAxis.new(root, {
  numberFormat: "#.#a",
  renderer: volumeAxisRenderer
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let volumeSeries = volumePanel.series.push(am5xy.ColumnSeries.new(root, {
  name: "Volume",
  clustered: false,
  valueXField: "Date",
  valueYField: "Volume",
  xAxis: volumeDateAxis,
  yAxis: volumeValueAxis,
  legendValueText: "[bold]{valueY.formatNumber('#,###.0a')}[/]"
}));

volumeSeries.columns.template.setAll({
  strokeOpacity: 0,
  fillOpacity: 0.5
});

// color columns by stock rules
volumeSeries.columns.template.adapters.add("fill", function (fill, target) {
  let dataItem = target.dataItem;
  if (dataItem) {
    return stockChart.getVolumeColor(dataItem);
  }
  return fill;
})

// Add a stock legend
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/stock-legend/
let volumeLegend = volumePanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
  stockChart: stockChart
}));


// Set main series
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/#Setting_main_series
stockChart.set("volumeSeries", volumeSeries);
valueLegend.data.setAll([valueSeries]);
volumeLegend.data.setAll([volumeSeries]);


// Add cursor(s)
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
mainPanel.set("cursor", am5xy.XYCursor.new(root, {
  yAxis: valueAxis,
  xAxis: dateAxis,
  snapToSeries: [valueSeries],
  snapToSeriesBy: "y!"
}));


let volumeCursor = volumePanel.set("cursor", am5xy.XYCursor.new(root, {
  yAxis: volumeValueAxis,
  xAxis: volumeDateAxis,
  snapToSeries: [volumeSeries],
  snapToSeriesBy: "y!"
}));

volumeCursor.lineY.set("forceHidden", true);

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
  am5.net.load("https://www.amcharts.com/wp-content/uploads/assets/docs/stock/" + ticker + "_big_" + granularity + ".csv").then(function (result) {

    // Parse loaded data
    let data = am5.CSVParser.parse(result.response, {
      delimiter: ",",
      skipEmpty: true,
      useColumnNames: true
    });

    // Process data (convert dates and values)
    let processor = am5.DataProcessor.new(root, {
      dateFields: ["Date"],
      dateFormat: "yyyy-MM-dd",
      numericFields: ["Open", "High", "Low", "Close", "Adj Close", "Volume"]
    });
    processor.processMany(data);

    // Set data
    am5.array.each(series, function (item) {
      // item.data.setAll(data);
    });
  });
}

// Load initial data for the first series
let currentGranularity = "day";
loadData("MSFT", [valueSeries, volumeSeries, sbSeries], currentGranularity);


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
