import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CommonModule } from '@angular/common';

@Component({
standalone : true,
imports : [CommonModule],
  selector: 'app-drag-ordering-bars',
  templateUrl: './drag-ordering-bars.component.html',
  styleUrls: ['./drag-ordering-bars.component.scss'],
})
export class DragOrderingBarsComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private ngZone:NgZone) {
  }


//  ngOnInit() {
//    // alert("init");
//    // this.id = "compassChart"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
//    // this.displayChart();
//    this.gloabalObject.chartId++;
//    setTimeout(() => {
//      this.ngZone.runOutsideAngular(() => {
//        this.data =  this.frame.chartData; 
//      this.displayChart();
//      })
//    }, 100);

   
//    this.subData.subscribe(data => {
//      this.data = data;
//      this.displayChart();
//    })
//  }

  ngOnInit() {
    // alert("init");
    this.id = "dragChart"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
  let root = am5.Root.new(this.id);


let myTheme = am5.Theme.new(root);

myTheme.rule("Grid", ["base"]).setAll({
  strokeOpacity: 0.1
});


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root),
  myTheme
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


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let yRenderer = am5xy.AxisRendererY.new(root, {
  minGridDistance: 30,
  minorGridEnabled: true
});
yRenderer.grid.template.set("location", 1);

let yAxis = chart.yAxes.push(
  am5xy.CategoryAxis.new(root, {
    maxDeviation: 0,
    categoryField: "country",
    renderer: yRenderer
  })
);

let xAxis = chart.xAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 0,
    min: 0,
    renderer: am5xy.AxisRendererX.new(root, {
      visible: true,
      strokeOpacity: 0.1,
      minGridDistance: 80
    })
  })
);


// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueXField: "value",
    sequencedInterpolation: true,
    categoryYField: "country"
  })
);

let columnTemplate = series.columns.template;

columnTemplate.setAll({
  draggable: true,
  cursorOverStyle: "pointer",
  tooltipText: "{X1_label}: {valueY} ({Y1_label})",
  cornerRadiusBR: 10,
  cornerRadiusTR: 10,
  strokeOpacity: 0
});
columnTemplate.adapters.add("fill", (fill, target) => {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

columnTemplate.adapters.add("stroke", (stroke, target) => {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

columnTemplate.events.on("dragstop", () => {
  sortCategoryAxis();
});

// Get series item by category
function getSeriesItem(category) {
  for (var i = 0; i < series.dataItems.length; i++) {
    let dataItem = series.dataItems[i];
    if (dataItem.get("categoryY") == category) {
      return dataItem;
    }
  }
  return null;
}


// Axis sorting
function sortCategoryAxis() {
  // Sort by value
  series.dataItems.sort(function (x, y) {
    return y.get("graphics").y() - x.get("graphics").y();
  });

  let easing = am5.ease.out(am5.ease.cubic);

  // Go through each axis item
  am5.array.each(yAxis.dataItems, function (dataItem) {
    // get corresponding series item
    let seriesDataItem = getSeriesItem(dataItem.get("category"));

    if (seriesDataItem) {
      // get index of series data item
      let index = series.dataItems.indexOf(seriesDataItem);

      let column = seriesDataItem.get("graphics");

      // position after sorting
      let fy =
        yRenderer.positionToCoordinate(yAxis.indexToPosition(index)) -
        column.height() / 2;

      // set index to be the same as series data item index
      if (index != dataItem.get("index")) {
        dataItem.set("index", index);

        // current position
        let x = column.x();
        let y = column.y();

        column.set("dy", -(fy - y));
        column.set("dx", x);

        column.animate({ key: "dy", to: 0, duration: 600, easing: easing });
        column.animate({ key: "dx", to: 0, duration: 600, easing: easing });
      } else {
        column.animate({ key: "y", to: fy, duration: 600, easing: easing });
        column.animate({ key: "x", to: 0, duration: 600, easing: easing });
      }
    }
  });

  // Sort axis items by index.
  // This changes the order instantly, but as dx and dy is set and animated,
  // they keep in the same places and then animate to true positions.
  yAxis.dataItems.sort(function (x, y) {
    return x.get("index") - y.get("index");
  });
}

// Set data
// let data = [{
//   country: "USA",
//   value: 2025
// }, {
//   country: "China",
//   value: 1882
// }, {
//   country: "Japan",
//   value: 1809
// }, {
//   country: "Germany",
//   value: 1322
// }, {
//   country: "UK",
//   value: 1122
// }];
let data = this.data;
if (data && data.length > 0) {
  // Transform data to match chart expectations
  let transformedData = data.map(item => ({
    country: item.X1,
    value: item.Y1,
    X1_label: item.X1_label,
    Y1_label: item.Y1_label
  }));
  yAxis.data.setAll(transformedData);
  series.data.setAll(transformedData);
} else {
  console.warn('No data available for chart');
}


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);

}

}
