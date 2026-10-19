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
  selector: 'app-drill-down-sunburst-chart',
  templateUrl: './drill-down-sunburst-chart.component.html',
  styleUrls: ['./drill-down-sunburst-chart.component.scss'],
})
export class DrillDownSunburstChartComponent implements OnInit {

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
let container = root.container.children.push(am5.Container.new(root, {
  width: am5.percent(100),
  height: am5.percent(100),
  layout: root.verticalLayout
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
let series = container.children.push(am5hierarchy.Sunburst.new(root, {
  singleBranchOnly: true,
  downDepth: 10,
  initialDepth: 10,
  topDepth: 1,
  innerRadius:am5.percent(30),
  valueField: "value",
  categoryField: "name",
  childDataField: "children"
}));

series.data.setAll([{
  name: "root",
  children: [{
    name: "First",
    children: [
      { name: "A1", value: 100 },
      { name: "A2", value: 60 }
    ]
  },
  {
    name: "Second",
    children: [
      { name: "B1", value: 135 },
      { name: "B2", value: 98 }
    ]
  },
  {
    name: "Third",
    children: [
      {
        name: "C1",
        children: [
          { name: "EE1", value: 130 },
          { name: "EE2", value: 87 },
          { name: "EE3", value: 55 }
        ]
      },
      { name: "C2", value: 148 },
      {
        name: "C3", children: [
          { name: "CC1", value: 53 },
          { name: "CC2", value: 30 }
        ]
      },
      { name: "C4", value: 26 }
    ]
  },
  {
    name: "Fourth",
    children: [
      { name: "D1", value: 415 },
      { name: "D2", value: 148 },
      { name: "D3", value: 89 }
    ]
  },
  {
    name: "Fifth",
    children: [
      {
        name: "E1",
        children: [
          { name: "EE1", value: 33 },
          { name: "EE2", value: 40 },
          { name: "EE3", value: 89 }
        ]
      },
      {
        name: "E2",
        value: 148
      }
    ]
  }]
}]);

series.selectDataItem(series.dataItems[0]);

// Make stuff animate on load
series.appear(1000, 100);
  }

}
