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
  selector: 'app-map-with-patterns',
  templateUrl: './map-with-patterns.component.html',
  styleUrls: ['./map-with-patterns.component.scss'],
})
export class MapWithPatternsComponent implements OnInit {

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

let chart = root.container.children.push(
  am5map.MapChart.new(root, {
    panX: "rotateX",
    projection: am5map.geoNaturalEarth1()
  })
);

// Create polygon series
let polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am4geodata_continentsLow,
    exclude: ["antarctica"]
  })
);

polygonSeries.mapPolygons.template.setAll({
  tooltipText: "{name}",
  interactive: true,
  templateField: "settings"
});

polygonSeries.mapPolygons.template.states.create("hover", {
  fill: am5.color(0x677935)
});

let colors = am5.ColorSet.new(root, {});

polygonSeries.data.setAll([{
  id: "europe",
  settings: {
    fill: colors.next(),
    fillPattern: am5.LinePattern.new(root, {
      color: am5.color(0xffffff),
      rotation: 45,
      strokeWidth: 1
    })
  }
}, {
  id: "asia",
  settings: {
    fill: colors.next(),
    fillPattern: am5.RectanglePattern.new(root, {
      color: am5.color(0xffffff),
      checkered: true
    })
  }
}, {
  id: "africa",
  settings: {
    fill: colors.next(),
    fillPattern: am5.CirclePattern.new(root, {
      color: am5.color(0xffffff),
      checkered: true
    })
  }
}, {
  id: "northAmerica",
  settings: {
    fill: colors.next(),
    fillPattern: am5.CirclePattern.new(root, {
      color: am5.color(0xffffff)
    })
  }
}, {
  id: "southAmerica",
  settings: {
    fill: colors.next(),
    fillPattern: am5.LinePattern.new(root, {
      color: am5.color(0xffffff),
      rotation: 90,
      strokeWidth: 2
    })
  }
}, {
  id: "oceania",
  settings: {
    fill: colors.next(),
    fillPattern: am5.LinePattern.new(root, {
      color: am5.color(0xffffff),
    })
  }
}])
  }
}
