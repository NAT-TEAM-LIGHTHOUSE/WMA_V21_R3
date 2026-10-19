import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import { AnyAaaaRecord } from 'dns';
@Component({
standalone : true,
imports : [],
  selector: 'app-force-dir-adding-link',
  templateUrl: './force-dir-adding-link.component.html',
  styleUrls: ['./force-dir-adding-link.component.scss'],
})
export class ForceDirAddingLinkComponent implements OnInit {

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
  value: 0,
  children: []
}

for (var i = 0; i < 15; i++) {
  data.children.push({ name: "node " + i, value: Math.random() * 20 + 1 })
}

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
    downDepth: 2,
    topDepth: 1,
    initialDepth: 1,
    maxRadius: 60,
    minRadius: 20,
    valueField: "value",
    categoryField: "name",
    childDataField: "children",
    manyBodyStrength: -13,
    centerStrength: 0.8
  })
);

series.get("colors").setAll({
  step: 1
});

series.links.template.setAll({
  strokeWidth: 2
});

series.nodes.template.setAll({
  tooltipText: null,
  cursorOverStyle: "pointer"
});

let selectedDataItem;

// handle clicking on nodes and link/unlink them
series.nodes.template.events.on("click", function(e) {
  // check if we have a selected data item
  if (selectedDataItem) {
    let targetDataItem:any = e.target.dataItem;
    // if yes, and it's the same, unselect
    if (e.target.dataItem == selectedDataItem) {
      selectedDataItem.get("outerCircle").setPrivate("visible", false);
      selectedDataItem = undefined;
    }
    // otherwise connect selected with a clicked point
    else {
      if (series.areLinked(selectedDataItem, targetDataItem)) {
        series.unlinkDataItems(selectedDataItem, targetDataItem);
      }
      else {
        series.linkDataItems(selectedDataItem, targetDataItem, 0.2);
      }
    }
  }
  // if no selected data item, select
  else {
    selectedDataItem = e.target.dataItem;
    selectedDataItem.get("outerCircle").setPrivate("visible", true)
  }
})

series.data.setAll([data]);
series.set("selectedDataItem", series.dataItems[0]);

// Make stuff animate on load
series.appear(1000, 100);
  }

}
