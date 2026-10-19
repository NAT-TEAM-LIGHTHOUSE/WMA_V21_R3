import { Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as  am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import * as am5percent from "@amcharts/amcharts5/percent";

@Component({
standalone : true,
imports : [],
  selector: 'app-annotating-charts',
  templateUrl: './annotating-charts.component.html',
  styleUrls: ['./annotating-charts.component.scss'],
})
export class AnnotatingChartsComponent  implements OnInit {

  constructor() {
    
   }

  ngOnInit() {
    this.displayChart();
  }

  displayChart(){
    let root = am5.Root.new("chartdiv11");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
let chart = root.container.children.push(
  am5percent.PieChart.new(root, {
    endAngle: 270
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
let series = chart.series.push(
  am5percent.PieSeries.new(root, {
    valueField: "value",
    categoryField: "category",
    endAngle: 270
  })
);

series.states.create("hidden", {
  endAngle: -90
});

series.labels.template.set("forceHidden", true);
series.ticks.template.set("forceHidden", true);

// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
series.data.setAll([{
  category: "Lithuania",
  value: 501.9
}, {
  category: "Czechia",
  value: 301.9
}, {
  category: "Ireland",
  value: 201.1
}, {
  category: "Germany",
  value: 165.8
}, {
  category: "Australia",
  value: 139.9
}, {
  category: "Austria",
  value: 128.3
}, {
  category: "UK",
  value: 99
}]);

series.appear(1000, 100);

// Set up export and annotation
let exporting = am5plugins_exporting.Exporting.new(root, {
  menu: am5plugins_exporting.ExportingMenu.new(root, {})
});

let annotationData = {"width":897,"height":500,"markers":[{"bgColor":"#EF4444","tipPosition":{"x":276.00001525878906,"y":92.33334350585938},"color":"#FFFFFF","fontFamily":"Helvetica, Arial, sans-serif","padding":5,"text":"Needs improvement","left":96.66667175292969,"top":178,"width":230,"height":48.333343505859375,"rotationAngle":0,"visualTransformMatrix":{"a":1,"b":0,"c":0,"d":1,"e":0,"f":0},"containerTransformMatrix":{"a":1,"b":0,"c":0,"d":1,"e":0,"f":0},"typeName":"CalloutMarker","state":"select"},{"arrowType":"end","strokeColor":"#7C3AED","strokeWidth":3,"strokeDasharray":"","x1":733.3333740234375,"y1":125.33334350585938,"x2":539.3333740234375,"y2":225.6666717529297,"typeName":"ArrowMarker","state":"select"},{"arrowType":"end","strokeColor":"#7C3AED","strokeWidth":3,"strokeDasharray":"","x1":736.6666870117188,"y1":153.33334350585938,"x2":518.6666870117188,"y2":343.0000915527344,"typeName":"ArrowMarker","state":"select"},{"color":"#EF4444","fontFamily":"Helvetica, Arial, sans-serif","padding":5,"text":"OK","left":706.0000610351562,"top":125.00001525878906,"width":100,"height":30,"rotationAngle":0,"visualTransformMatrix":{"a":1,"b":0,"c":0,"d":1,"e":0,"f":0},"containerTransformMatrix":{"a":1,"b":0,"c":0,"d":1,"e":0,"f":0},"typeName":"TextMarker","state":"select"}]};

let annotator = am5plugins_exporting.Annotator.new(root, {
  markerState: annotationData
});

// let menuitems = exporting.get("menu").get("items");

// menuitems.push({
//   type: "separator"
// });

// menuitems.push({
//   type: "custom",
//   label: "Annotate",
//   callback: function() {
//     this.close();
//     annotator.toggle();
//   }
// });

  }

}
