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
import { AnyAaaaRecord } from 'dns';
@Component({
standalone : true,
imports : [],
  selector: 'app-pacific-centered-map',
  templateUrl: './pacific-centered-map.component.html',
  styleUrls: ['./pacific-centered-map.component.scss'],
})














export class PacificCenteredMapComponent implements OnInit {

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


// Create the map chart
// https://www.amcharts.com/docs/v5/charts/map-chart/
let chart = root.container.children.push(am5map.MapChart.new(root, {
  panX: "rotateX",
  panY: "rotateY",
  projection: am5map.geoOrthographic(),
  paddingBottom: 20,
  paddingTop: 20,
  paddingLeft: 20,
  paddingRight: 20
}));



// Create main polygon series for countries
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
  geoJSON: am4geodata_worldLow 
}));

polygonSeries.mapPolygons.template.setAll({
  tooltipText: "{name}",
  toggleKey: "active",
  interactive: true
});

polygonSeries.mapPolygons.template.states.create("hover", {
  fill: root.interfaceColors.get("primaryButtonHover")
});

polygonSeries.mapPolygons.template.states.create("active", {
  fill: root.interfaceColors.get("primaryButtonHover")
});


// Create series for background fill
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
let backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
backgroundSeries.mapPolygons.template.setAll({
  fill: root.interfaceColors.get("alternativeBackground"),
  fillOpacity: 0.1,
  strokeOpacity: 0
});
backgroundSeries.data.push({
  geometry: am5map.getGeoRectangle(90, 180, -90, -180)
});

let graticuleSeries = chart.series.unshift(
  am5map.GraticuleSeries.new(root, {
    step: 10
  })
);

graticuleSeries.mapLines.template.set("strokeOpacity", 0.1)

// Set up events
let previousPolygon;

polygonSeries.mapPolygons.template.on("active", function(active, target:any) {
  if (previousPolygon && previousPolygon != target) {
    previousPolygon.set("active", false);
  }
  if (target.get("active")) {
    selectCountry(target.dataItem.get("id"));
  }
  previousPolygon = target;
});

function selectCountry(id) {
  let dataItem = polygonSeries.getDataItemById(id);
  let target = dataItem.get("mapPolygon");
  if (target) {
    let centroid = target.geoCentroid();
    if (centroid) {
      chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
      chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
    }
  }
}

// Uncomment this to pre-center the globe on a country when it loads
//polygonSeries.events.on("datavalidated", function() {
//  selectCountry("AU");
//});


// Make stuff animate on load
chart.appear(1000, 100);
  }
}
