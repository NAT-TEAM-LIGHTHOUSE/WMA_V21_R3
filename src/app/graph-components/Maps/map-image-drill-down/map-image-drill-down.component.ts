import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5index from "@amcharts/amcharts5/index";
import * as am5map from "@amcharts/amcharts5/map";



import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";

// import * as am4geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { AnyMxRecord } from 'dns';
@Component({
standalone : true,
imports : [],
  selector: 'app-map-image-drill-down',
  templateUrl: './map-image-drill-down.component.html',
  styleUrls: ['./map-image-drill-down.component.scss'],
})
export class MapImageDrillDownComponent implements OnInit {

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
    let root:any = am5.Root.new("chartdiv"); 

// Set themes
root.setThemes([
  am5themes_Animated.new(root)
]);

let chart = root.container.children.push(
  am5map.MapChart.new(root, {
    panX: "rotateX",
    projection: am5map.geoAlbersUsa()
  })
);

// Create polygon series
let polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am4geodata_usaLow
  })
);

polygonSeries.mapPolygons.template.setAll({
  tooltipText: "{name}"
});

polygonSeries.mapPolygons.template.states.create("hover", {
  fill: am5.color(0x297373)
});

let zoomOut:any = root.tooltipContainer.children.push(am5.Button.new(root, {
  x: am5.p100,
  y: 0,
  centerX: am5.p100,
  centerY: 0,
  paddingTop: 18,
  paddingBottom: 18,
  paddingLeft: 12,
  paddingRight: 12,
  dx: -20,
  dy: 20,
  themeTags: ["zoom"],
  icon: am5.Graphics.new(root, {
    themeTags: ["button", "icon"],
    strokeOpacity: 0.7,
    draw: function(display) {
      display.moveTo(0, 0);
      display.lineTo(12, 0);
    }
  })
}));

zoomOut.get("background").setAll({
  cornerRadiusBL: 40,
  cornerRadiusBR: 40,
  cornerRadiusTL: 40,
  cornerRadiusTR: 40
});
zoomOut.events.on("click", function() {
  if (currentSeries) {
    currentSeries.hide();
  }
  chart.goHome();
  zoomOut.hide();
  currentSeries = regionalSeries.US.series;
  currentSeries.show();
});
zoomOut.hide();


// =================================
// Set up point series
// =================================

// Load store data
am5.net.load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json").then(function(result) {
  let stores = am5.JSONParser.parse(result.response);
  setupStores(stores);
});

let regionalSeries:any = {};
let currentSeries;

// Parses data and creats map point series for domestic and state-level
function setupStores(data) {
  console.log(data);
  
  // Init country-level series
  regionalSeries.US = {
    markerData: [],
    series: createSeries("stores")
  };
  
  // Set current series
  currentSeries = regionalSeries.US.series;
  
  // Process data
  am5.array.each(data.query_results, function(stores:any) {

    // Get store data
    let store = {
      state: stores.MAIL_ST_PROV_C,
      long: am5.type.toNumber(stores.LNGTD_I),
      lat: am5.type.toNumber(stores.LATTD_I),
      location: stores.co_loc_n,
      city: stores.mail_city_n,
      count: am5.type.toNumber(stores.count)
    };
    
    // Process state-level data
    if (regionalSeries[store.state] == undefined) {
      let statePolygon = getPolygon("US-" + store.state);
      if (statePolygon) {
        
        let centroid = statePolygon.visualCentroid();

        // Add state data
        regionalSeries[store.state] = {
          target: store.state,
          type: "state",
          name: statePolygon.dataItem.dataContext.name,
          count: store.count,
          stores: 1,
          state: store.state,
          markerData: [],
          geometry: {
            type: "Point",
            coordinates: [centroid.longitude, centroid.latitude]
          }
        };
        regionalSeries.US.markerData.push(regionalSeries[store.state]);

      }
      else {
        // State not found
        return;
      }
    }
    else {
      regionalSeries[store.state].stores++;
      regionalSeries[store.state].count += store.count;
    }
    
    // Process city-level data
    if (regionalSeries[store.city] == undefined) {
      regionalSeries[store.city] = {
        target: store.city,
        type: "city",
        name: store.city,
        count: store.count,
        stores: 1,
        state: store.state,
        markerData: [],
        geometry: {
          type: "Point",
          coordinates: [store.long, store.lat]
        }
      };
      regionalSeries[store.state].markerData.push(regionalSeries[store.city]);
    }
    else {
      regionalSeries[store.city].stores++;
      regionalSeries[store.city].count += store.count;
    }

    // Process individual store
    regionalSeries[store.city].markerData.push({
      name: store.location,
      count: store.count,
      stores: 1,
      state: store.state,
      geometry: {
        type: "Point",
        coordinates: [store.long, store.lat]
      }
    });
    
  });
  console.log(regionalSeries.US.markerData)
  regionalSeries.US.series.data.setAll(regionalSeries.US.markerData);
}

// Finds polygon in series by its id
function getPolygon(id) {
  let found;
  polygonSeries.mapPolygons.each(function(polygon:any) {
    if (polygon.dataItem.get("id") == id) {
      found = polygon;
    }
  })
  return found;
}

// Creates series with heat rules
function createSeries(heatfield) {
  
  // Create point series
  let pointSeries = chart.series.push(
    am5map.MapPointSeries.new(root, {
      valueField: heatfield,
      calculateAggregates: true
    })
  );
  
  // Add store bullet
  let circleTemplate:any = am5.Template.new(root);
  pointSeries.bullets.push(function() {
    let container = am5.Container.new(root, {});
    
    let circle = container.children.push(am5.Circle.new(root, {
      radius: 10,
      fill: am5.color(0x000000),
      fillOpacity: 0.7,
      cursorOverStyle: "pointer",
      tooltipText: "{name}:\n[bold]{stores} stores[/]"
    }, circleTemplate));
    
    let label = container.children.push(am5.Label.new(root, {
      text: "{stores}",
      fill: am5.color(0xffffff),
      populateText: true,
      centerX: am5.p50,
      centerY: am5.p50,
      textAlign: "center"
    }));
    
    // Set up drill-down
    circle.events.on("click", function(ev) {
      
      // Determine what we've clicked on
      let data:any = ev.target.dataItem.dataContext;

      // No id? Individual store - nothing to drill down to further
      if (!data.target) {
        return;
      }
      
      // Create actual series if it hasn't been yet created
      if (!regionalSeries[data.target].series) {
        regionalSeries[data.target].series = createSeries("count");
        regionalSeries[data.target].series.data.setAll(data.markerData);
      }

      // Hide current series
      if (currentSeries) {
        currentSeries.hide();
      }
      
      // Control zoom
      if (data.type == "state") {
        let statePolygon = getPolygon("US-" + data.state);
        polygonSeries.zoomToDataItem(statePolygon.dataItem);
      }
      else if (data.type == "city") {
        chart.zoomToGeoPoint({
          latitude: data.geometry.coordinates[1],
          longitude: data.geometry.coordinates[0]
        }, 64, true);
      }
      zoomOut.show();

      // Show new targert series
      currentSeries = regionalSeries[data.target].series;
      currentSeries.show();
    });
    
    return am5.Bullet.new(root, {
      sprite: container
    });
  });
  
  // Add heat rule for circles
  pointSeries.set("heatRules", [{
    target: circleTemplate,
    dataField: "value",
    min: 10,
    max: 30,
    key: "radius"
  }])
  
  // Set up drill-down
  // TODO
  
  return pointSeries;
}
  }
}
