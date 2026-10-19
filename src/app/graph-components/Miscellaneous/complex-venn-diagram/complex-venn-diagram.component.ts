import { Component, OnInit } from '@angular/core';
import * as  am5 from "@amcharts/amcharts5";
import * as  am5venn from "@amcharts/amcharts5/venn";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-complex-venn-diagram',
  templateUrl: './complex-venn-diagram.component.html',
  styleUrls: ['./complex-venn-diagram.component.scss'],
})
export class ComplexVennDiagramComponent  implements OnInit {

  constructor() { }

  ngOnInit() {

    this.displayChart()
  }

  displayChart(){
    let root = am5.Root.new("chartdiv14");

root.setThemes([
  am5themes_Animated.new(root)
]);

// Create wrapper container
let container = root.container.children.push(
  am5.Container.new(root, {
    width: am5.p100,
    height: am5.p100,
    layout: root.verticalLayout
  })
);

// Create venn series
let chart = container.children.push(
  am5venn.Venn.new(root, {
    categoryField: "name",
    valueField: "value",
    intersectionsField: "sets",
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40
  })
);


// Set tooltip content
chart.slices.template.setAll({
  tooltipText: "{category}",
  strokeOpacity: 0,
  templateField: "sliceSettings"
});

chart.labels.template.setAll({
  textAlign: "center",
  templateField: "labelSettings"
});

// Set up hover appearance
chart.hoverGraphics.setAll({
  strokeDasharray: [3, 3],
  stroke: am5.color(0xffffff),
  strokeWidth: 2
});

// Set data
chart.data.setAll([
  { name: "Milk", value: 10, sliceSettings: { fill: am5.color(0xcecbc6) }  },
  { name: "Milk foam", value: 10, sliceSettings: { fill: am5.color(0xd1d0ce) }  },
  { name: "Espresso", value: 20, sliceSettings: { fill: am5.color(0x441702) }, labelSettings: { fill: am5.color(0xffffff) } },
  { name: "Water", value: 8, sliceSettings: { fill: am5.color(0xbbcdd7) }  },
  { name: "", value: 2, sets: ["Milk", "Milk foam"], sliceSettings: { fill: am5.color(0xd2d2d2), tooltipText: "" }  },
  { name: "Flat white", value: 4, sets: ["Milk", "Espresso"], sliceSettings: { fill: am5.color(0xa18b80) }  },
  { name: "Macchiato", value: 4, sets: ["Milk foam", "Espresso"], sliceSettings: { fill: am5.color(0xaba09c) }  },
  { name: "Cappucino\nLatte", value: 2, sets: ["Milk", "Milk foam", "Espresso"], sliceSettings: { fill: am5.color(0xd1d0ce) }  },
  { name: "Americano", value: 4, sets: ["Water", "Espresso"], sliceSettings: { fill: am5.color(0xa2a19f) }  }
]);

  }

}
