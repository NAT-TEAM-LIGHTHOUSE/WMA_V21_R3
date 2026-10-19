import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-line-with-customs-bullet',
  templateUrl: './line-with-customs-bullet.component.html',
  styleUrls: ['./line-with-customs-bullet.component.scss'],
})
export class LineWithCustomsBulletComponent implements OnInit {

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
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    layout: root.verticalLayout,
    pinchZoomX: true,
    paddingLeft: 0
  })
);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set(
  "cursor",
  am5xy.XYCursor.new(root, {
    behavior: "none"
  })
);
cursor.lineY.set("visible", false);

let colorSet = am5.ColorSet.new(root, {});

// The data
let data = [
  {
    date: "2021-12-31 18:00",
    value: 0
  },
  {
    date: "2021-12-31 19:00",
    value: 0
  },
  {
    date: "2021-12-31 20:00",
    value: 0
  },
  {
    date: "2021-12-31 21:00",
    value: 0.3
  },
  {
    date: "2021-12-31 22:00",
    value: 0.8
  },
  {
    date: "2021-12-31 23:00",
    value: 1.2
  },
  {
    date: "2022-01-01 00:00",
    value: 2.2
  },
  {
    date: "2022-01-01 01:00",
    value: 2.5
  },
  {
    date: "2022-01-01 02:00",
    value: 2.2
  }
];

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  minorGridEnabled: true,
  minGridDistance: 70
});
xRenderer.grid.template.set("location", 0.5);
xRenderer.labels.template.setAll({
  location: 0.5,
  multiLocation: 0.5
});

let xAxis = chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    baseInterval: { timeUnit: "hour", count: 1 },
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

let yRenderer = am5xy.AxisRendererY.new(root, {});
yRenderer.grid.template.set("forceHidden", true);
yRenderer.labels.template.set("minPosition", 0.05);

let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    maxPrecision: 0,
    extraMin: 0.1,
    renderer: yRenderer
  })
);

let series = chart.series.push(
  am5xy.LineSeries.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    valueXField: "date",
    maskBullets: false,
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "vertical",
      dy: -20,
      labelText: "{valueY}"
    })
  })
);

// Set up data processor to parse string dates
// https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
series.data.processor = am5.DataProcessor.new(root, {
  dateFormat: "yyyy-MM-dd HH:mm",
  dateFields: ["date"]
});

series.strokes.template.setAll({ strokeDasharray: [3, 3], strokeWidth: 2 });


let i = -1;
series.bullets.push(function () {
  i++;

  if (i > 7) {
    i = 0;
  }

  let container = am5.Container.new(root, {
    centerX: am5.p50,
    centerY: am5.p50
  });

  container.children.push(
    am5.Circle.new(root, { radius: 20, fill: series.get("fill") })
  );

  container.children.push(
    am5.Picture.new(root, {
      centerX: am5.p50,
      centerY: am5.p50,
      width: 23,
      height: 23,
      src: "https://amcharts.com/wp-content/uploads/assets/timeline/timeline" + i + ".svg"
    })
  );

  return am5.Bullet.new(root, {
    sprite: container
  });
});

series.data.setAll(data);
series.appear(1000);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
  }
}
