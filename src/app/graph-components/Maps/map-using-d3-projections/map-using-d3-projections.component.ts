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
import * as d3 from 'd3';
@Component({
standalone : true,
imports : [],
  selector: 'app-map-using-d3-projections',
  templateUrl: './map-using-d3-projections.component.html',
  styleUrls: ['./map-using-d3-projections.component.scss'],
})
export class MapUsingD3ProjectionsComponent implements OnInit {

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
let chart:any = root.container.children.push(
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

setProjection("geoAiry");

function setProjection(name) {
  chart.set("projection", d3[name].call(this));
  setButtonState();
}

function setIndex(offset) {
  let selector:any = document.getElementById("selector");
  let index = selector.selectedIndex + offset;
  if (index < 0) {
    index = 0;
  }
  if (index > (selector.options.length - 1)) {
    index = selector.options.length - 1;
  }
  selector.selectedIndex = index;
  setProjection(selector.options[index].value);
  setButtonState();
}

function setButtonState() {
  let selector:any = document.getElementById("selector");
  let index = selector.selectedIndex;
  if (index == 0) {
    // document.getElementById("selector-prev").disabled = "disabled";
    // document.getElementById("selector-next").disabled = "";

    const element1 = document.getElementById('selector-prev');
if (element1 instanceof HTMLButtonElement) {
  element1.disabled = true;
}


const element2 = document.getElementById('selector-next');
if (element2 instanceof HTMLButtonElement) {
  element2.disabled = false;
}
  }
  else if (index >= (selector.options.length - 1)) {
    // document.getElementById("selector-prev").disabled = "";
    // document.getElementById("selector-next").disabled = "disabled";

    const element1 = document.getElementById('selector-prev');
if (element1 instanceof HTMLButtonElement) {
  element1.disabled = false;
}


const element2 = document.getElementById('selector-next');
if (element2 instanceof HTMLButtonElement) {
  element2.disabled = true;
}
  }
  else {
    // document.getElementById("selector-prev").disabled = "";
    // document.getElementById("selector-next").disabled = "";
    const element1 = document.getElementById('selector-prev');
if (element1 instanceof HTMLButtonElement) {
  element1.disabled = false;
}


const element2 = document.getElementById('selector-next');
if (element2 instanceof HTMLButtonElement) {
  element2.disabled = false;
}
  }
}
  }
}
