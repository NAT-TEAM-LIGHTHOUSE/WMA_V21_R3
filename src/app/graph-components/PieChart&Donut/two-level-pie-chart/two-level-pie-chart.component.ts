import { Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-two-level-pie-chart',
  templateUrl: './two-level-pie-chart.component.html',
  styleUrls: ['./two-level-pie-chart.component.scss'],
})
export class TwoLevelPieChartComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    this.displayChart();
  }
  displayChart(){
    let root = am5.Root.new("chartdivtwo");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
// start and end angle must be set both for chart and series
let chart = root.container.children.push(
  am5percent.PieChart.new(root, {
    layout: root.verticalLayout
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
// start and end angle must be set both for chart and series
let series0 = chart.series.push(
  am5percent.PieSeries.new(root, {
    valueField: "value",
    categoryField: "category",
    alignLabels: false,
    radius: am5.percent(100),
    innerRadius: am5.percent(80)
  })
);

series0.states.create("hidden", {
  startAngle: 180,
  endAngle: 180
});

series0.slices.template.setAll({
  fillOpacity: 0.5,
  strokeOpacity: 0,
  templateField: "settings"
});

series0.slices.template.states.create("hover", { scale: 1 });
series0.slices.template.states.create("active", { shiftRadius:0 });

series0.labels.template.setAll({
  templateField: "settings"
});

series0.ticks.template.setAll({
  templateField: "settings"
});

series0.labels.template.setAll({
  textType: "circular",
  radius: 30
});

// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
series0.data.setAll([
  {
    category: "First + Second",
    value: 60
  },
  {
    category: "Unused",
    value: 30,
    settings: { forceHidden: true }
  }
]);

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
// start and end angle must be set both for chart and series
let series1 = chart.series.push(
  am5percent.PieSeries.new(root, {
    radius: am5.percent(95),
    innerRadius: am5.percent(85),
    valueField: "value",
    categoryField: "category",
    alignLabels: false
  })
);

series1.states.create("hidden", {
  startAngle: 180,
  endAngle: 180
});

series1.slices.template.setAll({
  templateField: "sliceSettings",
  strokeOpacity: 0
});

series1.labels.template.setAll({
  textType: "circular"
});

// series1.labels.template.adapters.add("radius", function (radius, target) {
//   let dataItem = target.dataItem;
//   let slice = dataItem.get("visible");
//   // return -(slice.get("") - slice.get("innerRadius")) / 2 - 10;
// });

series1.slices.template.states.create("hover", { scale: 1 });
series1.slices.template.states.create("active", { shiftRadius:0 });

series1.ticks.template.setAll({
  forceHidden: true
});

// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
series1.data.setAll([{
  category: "First",
  value: 30
}, {
  category: "Second",
  value: 30
}, {
  category: "Remaining",
  value: 30,
  sliceSettings: { fill: am5.color(0xdedede) }
}]);
  }

}
