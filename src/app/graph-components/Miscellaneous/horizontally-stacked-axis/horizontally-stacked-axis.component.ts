import { Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as  am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import * as am5percent from "@amcharts/amcharts5/percent";

@Component({
standalone : true,
imports : [],
  selector: 'app-horizontally-stacked-axis',
  templateUrl: './horizontally-stacked-axis.component.html',
  styleUrls: ['./horizontally-stacked-axis.component.scss'],
})
export class HorizontallyStackedAxisComponent  implements OnInit {
 data :any=[]
  constructor() { }

  ngOnInit() {
    this.displayChart()
  }


  displayChart(){
     this.data = [];
let value1 = 20;
let value2 = 200;
let value3 = 2000;

let names = [
  "Raina",
  "Demarcus",
  "Carlo",
  "Jacinda",
  "Richie",
  "Antony",
  "Amada",
  "Idalia",
  "Janella",
  "Marla",
  "Curtis",
  "Shellie",
  "Meggan",
  "Nathanael",
  "Jannette",
  "Tyrell",
  "Sheena",
  "Maranda",
  "Briana"
];

for (var i = 0; i < names.length; i++) {
  value1 += Math.round(
    (Math.random() < 0.5 ? 1 : -1) * Math.random() * value1 * 0.2
  );
  value2 += Math.round(
    (Math.random() < 0.5 ? 1 : -1) * Math.random() * value2 * 0.2
  );
  value3 += Math.round(
    (Math.random() < 0.5 ? 1 : -1) * Math.random() * value3 * 0.2
  );
  this.data.push({
    category: names[i],
    value1: value1,
    value2: value2,
    value3: value3
  });
}

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
let root = am5.Root.new("chartdiv19");

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
    panY: true,
    wheelX: "none",
    wheelY: "zoomY",
    arrangeTooltips: false,
  pinchZoomY:true
  })
);

// make x axes stack
chart.bottomAxesContainer.set("layout", root.horizontalLayout);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let yRenderer = am5xy.AxisRendererY.new(root, {
  minGridDistance: 25
});

yRenderer.labels.template.setAll({
  multiLocation: 0.5,
  location: 0.5,
  paddingRight: 15
});

yRenderer.grid.template.set("location", 0.5);

let yAxis = chart.yAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "category",
    tooltip: am5.Tooltip.new(root, {}),
    renderer: yRenderer
  })
);

yAxis.data.setAll(this.data);

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
function createSeries(field:any, margin:any, column:any) {
  let xRenderer = am5xy.AxisRendererX.new(root, {
    minGridDistance: 40
  });
  
  xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50
  });
  
  let xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {
        animationDuration: 0
      }),
      marginLeft: margin // this makes gap between axes
    })
  );

  let series:any;
  if (column) {
    series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: field,
        categoryYField: "category",
        sequencedInterpolation: true,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueX}"
        })
      })
    );
  } else {
    series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: field,
        categoryYField: "category",
        sequencedInterpolation: true,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueX}"
        })
      })
    );
  }

  if (!column) {
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1,
        locationY: 0.5,
        sprite: am5.Circle.new(root, {
          radius: 4,
          fill: series.get("fill")
        })
      });
    });
  }

  series.data.setAll();
  series.appear();

  return series;
}

createSeries("value1", 0, true);
createSeries("value2", 30, false);
createSeries("value3", 30, false);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "none",
  yAxis: yAxis
}));

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
  }

}
