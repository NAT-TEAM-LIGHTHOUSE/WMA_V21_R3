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
  selector: 'app-stacked-bar-chart-negative-values',
  templateUrl: './stacked-bar-chart-negative-values.component.html',
  styleUrls: ['./stacked-bar-chart-negative-values.component.scss'],
})
export class StackedBarChartNegativeValuesComponent  implements OnInit {


  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    // alert("init");
    this.id = "stackedBarNegative_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
    layout: root.verticalLayout,
    arrangeTooltips: false,
    paddingLeft: 0,
    paddingRight: 10
  })
);

// Use only absolute numbers
chart.getNumberFormatter().set("numberFormat", "#.#s");

// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(
  am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  })
);
let data = this.data;
// Data
// let data = [
//   {
//     age: "85+",
//     male: -0.1,
//     female: 0.3
//   },
//   {
//     age: "80-54",
//     male: -0.2,
//     female: 0.3
//   },
//   {
//     age: "75-79",
//     male: -0.3,
//     female: 0.6
//   },
//   {
//     age: "70-74",
//     male: -0.5,
//     female: 0.8
//   },
//   {
//     age: "65-69",
//     male: -0.8,
//     female: 1.0
//   },
//   {
//     age: "60-64",
//     male: -1.1,
//     female: 1.3
//   },
//   {
//     age: "55-59",
//     male: -1.7,
//     female: 1.9
//   },
//   {
//     age: "50-54",
//     male: -2.2,
//     female: 2.5
//   },
//   {
//     age: "45-49",
//     male: -2.8,
//     female: 3.0
//   },
//   {
//     age: "40-44",
//     male: -3.4,
//     female: 3.6
//   },
//   {
//     age: "35-39",
//     male: -4.2,
//     female: 4.1
//   },
//   {
//     age: "30-34",
//     male: -5.2,
//     female: 4.8
//   },
//   {
//     age: "25-29",
//     male: -5.6,
//     female: 5.1
//   },
//   {
//     age: "20-24",
//     male: -5.1,
//     female: 5.1
//   },
//   {
//     age: "15-19",
//     male: -3.8,
//     female: 3.8
//   },
//   {
//     age: "10-14",
//     male: -3.2,
//     female: 3.4
//   },
//   {
//     age: "5-9",
//     male: -4.4,
//     female: 4.1
//   },
//   {
//     age: "0-4",
//     male: -5.0,
//     female: 4.8
//   }
// ];

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let yAxis = chart.yAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "X1",
    renderer: am5xy.AxisRendererY.new(root, {
      inversed: true,
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true,
      minGridDistance: 20
    })
  })
);

yAxis.data.setAll(data);

let xAxis = chart.xAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererX.new(root, {
      minGridDistance: 60,
      strokeOpacity: 0.1
    })
  })
);

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
function createSeries(field, labelCenterX, pointerOrientation, rangeValue) {
  let series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: field,
      categoryYField: "X1",
      sequencedInterpolation: true,
      clustered: false,
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: pointerOrientation,
        labelText: "{categoryY}: {valueX}"
      })
    })
  );

  series.columns.template.setAll({
    height: am5.p100,
    strokeOpacity: 0,
    fillOpacity: 0.8
  });

  series.bullets.push(function() {
    return am5.Bullet.new(root, {
      locationX: 1,
      locationY: 0.5,
      sprite: am5.Label.new(root, {
        centerY: am5.p50,
        text: "{valueX}",
        populateText: true,
        centerX: labelCenterX
      })
    });
  });

  series.data.setAll(data);
  series.appear();

  let rangeDataItem = xAxis.makeDataItem({
    value: rangeValue
  });
  xAxis.createAxisRange(rangeDataItem);
  rangeDataItem.get("grid").setAll({
    strokeOpacity: 1,
    stroke: series.get("stroke")
  });

  let label = rangeDataItem.get("label");
  label.setAll({
    text: field.toUpperCase(),
    fontSize: "1.1em",
    fill: series.get("stroke"),
    paddingTop: 10,
    isMeasured: false,
    centerX: labelCenterX
  });
  label.adapters.add("dy", function() {
    return -chart.plotContainer.height();
  });

  return series;
}

createSeries("Y1", am5.p100, "right", -3);
createSeries("Y2", 0, "left", 4);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "zoomY"
}));
cursor.lineY.set("forceHidden", true);
cursor.lineX.set("forceHidden", true);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
}

}
