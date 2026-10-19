import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5index from "@amcharts/amcharts5/index";
import * as am5map from "@amcharts/amcharts5/map";


import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
// import * as am4geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-map-with-sized-pin-bullets',
  templateUrl: './map-with-sized-pin-bullets.component.html',
  styleUrls: ['./map-with-sized-pin-bullets.component.scss'],
})
export class MapWithSizedPinBulletsComponent implements OnInit {

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

let pointSeries = map.series.push(
  am5map.MapPointSeries.new(root, {})
);

let colorSet = am5.ColorSet.new(root, {step:2});

pointSeries.bullets.push(function(root, series, dataItem:any) {
  let value = dataItem.dataContext.value;

  let container = am5.Container.new(root, {});
  let color = colorSet.next();
  let radius = 15 + value / 20 * 20;
  let circle = container.children.push(am5.Circle.new(root, {
    radius: radius,
    fill: color,
    dy: -radius * 2
  }))

  let pole = container.children.push(am5.Line.new(root, {
    stroke: color,
    height: -40,
    strokeGradient: am5.LinearGradient.new(root, {
      stops:[
        { opacity: 1 },
        { opacity: 1 },
        { opacity: 0 }
      ]
    })
  }));

  let label = container.children.push(am5.Label.new(root, {
    text: value + "%",
    fill: am5.color(0xffffff),
    fontWeight: "400",
    centerX: am5.p50,
    centerY: am5.p50,
    dy: -radius * 2
  }))

  let titleLabel = container.children.push(am5.Label.new(root, {
    text: dataItem.dataContext.title,
    fill: color,
    fontWeight: "500",
    fontSize: "1em",
    centerY: am5.p50,
    dy: -radius * 2,
    dx: radius
  }))
 
  return am5.Bullet.new(root, {
    sprite: container
  });
});




// ====================================
// Create pins
// ====================================

let data = [{
  "title": "United States",
  "latitude": 39.563353,
  "longitude": -99.316406,
  "width": 100,
  "height": 100,
  "value":12
}, {
  "title": "European Union",
  "latitude": 50.896104,
  "longitude": 19.160156,
  "width": 50,
  "height": 50,
  "value":15
}, {
  "title": "Asia",
  "latitude": 47.212106,
  "longitude": 103.183594,
  "width": 80,
  "height": 80,
  "value":8  
}, {
  "title": "Africa",
  "latitude": 11.081385,
  "longitude": 21.621094,
  "width": 50,
  "height": 50,
  "value":5
}];

for (var i = 0; i < data.length; i++) {
  let d = data[i];
  pointSeries.data.push({
    geometry: { type: "Point", coordinates: [d.longitude, d.latitude] },
    title: d.title,
    value: d.value
  });
}
  }
}
