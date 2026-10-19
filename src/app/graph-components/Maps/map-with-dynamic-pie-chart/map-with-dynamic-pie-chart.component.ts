import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5index from "@amcharts/amcharts5/index";
import * as am5map from "@amcharts/amcharts5/map";

import * as am5percent from "@amcharts/amcharts5/percent";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
// import * as am4geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-map-with-dynamic-pie-chart',
  templateUrl: './map-with-dynamic-pie-chart.component.html',
  styleUrls: ['./map-with-dynamic-pie-chart.component.scss'],
})
export class MapWithDynamicPieChartComponent implements OnInit {

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
root.setThemes([
  am5themes_Animated.new(root)
]);


// ====================================
// Create map
// ====================================

let map = root.container.children.push(
  am5map.MapChart.new(root, {
    panX: "none",
    projection: am5map.geoNaturalEarth1()
  })
);

// Create polygon series
let polygonSeries = map.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am4geodata_continentsLow,
    exclude: ["antarctica"],
    fill: am5.color(0xbbbbbb)
  })
);

let pointSeries:any = map.series.push(
  am5map.MapPointSeries.new(root, {
    // ...
  })
);

pointSeries.bullets.push(function(root, serie, x) {
  
  let chartData = x.dataContext.data;
  
  let chart = root.container.children.push(am5percent.PieChart.new(root, {
    width: chartData.width,
    height: chartData.height,
    radius: am5.p100,
    centerX: am5.p50,
    centerY: am5.p50
  }));
  
  let series = chart.series.push(am5percent.PieSeries.new(root, {
    valueField: "value",
    categoryField: "category"
  }));
  
  series.labels.template.set("forceHidden", true);
  series.ticks.template.set("forceHidden", true);
  series.data.setAll(chartData.pieData);
 
  return am5.Bullet.new(root, {
    sprite: chart
  });
});

pointSeries.bullets.push(function(root, series, x) {
  
  let chartData = x.dataContext.data;
 
  return am5.Bullet.new(root, {
    sprite: am5.Label.new(root, {
      text: chartData.title,
      centerX: am5.p50,
      centerY: am5.p100,
      dy: chartData.height * -0.5
    })
  });
});


// ====================================
// Create pie charts
// ====================================

let charts = [{
  "title": "North America",
  "latitude": 39.563353,
  "longitude": -99.316406,
  "width": 100,
  "height": 100,
  "pieData": [{
    "category": "Category #1",
    "value": 1200
  }, {
    "category": "Category #2",
    "value": 500
  }, {
    "category": "Category #3",
    "value": 765
  }, {
    "category": "Category #4",
    "value": 260
  }]
}, {
  "title": "Europe",
  "latitude": 50.896104,
  "longitude": 19.160156,
  "width": 50,
  "height": 50,
  "pieData": [{
    "category": "Category #1",
    "value": 200
  }, {
    "category": "Category #2",
    "value": 600
  }, {
    "category": "Category #3",
    "value": 350
  }]
}, {
  "title": "Asia",
  "latitude": 47.212106,
  "longitude": 103.183594,
  "width": 80,
  "height": 80,
  "pieData": [{
    "category": "Category #1",
    "value": 352
  }, {
    "category": "Category #2",
    "value": 266
  }, {
    "category": "Category #3",
    "value": 512
  }, {
    "category": "Category #4",
    "value": 199
  }]
}, {
  "title": "Africa",
  "latitude": 11.081385,
  "longitude": 21.621094,
  "width": 50,
  "height": 50,
  "pieData": [{
    "category": "Category #1",
    "value": 200
  }, {
    "category": "Category #2",
    "value": 300
  }, {
    "category": "Category #3",
    "value": 599
  }, {
    "category": "Category #4",
    "value": 512
  }]
}];

for (var i = 0; i < charts.length; i++) {
  let chart = charts[i];
  pointSeries.data.push({
    geometry: { type: "Point", coordinates: [chart.longitude, chart.latitude] },
    title: chart.title,
    data: chart
  });
}
  }
}
