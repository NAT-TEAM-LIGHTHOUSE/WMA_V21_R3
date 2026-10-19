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
  selector: 'app-grouped-sorted-columns',
  templateUrl: './grouped-sorted-columns.component.html',
  styleUrls: ['./grouped-sorted-columns.component.scss'],
})
export class GroupedSortedColumnsComponent  implements OnInit {


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
    paddingLeft: 0
  })
);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, { 
  minGridDistance: 30, 
  minorGridEnabled:true
});

xRenderer.labels.template.setAll({ text: "{realName}" });

let xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    maxDeviation: 0,
    categoryField: "category",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {
      labelText: "{realName}"
    })
  })
);

let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);

let yAxis2 = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    syncWithAxis: yAxis,
    renderer: am5xy.AxisRendererY.new(root, { opposite: true })
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis2,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "category",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{provider} {realName}: {valueY}"
    })
  })
);

series.columns.template.setAll({
  fillOpacity: 0.9,
  strokeOpacity: 0
});
series.columns.template.adapters.add("fill", (fill, target) => {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.columns.template.adapters.add("stroke", (stroke, target) => {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

let lineSeries = chart.series.push(
  am5xy.LineSeries.new(root, {
    name: "Series 2",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "quantity",
    sequencedInterpolation: true,
    stroke: chart.get("colors").getIndex(13),
    fill: chart.get("colors").getIndex(13),
    categoryXField: "category",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}"
    })
  })
);

lineSeries.strokes.template.set("strokeWidth", 2);

lineSeries.bullets.push(function () {
  return am5.Bullet.new(root, {
    locationY: 1,
    locationX: undefined,
    sprite: am5.Circle.new(root, {
      radius: 5,
      fill: lineSeries.get("fill")
    })
  });
});

// when data validated, adjust location of data item based on count
lineSeries.events.on("datavalidated", function () {
  am5.array.each(lineSeries.dataItems, function (dataItem) {
    // if count divides by two, location is 0 (on the grid)
    // if (
    //   dataItem.dataContext.count / 2 ==
    //   Math.round(dataItem.dataContext.count / 2)
    // ) {
    //   dataItem.set("locationX", 0);
    // }
    // // otherwise location is 0.5 (middle)
    // else {
    //   dataItem.set("locationX", 0.5);
    // }
  });
});

let chartData = [];

// Set data
let data = {
  "Provider 1": {
    "item 1": 10,
    "item 2": 35,
    "item 3": 5,
    "item 4": 20,
    quantity: 430
  },
  "Provider 2": {
    "item 1": 15,
    "item 3": 21,
    quantity: 210
  },
  "Provider 3": {
    "item 2": 25,
    "item 3": 11,
    "item 4": 17,
    quantity: 265
  },
  "Provider 4": {
    "item 3": 12,
    "item 4": 15,
    quantity: 98
  }
};

// process data ant prepare it for the chart
for (var providerName in data) {
  let providerData = data[providerName];

  // add data of one provider to temp array
  let tempArray = [];
  let count = 0;
  // add items
  for (var itemName in providerData) {
    if (itemName != "quantity") {
      count++;
      // we generate unique category for each column (providerName + "_" + itemName) and store realName
      tempArray.push({
        category: providerName + "_" + itemName,
        realName: itemName,
        value: providerData[itemName],
        provider: providerName
      });
    }
  }
  // sort temp array
  tempArray.sort(function (a, b) {
    if (a.value > b.value) {
      return 1;
    } else if (a.value < b.value) {
      return -1;
    } else {
      return 0;
    }
  });

  // add quantity and count to middle data item (line series uses it)
  let lineSeriesDataIndex = Math.floor(count / 2);
  tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
  tempArray[lineSeriesDataIndex].count = count;
  // push to the final data
  am5.array.each(tempArray, function (item) {
    chartData.push(item);
  });

  // create range (the additional label at the bottom)

  let range = xAxis.makeDataItem({});
  xAxis.createAxisRange(range);

  range.set("category", tempArray[0].category);
  range.set("endCategory", tempArray[tempArray.length - 1].category);

  let label = range.get("label");

  label.setAll({
    text: tempArray[0].provider,
    dy: 30,
    fontWeight: "bold",
    tooltipText: tempArray[0].provider
  });

  let tick = range.get("tick");
  tick.setAll({ visible: true, strokeOpacity: 1, length: 50, location: 0 });

  let grid = range.get("grid");
  grid.setAll({ strokeOpacity: 1 });
}

// add range for the last grid
let range = xAxis.makeDataItem({});
xAxis.createAxisRange(range);
range.set("category", chartData[chartData.length - 1].category);
let tick = range.get("tick");
tick.setAll({ visible: true, strokeOpacity: 1, length: 50, location: 1 });

let grid = range.get("grid");
grid.setAll({ strokeOpacity: 1, location: 1 });

xAxis.data.setAll(chartData);
series.data.setAll(chartData);
lineSeries.data.setAll(chartData);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);
}
}
