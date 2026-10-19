import { Component, OnInit } from '@angular/core';
import * as  am5xy from "@amcharts/amcharts5/xy";
import * as  am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-vertically-stacked-axes-chart',
  templateUrl: './vertically-stacked-axes-chart.component.html',
  styleUrls: ['./vertically-stacked-axes-chart.component.scss'],
})
export class VerticallyStackedAxesChartComponent  implements OnInit {
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
let root = am5.Root.new("chartdiv36");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: true,
    panY: false,
    wheelX: "none",
    // wheelY: "true",
    arrangeTooltips: false,
  pinchZoomX:true
  })
);

// make y axes stack
chart.leftAxesContainer.set("layout", root.verticalLayout);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 70 });
xRenderer.labels.template.setAll({
  multiLocation: 0.5,
  location: 0.5,
  centerY: am5.p50,
  centerX: am5.p50,
  paddingTop: 10
});

xRenderer.grid.template.set("location", 0.5);

let xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "category",
    tooltip: am5.Tooltip.new(root, {}),
    renderer: xRenderer
  })
);

xAxis.data.setAll(this.data);

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
function createSeries(field:any, margin:any, column:any) {
  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      tooltip: am5.Tooltip.new(root, {
        animationDuration: 0
      }),
      x: am5.p100,
      centerX: am5.p100,
      marginTop: margin // this makes gap between axes
    })
  );

 let series:any;
  if (column) {
    series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: field,
        categoryXField: "category",
        sequencedInterpolation: true,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "vertical",
          labelText: "{valueY}"
        })
      })
    );
  } else {
    series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: field,
        categoryXField: "category",
        sequencedInterpolation: true,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "vertical",
          labelText: "{valueY}"
        })
      })
    );
  }

  if (!column) {
    series.bullets.push(function() {
      return am5.Bullet.new(root, {
        locationY: 1,
        locationX: 0.5,
        sprite: am5.Circle.new(root, {
          radius: 4,
          fill: series.get("fill")
        })
      });
    });
  }

  // series.data.setAll(data);
  series.appear();

  return series;
}

createSeries("value1", 0, false);
createSeries("value2", 40, false);
createSeries("value3", 40, true);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "none",
  xAxis: xAxis
}));


// show x Axis label next to the panel on which cursor currently is
// willl move above other elements
xAxis.set("layer", 50);

cursor.events.on("cursormoved", function() {
  // get relative position of a cursor
  let position = cursor.getPrivate("positionY");
  // nearest y axis index
  let axisIndex = Math.floor(chart.yAxes.length )

  // nearest y axis
  let axis = chart.yAxes.getIndex(axisIndex);

  // y
  // let y = axis.y() + axis.height();
  // let dy = Math.round(-(chart.plotContainer.height() - y));
  // let tooltip = xAxis.get("tooltip");

  // update y of x axis
  // if(Math.round(xAxis.get("dy")) != dy){
  //   xAxis.animate({ key: "dy", to: dy, duration: 600, easing: am5.ease.out(am5.ease.cubic) });
  //   xAxis.set("y", 0);
  //   if(tooltip){
  //     tooltip.hide(0);
  //   }
  // }
  // else{
  //   tooltip.show(300);
  // }
})

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
  }

}
