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
  selector: 'app-simple-tree-map-chart',
  templateUrl: './simple-tree-map-chart.component.html',
  styleUrls: ['./simple-tree-map-chart.component.scss'],
})
export class SimpleTreeMapChartComponent implements OnInit {

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
  am5hierarchy.Treemap.new(root, {
    singleBranchOnly: false,
    downDepth: 1,
    upDepth: -1,
    initialDepth: 2,
    valueField: "value",
    categoryField: "name",
    childDataField: "children",
    nodePaddingOuter: 0,
    nodePaddingInner: 0
  })
);

series.rectangles.template.setAll({
  strokeWidth: 2
});

// Generate and set data
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Setting_data
let data = {
  name: "Root",
  children: [
    {
      name: "First",
      children: [
        {
          name: "A1",
          value: 100
        },
        {
          name: "A2",
          value: 60
        },
        {
          name: "A3",
          value: 30
        }
      ]
    },
    {
      name: "Second",
      children: [
        {
          name: "B1",
          value: 135
        },
        {
          name: "B2",
          value: 98
        },
        {
          name: "B3",
          value: 56
        }
      ]
    },
    {
      name: "Third",
      children: [
        {
          name: "C1",
          value: 335
        },
        {
          name: "C2",
          value: 148
        },
        {
          name: "C3",
          value: 126
        },
        {
          name: "C4",
          value: 26
        }
      ]
    },
    {
      name: "Fourth",
      children: [
        {
          name: "D1",
          value: 415
        },
        {
          name: "D2",
          value: 148
        },
        {
          name: "D3",
          value: 89
        },
        {
          name: "D4",
          value: 64
        },
        {
          name: "D5",
          value: 16
        }
      ]
    },
    {
      name: "Fifth",
      children: [
        {
          name: "E1",
          value: 687
        },
        {
          name: "E2",
          value: 148
        }
      ]
    }
  ]
};

series.data.setAll([data]);
series.set("selectedDataItem", series.dataItems[0]);

// Make stuff animate on load
series.appear(1000, 100);
  }

}
