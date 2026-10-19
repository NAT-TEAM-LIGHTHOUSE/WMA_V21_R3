import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-risk-heatmap',
  templateUrl: './risk-heatmap.component.html',
  styleUrls: ['./risk-heatmap.component.scss'],
})
export class RiskHeatmapComponent  implements OnInit {


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
let chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "none",
    wheelY: "none",
    paddingLeft: 0,
    paddingRight: 0,
    layout: root.verticalLayout
  })
);

// Create axes and their renderers
let yRenderer = am5xy.AxisRendererY.new(root, {
  visible: false,
  minGridDistance: 20,
  inversed: true,
  minorGridEnabled: true
});

yRenderer.grid.template.set("visible", false);

let yAxis = chart.yAxes.push(
  am5xy.CategoryAxis.new(root, {
    renderer: yRenderer,
    categoryField: "category"
  })
);

let xRenderer = am5xy.AxisRendererX.new(root, {
  visible: false,
  minGridDistance: 30,
  inversed: true,
  minorGridEnabled: true
});

xRenderer.grid.template.set("visible", false);

let xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    renderer: xRenderer,
    categoryField: "category"
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/#Adding_series
let series = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    calculateAggregates: true,
    stroke: am5.color(0xffffff),
    clustered: false,
    xAxis: xAxis,
    yAxis: yAxis,
    categoryXField: "x",
    categoryYField: "y",
    valueField: "value"
  })
);

series.columns.template.setAll({
  tooltipText: "{value}",
  strokeOpacity: 1,
  strokeWidth: 2,
  cornerRadiusTL: 5,
  cornerRadiusTR: 5,
  cornerRadiusBL: 5,
  cornerRadiusBR: 5,
  width: am5.percent(100),
  height: am5.percent(100),
  templateField: "columnSettings"
});

let circleTemplate = am5.Template.new({});

// Add heat rule
// https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
series.set("heatRules", [{
  target: circleTemplate,
  min: 10,
  max: 35,
  dataField: "value",
  key: "radius"
}]);

series.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(
      root,
      {
        fill: am5.color(0x000000),
        fillOpacity: 0.5,
        strokeOpacity: 0
      },
      // circleTemplate
    )
  });
});

series.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Label.new(root, {
      fill: am5.color(0xffffff),
      populateText: true,
      centerX: am5.p50,
      centerY: am5.p50,
      fontSize: 10,
      text: "{value}"
    })
  });
});

let colors = {
  critical: am5.color(0xca0101),
  bad: am5.color(0xe17a2d),
  medium: am5.color(0xe1d92d),
  good: am5.color(0x5dbe24),
  verygood: am5.color(0x0b7d03)
};

// Set data
// https://www.amcharts.com/docs/v5/charts/xy-chart/#Setting_data
let data = [
  {
    y: "Critical",
    x: "Very good",
    columnSettings: {
      fill: colors.medium
    },
    value: 20
  },
  {
    y: "Bad",
    x: "Very good",
    columnSettings: {
      fill: colors.good
    },
    value: 15
  },
  {
    y: "Medium",
    x: "Very good",
    columnSettings: {
      fill: colors.verygood
    },
    value: 25
  },
  {
    y: "Good",
    x: "Very good",
    columnSettings: {
      fill: colors.verygood
    },
    value: 15
  },
  {
    y: "Very good",
    x: "Very good",
    columnSettings: {
      fill: colors.verygood
    },
    value: 12
  },
  {
    y: "Critical",
    x: "Good",
    columnSettings: {
      fill: colors.bad
    },
    value: 30
  },
  {
    y: "Bad",
    x: "Good",
    columnSettings: {
      fill: colors.medium
    },
    value: 24
  },
  {
    y: "Medium",
    x: "Good",
    columnSettings: {
      fill: colors.good
    },
    value: 25
  },
  {
    y: "Good",
    x: "Good",
    columnSettings: {
      fill: colors.verygood
    },
    value: 15
  },
  {
    y: "Very good",
    x: "Good",
    columnSettings: {
      fill: colors.verygood
    },
    value: 25
  },
  {
    y: "Critical",
    x: "Medium",
    columnSettings: {
      fill: colors.bad
    },
    value: 33
  },
  {
    y: "Bad",
    x: "Medium",
    columnSettings: {
      fill: colors.bad
    },
    value: 14
  },
  {
    y: "Medium",
    x: "Medium",
    columnSettings: {
      fill: colors.medium
    },
    value: 20
  },
  {
    y: "Good",
    x: "Medium",
    columnSettings: {
      fill: colors.good
    },
    value: 19
  },
  {
    y: "Very good",
    x: "Medium",
    columnSettings: {
      fill: colors.good
    },
    value: 25
  },
  {
    y: "Critical",
    x: "Bad",
    columnSettings: {
      fill: colors.critical
    },
    value: 31
  },
  {
    y: "Bad",
    x: "Bad",
    columnSettings: {
      fill: colors.critical
    },
    value: 24
  },
  {
    y: "Medium",
    x: "Bad",
    columnSettings: {
      fill: colors.bad
    },
    value: 25
  },
  {
    y: "Good",
    x: "Bad",
    columnSettings: {
      fill: colors.medium
    },
    value: 15
  },
  {
    y: "Very good",
    x: "Bad",
    columnSettings: {
      fill: colors.good
    },
    value: 15
  },
  {
    y: "Critical",
    x: "Critical",
    columnSettings: {
      fill: colors.critical
    },
    value: 12
  },
  {
    y: "Bad",
    x: "Critical",
    columnSettings: {
      fill: colors.critical
    },
    value: 14
  },
  {
    y: "Medium",
    x: "Critical",
    columnSettings: {
      fill: colors.critical
    },
    value: 15
  },
  {
    y: "Good",
    x: "Critical",
    columnSettings: {
      fill: colors.bad
    },
    value: 25
  },
  {
    y: "Very good",
    x: "Critical",
    columnSettings: {
      fill: colors.medium
    },
    value: 19
  }
];

series.data.setAll(data);

yAxis.data.setAll([
  { category: "Critical" },
  { category: "Bad" },
  { category: "Medium" },
  { category: "Good" },
  { category: "Very good" }
]);

xAxis.data.setAll([
  { category: "Critical" },
  { category: "Bad" },
  { category: "Medium" },
  { category: "Good" },
  { category: "Very good" }
]);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
chart.appear(1000, 100);

}

}
