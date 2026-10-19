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
  selector: 'app-dynamic-data-updates-tree-map',
  templateUrl: './dynamic-data-updates-tree-map.component.html',
  styleUrls: ['./dynamic-data-updates-tree-map.component.scss'],
})
export class DynamicDataUpdatesTreeMapComponent implements OnInit {

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

const myTheme = am5.Theme.new(root);

myTheme.rule("HierarchyNode", ["depth0"]).setAll({
  forceHidden: true
});

myTheme.rule("HierarchyNode", ["depth1"]).setAll({
  forceHidden: true
});

root.setThemes([
  myTheme, am5themes_Animated.new(root)
])


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
    sort: "descending",
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
  strokeWidth: 3,
  cornerRadiusTL: 7,
  cornerRadiusTR: 7,
  cornerRadiusBL: 7,
  cornerRadiusBR: 7
});

// set data
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

setInterval(function() {
  let dataItems = series.dataItems[0].get("children");

  for (var i = 0; i < dataItems.length; i++) {
    let dataItem = dataItems[i];
    let children = dataItem.get("children");
    for (var c = 0; c < children.length; c++) {
      let child = children[c];
      let value = child.get("valueWorking");
      let newValue = value + Math.round(value * Math.random() * 0.4 - 0.2);
      child.set("value", newValue);
      child.set("valueWorking", newValue);
    }
  }
}, 2000);

// Make stuff animate on load
series.appear(1000, 100);
  }

}
