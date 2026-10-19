import { Component, NgZone, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as  am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-sankey-diagram',
  templateUrl: './sankey-diagram.component.html',
  styleUrls: ['./sankey-diagram.component.scss'],
})
export class SankeyDiagramComponent  implements OnInit {

  constructor(private ngZone : NgZone) { }

  ngOnInit() {
    this.displayChart();
  }
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.displayChart();
      }, 0);
    });
  }



  displayChart(){
    let root = am5.Root.new("chartdiv7");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create series
// https://www.amcharts.com/docs/v5/charts/flow-charts/
let series = root.container.children.push(am5flow.Sankey.new(root, {
  sourceIdField: "from",
  targetIdField: "to",
  valueField: "value",
  paddingRight: 50
}));

// series.nodes.get("colors").set("step", 2);


// Set data
// https://www.amcharts.com/docs/v5/charts/flow-charts/#Setting_data
series.data.setAll([
  { from: "A", to: "D", value: 10 },
  { from: "B", to: "D", value: 8 },
  { from: "B", to: "E", value: 4 },
  { from: "C", to: "E", value: 3 },
  { from: "D", to: "G", value: 5 },
  { from: "D", to: "I", value: 2 },
  { from: "D", to: "H", value: 3 },
  { from: "E", to: "H", value: 6 },
  { from: "G", to: "J", value: 5 },
  { from: "I", to: "J", value: 1 },
  { from: "H", to: "J", value: 9 }
]);


// Make stuff animate on load
series.appear(1000, 100);
  }
}
