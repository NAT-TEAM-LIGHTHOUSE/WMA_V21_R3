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
  selector: 'app-carbeno-zero-progress',
  templateUrl: './carbeno-zero-progress.component.html',
  styleUrls: ['./carbeno-zero-progress.component.scss'],
})
export class CarbenoZeroProgressComponent  implements OnInit {


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
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "none",
  wheelY: "none",
  layout: root.verticalLayout,
  paddingRight: 30
}));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(
  am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  })
);

let data = [{
  category: "15",
  value: 100,
  columnSettings: {
    fill: am5.color(0xc6251a)
  }
}, {
  category: "14",
  value: 100,
  columnSettings: {
    fill: am5.color(0xc6251a)
  }
}, {
  category: "13",
  value: 100,
  columnSettings: {
    fill: am5.color(0xc6251a)
  }
}, {
  category: "12",
  value: 100,
  columnSettings: {
    fill: am5.color(0xc6251a)
  }
}, {
  category: "11",
  value: 100,
  columnSettings: {
    fill: am5.color(0xc6251a)
  }
}, {
  category: "10",
  value: 100,
  currentBullet: true,
  columnSettings: {
    fill: am5.color(0xfcc034)
  }
}, {
  category: "9",
  value: 100,
  columnSettings: {
    fill: am5.color(0xfcc034)
  }
}, {
  category: "8",
  value: 100,
  columnSettings: {
    fill: am5.color(0xfcc034)
  }
}, {
  category: "7",
  value: 100,
  columnSettings: {
    fill: am5.color(0xfcc034)
  }
}, {
  category: "6",
  value: 100,
  columnSettings: {
    fill: am5.color(0xfcc034)
  }
}, {
  category: "5",
  value: 100,
  columnSettings: {
    fill: am5.color(0x6bc352)
  }
}, {
  category: "4",
  value: 100,
  columnSettings: {
    fill: am5.color(0x6bc352)
  }
}, {
  category: "3",
  value: 100,
  columnSettings: {
    fill: am5.color(0x6bc352)
  }
}, {
  category: "2",
  value: 100,
  columnSettings: {
    fill: am5.color(0x6bc352)
  }
}, {
  category: "1",
  value: 100,
  columnSettings: {
    fill: am5.color(0x6bc352)
  }
}, {
  category: "0",
  value: 100,
  targetBullet: true,
  columnSettings: {
    fill: am5.color(0xffffff)
  }  
}];


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "category",
  renderer: am5xy.AxisRendererX.new(root, {

  }),
  tooltip: am5.Tooltip.new(root, {})
}));

let xRenderer = xAxis.get("renderer");

xRenderer.grid.template.set("forceHidden", true);
xRenderer.labels.template.set("forceHidden", true);

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  max: 400,
  strictMinMax: true,
  renderer: am5xy.AxisRendererY.new(root, {})
}));

let yRenderer = yAxis.get("renderer");

yRenderer.grid.template.set("forceHidden", true);
yRenderer.labels.template.set("forceHidden", true);


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/

let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  categoryXField: "category",
  maskBullets: false
}));

series.columns.template.setAll({
  //tooltipText: "{categoryX}: {valueY}",
  width: am5.p100,
  tooltipY: 0,
  strokeOpacity: 1,
  strokeWidth:2,
  stroke:am5.color(0xffffff),
  templateField: "columnSettings"
});

// series.bullets.push(function(root, target, dataItem) {
  // if (dataItem.dataContext.currentBullet) {
  //   let container = am5.Container.new(root, {});
    
  //   let pin = container.children.push(am5.Graphics.new(root, {
  //     fill: dataItem.dataContext.columnSettings.fill,
  //     dy: -5,
  //     centerY: am5.p100,
  //     centerX: am5.p50,
  //     svgPath: "M66.9 41.8c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4 0 11.3 20.4 32.4 20.4 32.4s20.4-21.1 20.4-32.4zM37 41.4c0-5.2 4.3-9.5 9.5-9.5s9.5 4.2 9.5 9.5c0 5.2-4.2 9.5-9.5 9.5-5.2 0-9.5-4.3-9.5-9.5z"
  //   }));
    
  //   let label = container.children.push(am5.Label.new(root, {
  //     text: dataItem.get("categoryX"),
  //     dy: -38,
  //     centerY: am5.p50,
  //     centerX: am5.p50,
  //     populateText: true,
  //     paddingTop: 5,
  //     paddingRight: 5,
  //     paddingBottom: 5,
  //     paddingLeft: 5,
  //     background: am5.RoundedRectangle.new(root, {
  //       fill: am5.color(0xffffff),
  //       cornerRadiusTL: 20,
  //       cornerRadiusTR: 20,
  //       cornerRadiusBR: 20,
  //       cornerRadiusBL: 20,
  //     })
  //   }));
    
  //   return am5.Bullet.new(root, {
  //     locationY: 1,
  //     sprite: container
  //   });
  // }
  // else if (dataItem.dataContext.targetBullet) {
  //   let container = am5.Container.new(root, {
  //     dx: 15
  //   });
    
  //   let circle = container.children.push(am5.Circle.new(root, {
  //     radius: 34,
  //     fill: am5.color(0x11326d),
  //   }));
    
  //   let label = container.children.push(am5.Label.new(root, {
  //     text: "GOAL\n[bold]ZERO[/]",
  //     textAlign: "center",
  //     //fontSize: "10",
  //     fill: am5.color(0xffffff),
  //     centerY: am5.p50,
  //     centerX: am5.p50,
  //     populateText: true,
  //   }));
  //   return am5.Bullet.new(root, {
  //     locationY: 0.5,
  //     sprite: container
  //   });
  // }
  // return false;
// });

series.data.setAll(data);

// Add labels
function addAxisLabel(category, text) {
  let rangeDataItem = xAxis.makeDataItem({
    category: category
  });
  
  let range = xAxis.createAxisRange(rangeDataItem);

  range.get("label").setAll({
    //fill: am5.color(0xffffff),
    text: text,
    forceHidden: false
  });

  range.get("grid").setAll({
    //stroke: color,
    strokeOpacity: 1,
    location: 1
  });
}

addAxisLabel("15", "20+");
addAxisLabel("10", "10");
addAxisLabel("5", "5");


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000, 100);
chart.appear(1000, 100);

}

}
