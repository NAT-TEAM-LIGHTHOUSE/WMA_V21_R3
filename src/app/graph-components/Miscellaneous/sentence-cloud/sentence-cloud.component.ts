import { Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as  am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import * as am5wc from "@amcharts/amcharts5/wc";

@Component({
standalone : true,
imports : [],
  selector: 'app-sentence-cloud',
  templateUrl: './sentence-cloud.component.html',
  styleUrls: ['./sentence-cloud.component.scss'],
})
export class SentenceCloudComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    this.displayChart()
  }
  displayChart(){
    let root = am5.Root.new("chartdiv29");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Add series
// https://www.amcharts.com/docs/v5/charts/word-cloud/
let series = root.container.children.push(am5wc.WordCloud.new(root, {
  maxCount: 100,
  minWordLength: 2,
  minFontSize: am5.percent(6),
  maxFontSize: am5.percent(8),
  angles: [0]
}));

let colorSet = am5.ColorSet.new(root, { step: 1 });

// Configure labels
series.labels.template.setAll({
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 5,
  paddingRight: 5,
  fontFamily: "Courier New"
});

series.labels.template.setup = function(label) {
  label.set("background", am5.RoundedRectangle.new(root, { fillOpacity: 1, fill: colorSet.next() }))
}



series.data.setAll([
  { category: "Lorem ipsum\ndolorsit amet,\nconsectetur", value: 2.1 },
  { category: "Sed do eiusmod\ntempor incididunt\nut labore et", value: 2.2 },
  { category: "Duis aute irure\ndolor in\nreprehenderit", value: 2.3 },
  { category: "Voluptate velit\nesse cillum dolore\neu fugiat nulla", value: 2.1 },
  { category: "Excepteur sint\noccaecat cupidatat\nnon proident", value: 2.2 },
  { category: "Nupidatat non proident", value: 2 },
  { category: "Incididunt ut labore et", value: 2.5 },
  { category: "Voluptate velit\ncillum dolore eu nulla", value: 2.1 }])
  }

}
