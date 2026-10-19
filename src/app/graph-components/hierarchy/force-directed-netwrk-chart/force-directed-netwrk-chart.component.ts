import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
@Component({
standalone : true,
imports : [],
  selector: 'app-force-directed-netwrk-chart',
  templateUrl: './force-directed-netwrk-chart.component.html',
  styleUrls: ['./force-directed-netwrk-chart.component.scss'],
})
export class ForceDirectedNetwrkChartComponent implements OnInit {

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

let data = {
  name: "Root",
  value: 0,
  children: [
    {
      name: "1",
      linkWith: ["2"],
      children: [
        {
          name: "A",
          children: [
            { name: "A1", value: 1 },
            { name: "A2", value: 1 },
            { name: "A3", value: 1 },
            { name: "A4", value: 1 },
            { name: "A5", value: 1 }
          ]
        },
        {
          name: "B",
          children: [
            { name: "B1", value: 1 },
            { name: "B2", value: 1 },
            { name: "B3", value: 1 },
            { name: "B4", value: 1 },
            { name: "B5", value: 1 }
          ]
        },
        {
          name: "C",
          children: [
            { name: "C1", value: 1 },
            { name: "C2", value: 1 },
            { name: "C3", value: 1 },
            { name: "C4", value: 1 },
            { name: "C5", value: 1 }
          ]
        }
      ]
    },

    {
      name: "2",
      linkWith: ["3"],
      children: [
        {
          name: "D", value:1
        },
        {
          name: "E", value:1
        }
      ]
    },
    {
      name: "3",
      children: [
        {
          name: "F",
          children: [
            { name: "F1", value: 1 },
            { name: "F2", value: 1 },
            { name: "F3", value: 1 },
            { name: "F4", value: 1 },
            { name: "F5", value: 1 }
          ]
        },
        {
          name: "H",
          children: [
            { name: "H1", value: 1 },
            { name: "H2", value: 1 },
            { name: "H3", value: 1 },
            { name: "H4", value: 1 },
            { name: "H5", value: 1 }
          ]
        },
        {
          name: "G",
          children: [
            { name: "G1", value: 1 },
            { name: "G2", value: 1 },
            { name: "G3", value: 1 },
            { name: "G4", value: 1 },
            { name: "G5", value: 1 }
          ]
        }
      ]
    }
  ]
};

// Create wrapper container
let container = root.container.children.push(
  am5.Container.new(root, {
    width: am5.percent(100),
    height: am5.percent(100),
    layout: root.verticalLayout
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
let series = container.children.push(
  am5hierarchy.ForceDirected.new(root, {
    singleBranchOnly: false,
    downDepth: 1,
    topDepth: 1,
    maxRadius: 25,
    minRadius: 12,
    valueField: "value",
    categoryField: "name",
    childDataField: "children",
    idField: "name",
    linkWithStrength: 0.3,
    linkWithField: "linkWith",
    manyBodyStrength: -15,
    centerStrength: 0.5
  })
);

series.get("colors").set("step", 2);

series.data.setAll([data]);
series.set("selectedDataItem", series.dataItems[0]);

// Make stuff animate on load
series.appear(1000, 100);
  }

}
