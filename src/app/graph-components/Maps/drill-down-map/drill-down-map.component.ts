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
  selector: 'app-drill-down-map',
  templateUrl: './drill-down-map.component.html',
  styleUrls: ['./drill-down-map.component.scss'],
})
export class DrillDownMapComponent implements OnInit {

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
  projection: am5map.geoNaturalEarth1()
}));


// Create polygon series for continents
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
let continentSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
  geoJSON: am4geodata_continentsLow,
  exclude: ["antarctica"]
}));

continentSeries.mapPolygons.template.setAll({
  tooltipText: "{name}",
  interactive: true
});

continentSeries.mapPolygons.template.states.create("hover", {
  fill: root.interfaceColors.get("primaryButtonActive")
});

// Set up zooming in on clicked continent
continentSeries.mapPolygons.template.events.on("click", function (ev:any) {
  continentSeries.zoomToDataItem(ev.target.dataItem);
  continentSeries.hide();
  countrySeries.show();
  homeButton.show();
});


// Create polygon series for countries
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
let countrySeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
  geoJSON: am4geodata_worldLow,
  exclude: ["AQ"],
  visible: false
}));

countrySeries.mapPolygons.template.setAll({
  tooltipText: "{name}",
  interactive: true
});

countrySeries.mapPolygons.template.states.create("hover", {
  fill: root.interfaceColors.get("primaryButtonActive")
});


// Add a button to go back to continents view
let homeButton = chart.children.push(am5.Button.new(root, {
  paddingTop: 10,
  paddingBottom: 10,
  x: am5.percent(100),
  centerX: am5.percent(100),
  opacity: 0,
  interactiveChildren: false,
  icon: am5.Graphics.new(root, {
    svgPath: "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
    fill: am5.color(0xffffff)
  })
}));

homeButton.events.on("click", function() {
  chart.goHome();
  continentSeries.show();
  countrySeries.hide();
  homeButton.hide();
});
  }
}
