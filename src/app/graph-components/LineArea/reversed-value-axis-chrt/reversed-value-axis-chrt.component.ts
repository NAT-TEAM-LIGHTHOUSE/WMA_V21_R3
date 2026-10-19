import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CommonModule } from '@angular/common';
@Component({
standalone : true,
imports : [CommonModule],
  selector: 'app-reversed-value-axis-chrt',
  templateUrl: './reversed-value-axis-chrt.component.html',
  styleUrls: ['./reversed-value-axis-chrt.component.scss'],
})
export class ReversedValueAxisChrtComponent implements OnInit {

  @Input() data: any;
   @Input() frame: any;
   id = "";
   doubleLineFlag = false;
   @Input() subData: Subject<any>;

  constructor(public platform: Platform,private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController,  private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "reverseValueAxis_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
  // console.log("reversed value axis data raw : "+this.data);

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
    pinchZoomX: true
  })
);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  behavior: "none"
}));
cursor.lineY.set("visible", false);


// let data = [
//   {
//     X1: "1930",
//     Y1: 1,
//     Y2: 5,
//     Y3: 3
//   },
//   {
//     X1: "1934",
//     Y1: 1,
//     Y2: 2,
//     Y3: 6
//   },
//   {
//     X1: "1938",
//     Y1: 2,
//     Y2: 3,
//     Y3: 1
//   },
//   {
//     X1: "1950",
//     Y1: 3,
//     Y2: 4,
//     Y3: 1
//   },
//   {
//     X1: "1954",
//     Y1: 5,
//     Y2: 1,
//     Y3: 2
//   },
//   {
//     X1: "1958",
//     Y1: 3,
//     Y2: 2,
//     Y3: 1
//   },
//   {
//     X1: "1962",
//     Y1: 1,
//     Y2: 2,
//     Y3: 3
//   },
//   {
//     X1: "1966",
//     Y1: 2,
//     Y2: 1,
//     Y3: 5
//   },
//   {
//     X1: "1970",
//     Y1: 3,
//     Y2: 5,
//     Y3: 2
//   },
//   {
//     X1: "1974",
//     Y1: 4,
//     Y2: 3,
//     Y3: 6
//   },
//   {
//     X1: "1978",
//     Y1: 1,
//     Y2: 2,
//     Y3: 4
//   }
// ];
let data = this.data;
console.log("reversed value axis data raw : "+this.data);
// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  minorGridEnabled: true
});
xRenderer.grid.template.set("location", 0.5);
xRenderer.labels.template.setAll({
  location: 0.5,
  multiLocation: 0.5
});

let xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "X1",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    maxPrecision: 0,
    renderer: am5xy.AxisRendererY.new(root, {
      inversed: true
    })
  })
);

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/

function createSeries(name, field) {
  let series = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: name,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: field,
      categoryXField: "X1",
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "[bold]{name}[/]\n{categoryX}: {valueY}"
      })
    })
  );


  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: series.get("fill")
      })
    });
  });

  // create hover state for series and for mainContainer, so that when series is hovered,
  // the state would be passed down to the strokes which are in mainContainer.
  series.set("setStateOnChildren", true);
  series.states.create("hover", {});

  series.mainContainer.set("setStateOnChildren", true);
  series.mainContainer.states.create("hover", {});

  series.strokes.template.states.create("hover", {
    strokeWidth: 4
  });

  series.data.setAll(data);
  series.appear(1000);
}

// createSeries("Italy", "italy");
// createSeries("Germany", "germany");
// createSeries("UK", "uk");


console.log("for reversed value axis data : "+JSON.stringify(data));
let keys:any=Object.keys(data[0]);
console.log(JSON.stringify(keys));
 keys.forEach(key => {
 if(key.includes("Y") && !key.includes("label")){
  console.log("key : "+key);
createSeries(key,key);
 }
  })

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal",
  marginBottom: 20
}));

let legend:any = chart.children.push(
  am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  })
);

// Make series change state when legend item is hovered
legend.itemContainers.template.states.create("hover", {});

legend.itemContainers.template.events.on("pointerover", function (e) {
  e.target.dataItem.dataContext.hover();
});
legend.itemContainers.template.events.on("pointerout", function (e) {
  e.target.dataItem.dataContext.unhover();
});

legend.data.setAll(chart.series.values);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
}

}
