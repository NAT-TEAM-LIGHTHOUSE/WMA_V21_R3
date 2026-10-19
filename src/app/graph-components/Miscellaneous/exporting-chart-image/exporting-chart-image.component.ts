import { Component, OnInit } from '@angular/core';
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

@Component({
standalone : true,
imports : [],
  selector: 'app-exporting-chart-image',
  templateUrl: './exporting-chart-image.component.html',
  styleUrls: ['./exporting-chart-image.component.scss'],
})
export class ExportingChartImageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    this.displayChart()
  }

  displayChart(){
    let root = am5.Root.new("chartdiv15");


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
  layout: root.verticalLayout
}));


let data = [{
  country: "USA",
  visits: 4025,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "China",
  visits: 1882,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Japan",
  visits: 1809,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Germany",
  visits: 1322,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "UK",
  visits: 1122,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "France",
  visits: 1114,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "India",
  visits: 984,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Spain",
  visits: 711,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Netherlands",
  visits: 665,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Korea",
  visits: 443,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Canada",
  visits: 441,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Brazil",
  visits: 395,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Italy",
  visits: 386,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Australia",
  visits: 384,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Taiwan",
  visits: 338,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}, {
  country: "Poland",
  visits: 328,
  columnSettings: {
    //fill: chart.get("colors").next()
  }
}]


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  cellStartLocation: 0.1,
  cellEndLocation: 0.9,
  minGridDistance: 50
});

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "country",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

xRenderer.grid.template.setAll({
  location: 1
});

xRenderer.labels.template.setAll({
  multiLocation: 0.5
})

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "visits",
  categoryXField: "country"
}));

series.columns.template.setAll({
  tooltipText: "{categoryX}: {valueY}",
  width: am5.percent(90),
  tooltipY: 0,
  strokeOpacity: 0,
  templateField: "columnSettings"
});

series.data.setAll(data);


// Add export menu
let exporting = am5plugins_exporting.Exporting.new(root, {
  menu: am5plugins_exporting.ExportingMenu.new(root, {})
});


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear();
chart.appear(1000, 100);
  }

}
