import { Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as  am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-chord-diagram-animated-bullets',
  templateUrl: './chord-diagram-animated-bullets.component.html',
  styleUrls: ['./chord-diagram-animated-bullets.component.scss'],
})
export class ChordDiagramAnimatedBulletsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    this.displayChart()
  }

  displayChart(){
    let root = am5.Root.new("chartdiv3");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([am5themes_Animated.new(root)]);

// Create series
// https://www.amcharts.com/docs/v5/charts/flow-charts/
let series = root.container.children.push(
  am5flow.ChordDirected.new(root, {
    sourceIdField: "from",
    targetIdField: "to",
    valueField: "value",
    sort: "ascending"
  })
);

series.links.template.set("fillStyle", "source");

// series.nodes.get("colors").set("step", 2);
series.nodes.data.setAll([
  { id: "A" },
  { id: "B" },
  { id: "C" },
  { id: "D" },
  { id: "E" },
  { id: "F" }
]);

// series.nodes.get("colors").set("step", 2);

series.bullets.push(function (_root, _series, dataItem) {
  let bullet = am5.Bullet.new(root, {
    locationY: Math.random(),
    sprite: am5.Circle.new(root, {
      radius: 5,
      fill: dataItem.get("source").get("fill")
    })
  });

  bullet.animate({
    key: "locationY",
    to: 1,
    from: 0,
    duration: Math.random() * 1000 + 2000,
    loops: Infinity
  });

  return bullet;
});

series.nodes.labels.template.setAll({
  textType: "regular",
  fill: root.interfaceColors.get("background"),
  fontSize: "1.1em",
  radius: -5
});

series.nodes.bullets.push(function (_root, _series, dataItem) {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(root, {
      radius: 20,
      fill: dataItem.get("fill")
    })
  });
});

series.children.moveValue(series.bulletsContainer, 0);

// Set data
// https://www.amcharts.com/docs/v5/charts/flow-charts/#Setting_data
series.data.setAll([
  { from: "A", to: "D", value: 10 },
  { from: "B", to: "C", value: 8 },
  { from: "B", to: "D", value: 4 },
  { from: "B", to: "E", value: 2 },
  { from: "C", to: "A", value: 14 },
  { from: "C", to: "E", value: 4 },
  { from: "E", to: "D", value: 8 },
  { from: "F", to: "A", value: 7 },
  { from: "D", to: "B", value: 2 }
]);

// Make stuff animate on load
series.appear(1000, 100);
  }

}
