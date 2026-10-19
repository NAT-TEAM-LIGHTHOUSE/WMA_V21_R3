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
  selector: 'app-line-with-changing-colors',
  templateUrl: './line-with-changing-colors.component.html',
  styleUrls: ['./line-with-changing-colors.component.scss'],
})
export class LineWithChangingColorsComponent implements OnInit {
  @Input() subData: Subject<any>;
  @Input() data: any;
  @Input() frame: any;
  id="";
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }



  ngOnInit() {
    this.id = "lineChangingColor_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    this.gloabalObject.chartId++;
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        this.data =  this.frame.chartData; 
      this.displayChart()
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
  panX: true,
  panY: true,
  wheelX: "panX",
  wheelY: "zoomX",
  layout: root.verticalLayout,
  pinchZoomX: true,
  paddingLeft: 0
}));

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "none"
}));
cursor.lineY.set("visible", false);

let colorSet = am5.ColorSet.new(root, {});

// The data
let data = [
  {
    year: "2014",
    value: 23.5,
    strokeSettings: {
      stroke: colorSet.getIndex(0)
    },
    fillSettings: {
      fill: colorSet.getIndex(0),
    },
    bulletSettings: {
      fill: colorSet.getIndex(0)
    }
  },
  {
    year: "2015",
    value: 26,
    bulletSettings: {
      fill: colorSet.getIndex(0)
    }
  },
  {
    year: "2016",
    value: 30,
    bulletSettings: {
      fill: colorSet.getIndex(0)
    }
  },
  {
    year: "2017",
    value: 20,
    bulletSettings: {
      fill: colorSet.getIndex(0)
    }
  },
  {
    year: "2018",
    value: 30,
    strokeSettings: {
      stroke: colorSet.getIndex(3)
    },
    fillSettings: {
      fill: colorSet.getIndex(3),
    },
    bulletSettings: {
      fill: colorSet.getIndex(3)
    }
  },
  {
    year: "2019",
    value: 30,
    bulletSettings: {
      fill: colorSet.getIndex(3)
    }
  },
  {
    year: "2020",
    value: 31,
    bulletSettings: {
      fill: colorSet.getIndex(3)
    }
  },
  {
    year: "2021",
    value: 34,
    strokeSettings: {
      stroke: colorSet.getIndex(6)
    },
    fillSettings: {
      fill: colorSet.getIndex(6),
    },
    bulletSettings: {
      fill: colorSet.getIndex(6)
    }
  },
  {
    year: "2022",
    value: 33,
    bulletSettings: {
      fill: colorSet.getIndex(6)
    }
  },
  {
    year: "2023",
    value: 34,
    bulletSettings: {
      fill: colorSet.getIndex(6)
    }
  },
  {
    year: "2024",
    value: 36,
    bulletSettings: {
      fill: colorSet.getIndex(6)
    }
  }
];

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  minorGridEnabled: true,
  minGridDistance: 80
});
xRenderer.grid.template.set("location", 0.5);
xRenderer.labels.template.setAll({
  location: 0.5,
  multiLocation: 0.5
});

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "year",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxPrecision: 0,
  renderer: am5xy.AxisRendererY.new(root, {})
}));

let series = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  categoryXField: "year",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueY}",
    dy: -5
  })
}));

series.strokes.template.setAll({
  templateField: "strokeSettings",
  strokeWidth: 2
});

series.fills.template.setAll({
  visible: true,
  fillOpacity: 0.5,
  templateField: "fillSettings"
});


series.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(root, {
      templateField: "bulletSettings",
      radius: 5
    })
  });
});

series.data.setAll(data);
series.appear(1000);

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal",
  marginBottom: 20
}));

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
  }
}
