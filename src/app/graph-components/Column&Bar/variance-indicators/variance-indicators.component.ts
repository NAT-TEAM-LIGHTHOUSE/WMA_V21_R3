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
  selector: 'app-variance-indicators',
  templateUrl: './variance-indicators.component.html',
  styleUrls: ['./variance-indicators.component.scss'],
})
export class VarianceIndicatorsComponent  implements OnInit {


  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    // alert("init");
    this.id = "variance_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "none",
  wheelY: "none",
  layout: root.verticalLayout,
  paddingLeft: 0
}));


let data = this.data;



// Populate data
for (var i = 0; i < (data.length - 1); i++) {
  // data[i].valueNext = data[i + 1].value;
}


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  cellStartLocation: 0.1,
  cellEndLocation: 0.9,
  minGridDistance: 30,
  minorGridEnabled: true
});

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "X1",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

xRenderer.grid.template.setAll({
  location: 1
})

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/

// Column series
let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "Y1",
  categoryXField: "X1"
}));

series.columns.template.setAll({
  tooltipText: "{categoryX}: {valueY}",
  width: am5.percent(90),
  tooltipY: 0
});

series.data.setAll(data);

// Variance indicator series
let series2 = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "valueNext",
  openValueYField: "Y1",
  categoryXField: "X1",
  fill: am5.color(0x555555),
  stroke: am5.color(0x555555)
}));

series2.columns.template.setAll({
  width: 1
});

series2.data.setAll(data);

series2.bullets.push(function () {
  let label = am5.Label.new(root, {
    text: "{valueY}",
    fontWeight: "500",
    fill: am5.color(0x00cc00),
    centerY: am5.p100,
    centerX: am5.p50,
    populateText: true
  });

  // Modify text of the bullet with percent
  label.adapters.add("text", function (text, target) {
    let percent = getVariancePercent(target.dataItem);
    return percent ? percent + "%" : text;
  });

  // Set dynamic color of the bullet
  label.adapters.add("centerY", function (center, target) {
    return getVariancePercent(target.dataItem) < 0 ? 0 : center;
  });

  // Set dynamic color of the bullet
  label.adapters.add("fill", function (fill, target) {
    return getVariancePercent(target.dataItem) < 0 ? am5.color(0xcc0000) : fill;
  });

  return am5.Bullet.new(root, {
    locationY: 1,
    sprite: label
  });
});

series2.bullets.push(function () {
  let arrow = am5.Graphics.new(root, {
    rotation: -90,
    centerX: am5.p50,
    centerY: am5.p50,
    dy: 3,
    fill: am5.color(0x555555),
    stroke: am5.color(0x555555),
    draw: function (display) {
      display.moveTo(0, -3);
      display.lineTo(8, 0);
      display.lineTo(0, 3);
      display.lineTo(0, -3);
    }
  });

  arrow.adapters.add("rotation", function (rotation, target) {
    return getVariancePercent(target.dataItem) < 0 ? 90 : rotation;
  });

  arrow.adapters.add("dy", function (dy, target) {
    return getVariancePercent(target.dataItem) < 0 ? -3 : dy;
  });

  return am5.Bullet.new(root, {
    locationY: 1,
    sprite: arrow
  })
})


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear();
chart.appear(1000, 100);


function getVariancePercent(dataItem) {
  if (dataItem) {
    let value = dataItem.get("valueY");
    let openValue = dataItem.get("openValueY");
    let change = value - openValue;
    return Math.round(change / openValue * 100);
  }
  return 0;
}
}

}
