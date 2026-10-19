import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5index from "@amcharts/amcharts5/index";
import * as am5map from "@amcharts/amcharts5/map";



import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
// import * as am4geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-changing-map-projections',
  templateUrl: './changing-map-projections.component.html',
  styleUrls: ['./changing-map-projections.component.scss'],
})
export class ChangingMapProjectionsComponent implements OnInit {

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
let chart = root.container.children.push(
  am5map.MapChart.new(root, {
    panX: "rotateX",
    panY: "none",
    projection: am5map.geoNaturalEarth1()
  })
);

// Set themes
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create polygon series
let polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am4geodata_worldLow
  })
);

let graticuleSeries = chart.series.insertIndex(
  0, am5map.GraticuleSeries.new(root, {})
);

graticuleSeries.mapLines.template.setAll({
  stroke: am5.color(0x000000),
  strokeOpacity: 0.1
});

let backgroundSeries = chart.series.unshift(
  am5map.MapPolygonSeries.new(root, {})
);

backgroundSeries.mapPolygons.template.setAll({
  fill: am5.color(0xedf7fa),
  stroke: am5.color(0xedf7fa),
});

backgroundSeries.data.push({
  geometry: am5map.getGeoRectangle(90, 180, -90, -180)
});

// Add projection buttons
let buttons = chart.children.push(am5.Container.new(root, {
  x: am5.p50,
  centerX: am5.p50,
  y: am5.p100,
  dy: -10,
  centerY: am5.p100,
  layout: root.horizontalLayout,
  paddingTop: 5,
  paddingRight: 8,
  paddingBottom: 5,
  paddingLeft: 8,
  background: am5.RoundedRectangle.new(root, {
    fill: am5.color(0xffffff),
    fillOpacity: 0.3
  })
}));

function createButton(text, projection) {
  let button = buttons.children.push(am5.Button.new(root, {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    marginLeft: 5,
    marginRight: 5,
    label: am5.Label.new(root, {
      text: text,
    })
  }));
  
  button.events.on("click", function() {
    chart.set("projection", projection);
  });
}

createButton("geoEqualEarth", am5map.geoEqualEarth());
createButton("geoEquirectangular", am5map.geoEquirectangular());
createButton("geoMercator", am5map.geoMercator());
createButton("geoNaturalEarth1", am5map.geoNaturalEarth1());
createButton("geoOrthographic", am5map.geoOrthographic());
  }
}
