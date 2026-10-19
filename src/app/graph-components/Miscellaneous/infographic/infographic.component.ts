import { Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as  am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import * as am5percent from "@amcharts/amcharts5/percent";

@Component({
standalone : true,
imports : [],
  selector: 'app-infographic',
  templateUrl: './infographic.component.html',
  styleUrls: ['./infographic.component.scss'],
})
export class InfographicComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    this.displayChart()
  }

  displayChart(){
    let root = am5.Root.new("chartdiv21");

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
    wheelX: "panX",
    wheelY: "zoomX",
    layout: root.horizontalLayout,
    arrangeTooltips: false
  })
);

// Use only absolute numbers
root.numberFormatter.set("numberFormat", "#.#s'%");

// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(
  am5.Legend.new(root, {
    centerY: am5.p50,
    y: am5.p50,
    //useDefaultMarker: true,
    layout: root.verticalLayout
  })
);

legend.markers.template.setAll({
  width: 50,
  height: 50
})

// Data
let data = [{
  category: "Marketing",
  male: -36,
  maleMax: -100,
  female: 64,
  femaleMax: 100
}, {
  category: "Research",
  male: -58,
  maleMax: -100,
  female: 42,
  femaleMax: 100
}, {
  category: "Engineering",
  male: -59,
  maleMax: -100,
  female: 41,
  femaleMax: 100
}, {
  category: "Sales",
  male: -41,
  maleMax: -100,
  female: 59,
  femaleMax: 100
}, {
  category: "Support",
  male: -50,
  maleMax: -100,
  female: 50,
  femaleMax: 100
}, {
  category: "Other",
  male: -36,
  maleMax: -100,
  female: 64,
  femaleMax: 100
}];

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let yAxis = chart.yAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "category",
    renderer: am5xy.AxisRendererY.new(root, {
      inversed: true,
      cellStartLocation: 0.1,
      cellEndLocation: 0.9
    })
  })
);

let yRenderer = yAxis.get("renderer");
yRenderer.grid.template.setAll({
  visible: false
});

yAxis.data.setAll(data);

let xAxis = chart.xAxes.push(
  am5xy.ValueAxis.new(root, {
    calculateTotals: true,
    min: -100,
    max: 100,
    renderer: am5xy.AxisRendererX.new(root, {
      minGridDistance: 80
    })
  })
);

let xRenderer = xAxis.get("renderer");
xRenderer.grid.template.setAll({
  visible: false
});

let rangeDataItem = xAxis.makeDataItem({
  value: 0
});

let range:any = xAxis.createAxisRange(rangeDataItem);

range.get("grid").setAll({
  stroke: am5.color(0xeeeeee),
  strokeOpacity: 1,
  location: 1,
  visible: true
});

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
function createSeries(field:any, name:any, color:any, icon:any, inlegend:any) {
  let series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      name: name,
      valueXField: field,
      categoryYField: "category",
      sequencedInterpolation: true,
      fill: color,
      stroke: color,
      clustered: false
    })
  );

  series.columns.template.setAll({
    height: 50,
    fillOpacity: 0,
    strokeOpacity: 0
  });
  
  if (icon) {
    series.columns.template.set("fillPattern", am5.PathPattern.new(root, {
      color: color,
      repetition: "repeat-x",
      width: 50,
      height: 50,
      fillOpacity: 0,
      svgPath: icon
    }));
  }

  series.data.setAll(data);
  series.appear();

  if (inlegend) {
    legend.data.push(series);
  }

  return series;
}

let femaleColor = am5.color(0xf25f5c);
let maleColor = am5.color(0x247ba0);
let placeholderColor = am5.color(0xeeeeee);

let maleIcon = "M 25.1 10.7 c 2.1 0 3.7 -1.7 3.7 -3.7 c 0 -2.1 -1.7 -3.7 -3.7 -3.7 c -2.1 0 -3.7 1.7 -3.7 3.7 C 21.4 9 23 10.7 25.1 10.7 z M 28.8 11.5 H 25.1 h -3.7 c -2.8 0 -4.7 2.5 -4.7 4.8 V 27.7 c 0 2.2 3.1 2.2 3.1 0 V 17.2 h 0.6 v 28.6 c 0 3 4.2 2.9 4.3 0 V 29.3 h 0.7 h 0.1 v 16.5 c 0.2 3.1 4.3 2.8 4.3 0 V 17.2 h 0.5 v 10.5 c 0 2.2 3.2 2.2 3.2 0 V 16.3 C 33.5 14 31.6 11.5 28.8 11.5 z";
let femaleIcon = "M 18.4 15.1 L 15.5 25.5 c -0.6 2.3 2.1 3.2 2.7 1 l 2.6 -9.6 h 0.7 l -4.5 16.9 H 21.3 v 12.7 c 0 2.3 3.2 2.3 3.2 0 V 33.9 h 1 v 12.7 c 0 2.3 3.1 2.3 3.1 0 V 33.9 h 4.3 l -4.6 -16.9 h 0.8 l 2.6 9.6 c 0.7 2.2 3.3 1.3 2.7 -1 l -2.9 -10.4 c -0.4 -1.2 -1.8 -3.3 -4.2 -3.4 h -4.7 C 20.1 11.9 18.7 13.9 18.4 15.1 z M 28.6 7.2 c 0 -2.1 -1.6 -3.7 -3.7 -3.7 c -2 0 -3.7 1.7 -3.7 3.7 c 0 2.1 1.6 3.7 3.7 3.7 C 27 10.9 28.6 9.2 28.6 7.2 z";

createSeries("maleMax", "Male", placeholderColor, maleIcon, false);
createSeries("male", "Male", maleColor, maleIcon, true);
createSeries("femaleMax", "Female", placeholderColor, femaleIcon, false);
createSeries("female", "Female", femaleColor, femaleIcon, true);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
  }

}
