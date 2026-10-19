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
  selector: 'app-grouped-countries-map',
  templateUrl: './grouped-countries-map.component.html',
  styleUrls: ['./grouped-countries-map.component.scss'],
})
export class GroupedCountriesMapComponent implements OnInit {

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
    let groupData = [
      {
        "name": "EU member before 2004",
        "data": [
          { "id": "AT", "joined": "1995"},
          { "id": "IE", "joined": "1973"},
          { "id": "DK", "joined": "1973"},
          { "id": "FI", "joined": "1995"},
          { "id": "SE", "joined": "1995"},
          { "id": "GB", "joined": "1973"},
          { "id": "IT", "joined": "1957"},
          { "id": "FR", "joined": "1957"},
          { "id": "ES", "joined": "1986"},
          { "id": "GR", "joined": "1981"},
          { "id": "DE", "joined": "1957"},
          { "id": "BE", "joined": "1957"},
          { "id": "LU", "joined": "1957"},
          { "id": "NL", "joined": "1957"},
          { "id": "PT", "joined": "1986"}
       ]
      }, {
        "name": "Joined at 2004",
        "data": [
          { "id": "LT", "joined": "2004" },
          { "id": "LV", "joined": "2004" },
          { "id": "CZ", "joined": "2004" },
          { "id": "SK", "joined": "2004" },
          { "id": "SI", "joined": "2004" },
          { "id": "EE", "joined": "2004" },
          { "id": "HU", "joined": "2004" },
          { "id": "CY", "joined": "2004" },
          { "id": "MT", "joined": "2004" },
          { "id": "PL", "joined": "2004" }
        ]
      }, {
        "name": "Joined at 2007",
        "data": [
          { "id": "RO", "joined": "2007" },
          { "id": "BG", "joined": "2007" }
        ]
      }, {
        "name": "Joined at 2013",
        "data": [
          { "id": "HR", "joined": "2013" }
        ]
      }
    ];
    
    
    // Create root and chart
    let root = am5.Root.new("chartdiv");
    
    
    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    
    // Create chart
    let chart = root.container.children.push(am5map.MapChart.new(root, {
      homeZoomLevel: 3.5,
      homeGeoPoint: { longitude: 10, latitude: 52 }
    }));
    
    
    // Create world polygon series
    let worldSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am4geodata_worldLow,
      exclude: ["AQ"]
    }));
    
    worldSeries.mapPolygons.template.setAll({
      fill: am5.color(0xaaaaaa)
    });
    
    worldSeries.events.on("datavalidated", () => {
      chart.goHome();
    });
    
    
    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {
      useDefaultMarker: true,
      centerX: am5.p50,
      x: am5.p50,
      centerY: am5.p100,
      y: am5.p100,
      dy: -20,
      background: am5.RoundedRectangle.new(root, {
        fill: am5.color(0xffffff),
        fillOpacity: 0.2
      })
    }));
    
    legend.valueLabels.template.set("forceHidden", true)
    
    
    // Create series for each group
    let colors = am5.ColorSet.new(root, {
      step: 2
    });
    colors.next();
    
    am5.array.each(groupData, function(group) {
      let countries = [];
      let color = colors.next();
    
      am5.array.each(group.data, function(country) {
        countries.push(country.id)
      });
    
      let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am4geodata_worldLow,
        include: countries,
        name: group.name,
        fill: color
      }));
    
    
      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "[bold]{name}[/]\nMember since {joined}",
        interactive: true,
        fill: color,
        strokeWidth: 2
      });
    
      polygonSeries.mapPolygons.template.states.create("hover", {
        fill: am5.Color.brighten(color, -0.3)
      });
    
      polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
        ev.target.series.mapPolygons.each(function(polygon) {
          polygon.states.applyAnimate("hover");
        });
      });
    
      polygonSeries.mapPolygons.template.events.on("pointerout", function(ev) {
        ev.target.series.mapPolygons.each(function(polygon) {
          polygon.states.applyAnimate("default");
        });
      });
      polygonSeries.data.setAll(group.data);
    
      legend.data.push(polygonSeries);
    });
  }
}
