import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5index from "@amcharts/amcharts5/index";
import * as am5map from "@amcharts/amcharts5/map";

import am4geodata_worldTimeZonesLow from "@amcharts/amcharts4-geodata/worldTimeZonesLow";
import am4geodata_worldTimeZoneAreasLow from "@amcharts/amcharts4-geodata/worldTimeZoneAreasLow";


import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
// import * as am4geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-world-time-zone-map',
  templateUrl: './world-time-zone-map.component.html',
  styleUrls: ['./world-time-zone-map.component.scss'],
})
export class WorldTimeZoneMapComponent implements OnInit {

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
let chart = root.container.children.push(
  am5map.MapChart.new(root, {
    panX: "translateX",
    panY: "translateY",
    projection: am5map.geoMercator()
  })
);

let colorSet = am5.ColorSet.new(root, {});

// Create main polygon series for time zone areas
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
let areaSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am4geodata_worldTimeZoneAreasLow
  })
);

let areaPolygonTemplate = areaSeries.mapPolygons.template;
areaPolygonTemplate.setAll({ fillOpacity: 0.6 });
areaPolygonTemplate.adapters.add("fill", function (fill, target) {
  return am5.Color.saturate(
    colorSet.getIndex(areaSeries.mapPolygons.indexOf(target)),
    0.5
  );
});

areaPolygonTemplate.states.create("hover", { fillOpacity: 0.8 });

// Create main polygon series for time zones
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
let zoneSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am4geodata_worldTimeZonesLow
  })
);

zoneSeries.mapPolygons.template.setAll({
  fill: am5.color(0x000000),
  fillOpacity: 0.08
});

let zonePolygonTemplate = zoneSeries.mapPolygons.template;
zonePolygonTemplate.setAll({ interactive: true, tooltipText: "{id}" });
zonePolygonTemplate.states.create("hover", { fillOpacity: 0.3 });

// labels
let labelSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
labelSeries.bullets.push(() => {
  return am5.Bullet.new(root, {
    sprite: am5.Label.new(root, {
      text: "{id}",
      populateText: true,
      centerX: am5.p50,
      centerY: am5.p50,
      fontSize: "0.7em"
    })
  });
});

// create labels for each zone
zoneSeries.events.on("datavalidated", () => {
  am5.array.each(zoneSeries.dataItems, (dataItem) => {
    let centroid = dataItem.get("mapPolygon").visualCentroid();
    labelSeries.pushDataItem({
      id: dataItem.get("id"),
      geometry: {
        type: "Point",
        coordinates: [centroid.longitude, centroid.latitude]
      }
    });
  });
});

// Add zoom control
// https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control
chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

// Add labels and controls
let cont = chart.children.push(
  am5.Container.new(root, {
    layout: root.horizontalLayout,
    x: 20,
    y: 40
  })
);

cont.children.push(
  am5.Label.new(root, {
    centerY: am5.p50,
    text: "Map"
  })
);

let switchButton = cont.children.push(
  am5.Button.new(root, {
    themeTags: ["switch"],
    centerY: am5.p50,
    icon: am5.Circle.new(root, {
      themeTags: ["icon"]
    })
  })
);

switchButton.on("active", function () {
  if (!switchButton.get("active")) {
    chart.set("projection", am5map.geoMercator());
    chart.set("panX", "translateX");
    chart.set("panY", "translateY");
  } else {
    chart.set("projection", am5map.geoOrthographic());
    chart.set("panX", "rotateX");
    chart.set("panY", "rotateY");
  }
});

cont.children.push(
  am5.Label.new(root, {
    centerY: am5.p50,
    text: "Globe"
  })
);
// Make stuff animate on load
chart.appear(1000, 100);
  }
}
