import { Component, OnInit } from '@angular/core';
import * as  am5venn from "@amcharts/amcharts5/venn";
import * as  am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-venn-diagram-patterns',
  templateUrl: './venn-diagram-patterns.component.html',
  styleUrls: ['./venn-diagram-patterns.component.scss'],
})
export class VennDiagramPatternsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    this.displayChart()
  }

  displayChart(){
    let root = am5.Root.new("chartdiv35");

// Set themes
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create wrapper container
let container = root.container.children.push(am5.Container.new(root, {
  width: am5.p100,
  height: am5.p100,
  layout: root.verticalLayout
}));

// Create venn series
let chart = container.children.push(am5venn.Venn.new(root, {
  categoryField: "name",
  valueField: "value",
  intersectionsField: "sets",
  paddingTop: 40,
  paddingBottom: 40,
  paddingLeft: 40,
  paddingRight: 40
}));

let pattern = am5.CirclePattern.new(root, {
  fill: am5.color(0x000000),
  color: am5.color(0xffffff),
  radius: 10,
  gap: 10,
  checkered: true
})

chart.slices.template.setAll({ templateField: "sliceSettings" });
chart.labels.template.set("fill", am5.color(0xffffff));
chart.labels.template.setup = function(target) {
  target.set("background", am5.RoundedRectangle.new(root, {
    stroke: am5.color(0xffffff),
    fill: am5.color(0x000000),
    cornerRadiusTL: 5,
    cornerRadiusTR: 5,
    cornerRadiusBL: 5,
    cornerRadiusBR: 5,
    fillOpacity: 1
  }));
}

// Set data
chart.data.setAll([{
	name: "Polar bear",
	value: 100,
	sliceSettings: {
		fill: am5.color(0xFFFFFF),
		stroke: am5.color(0x000000)
	}
}, {
	name: "Black bear",
	value: 100,
	sliceSettings: {
		fill: am5.color(0x000000),
		stroke: am5.color(0x000000)
	}
}, {
	name: "Panda",
	value: 30,
	sets: ["Polar bear", "Black bear"],
	sliceSettings: {
		fillPattern: pattern,
		stroke: am5.color(0x000000)
	}
}]);


// Set up hover appearance
chart.hoverGraphics.setAll({
  strokeDasharray: [3, 3],
  stroke: am5.color(0xffffff),
  strokeWidth: 2
});

  }

}
