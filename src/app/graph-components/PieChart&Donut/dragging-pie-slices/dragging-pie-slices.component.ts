import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
standalone : true,
imports : [],
  selector: 'app-dragging-pie-slices',
  templateUrl: './dragging-pie-slices.component.html',
  styleUrls: ['./dragging-pie-slices.component.scss'],
})
export class DraggingPieSlicesComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;


  constructor(private gloabalObject : GlobalObjectsService, private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "draggingPieSlice_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    this.gloabalObject.chartId++;
      setTimeout(() => {
        this.ngZone.runOutsideAngular(() => {
          this.data =  this.frame.chartData; 
        this.displayChart()   
        })
      }, 100);

      
    this.subData.subscribe(data => {
      this.data = data;
      this.displayChart();
    })

  }

setData(){
  let datashow=[];
  let j=0;
  for(let i=0;i<this.data.length+1;i++){
    let showDataObj={};
    if(i==0){
      // alert("i==0")
      showDataObj= {
        X1: "Dummy",
        Y1: 1000,
        settings: {
          fill: am5.color(0xdadada),
          stroke: am5.color(0xdadada),
          fillOpacity: 0.3,
          strokeDasharray: [4, 4],
          tooltipText: null,
          draggable: false
        },
        dummyLabelSettings: {
          forceHidden: true
        }
      }
    }
    else{
     showDataObj={
      Y1:this.data[j].Y1,
      X1:this.data[j].X1+j
    }
    j=j+1;
  }
    datashow.push(showDataObj);
  }
  this.data=datashow;
}
displayChart(){
  this.setData();
/* Chart code */
// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
let root = am5.Root.new(this.id);

// Create custom theme
// https://www.amcharts.com/docs/v5/concepts/themes/#Quick_custom_theme
let myTheme = am5.Theme.new(root);
myTheme.rule("Label").set("fontSize", "0.8em");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root),
  myTheme
]);

// Create wrapper container
let container = root.container.children.push(am5.Container.new(root, {
  width: am5.p100,
  height: am5.p100,
  layout: root.horizontalLayout
}));

// Create first chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
let chart0 = container.children.push(am5percent.PieChart.new(root, {
  innerRadius: am5.p50,
  tooltip: am5.Tooltip.new(root, {})
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
let series0 = chart0.series.push(am5percent.PieSeries.new(root, {
  valueField: "Y1",
  categoryField: "X1",
  alignLabels: false
}));

series0.labels.template.setAll({
  textType: "circular",
  templateField: "dummyLabelSettings"
});

series0.ticks.template.set("forceHidden", true);

let sliceTemplate0 = series0.slices.template;
sliceTemplate0.setAll({
  draggable: true,
  templateField: "settings",
  cornerRadius: 5
});

// Separator line
container.children.push(am5.Line.new(root, {
  layer: 1,
  height: am5.percent(60),
  y: am5.p50,
  centerY: am5.p50,
  strokeDasharray: [4, 4],
  stroke: root.interfaceColors.get("alternativeBackground"),
  strokeOpacity: 0.5
}));

// Label
container.children.push(am5.Label.new(root, {
  layer: 1,
  text: "Drag slices over the line",
  y: am5.p50,
  textAlign: "center",
  rotation: -90,
  isMeasured: false
}));

// Create second chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
let chart1 = container.children.push(am5percent.PieChart.new(root, {
  innerRadius: am5.p50,
  tooltip: am5.Tooltip.new(root, {})
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
let series1 = chart1.series.push(am5percent.PieSeries.new(root, {
  valueField: "Y1",
  categoryField: "X1",
  alignLabels: false
}));

series1.labels.template.setAll({
  textType: "circular",
  radius: 20,
  templateField: "dummyLabelSettings"
});

series1.ticks.template.set("forceHidden", true);

let sliceTemplate1 = series1.slices.template;
sliceTemplate1.setAll({
  draggable: true,
  templateField: "settings",
  cornerRadius: 5
});

let previousDownSlice;

// change layers when down
sliceTemplate0.events.on("pointerdown", function (e) {
  if (previousDownSlice) {
    //  previousDownSlice.set("layer", 0);
  }
  e.target.set("layer", 1);
  previousDownSlice = e.target;
});

sliceTemplate1.events.on("pointerdown", function (e) {
  if (previousDownSlice) {
    // previousDownSlice.set("layer", 0);
  }
  e.target.set("layer", 1);
  previousDownSlice = e.target;
});

// when released, do all the magic
sliceTemplate0.events.on("pointerup", function (e) {
  series0.hideTooltip();
  series1.hideTooltip();

  let slice = e.target;
  if (slice.x() > container.width() / 4) {
    let index = series0.slices.indexOf(slice);
    slice.dataItem.hide();

    let series1DataItem = series1.dataItems[index];
    series1DataItem.show();
    series1DataItem.get("slice").setAll({ x: 0, y: 0 });

    handleDummy(series0);
    handleDummy(series1);
  } else {
    slice.animate({
      key: "x",
      to: 0,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic)
    });
    slice.animate({
      key: "y",
      to: 0,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic)
    });
  }
});

sliceTemplate1.events.on("pointerup", function (e) {
  let slice = e.target;

  series0.hideTooltip();
  series1.hideTooltip();

  if (slice.x() < container.width() / 4) {
    let index = series1.slices.indexOf(slice);
    slice.dataItem.hide();

    let series0DataItem = series0.dataItems[index];
    series0DataItem.show();
    series0DataItem.get("slice").setAll({ x: 0, y: 0 });

    handleDummy(series0);
    handleDummy(series1);
  } else {
    slice.animate({
      key: "x",
      to: 0,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic)
    });
    slice.animate({
      key: "y",
      to: 0,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic)
    });
  }
});



let data=this.data;
// console.log("dragging slices : "+JSON.stringify(data));
// console.log("dragging slices : "+JSON.stringify(this.data));

// show/hide dummy slice depending if there are other visible slices
function handleDummy(series) {
  // count visible data items
  let visibleCount = 0;
  am5.array.each(series.dataItems, function (dataItem:any) {
    if (!dataItem.isHidden()) {
      visibleCount++;
    }
  });
  // if all hidden, show dummy
  if (visibleCount == 0) {
    series.dataItems[0].show();
  } else {
    series.dataItems[0].hide();
  }
}
// set data
series0.data.setAll(data);
series1.data.setAll(data);

// hide all except dummy
am5.array.each(series1.dataItems, function (dataItem:any) {
  if (dataItem.get("X1") != "Dummy") {
    dataItem.hide(0);
  }
});

// hide dummy
series0.dataItems[0].hide(0);

// reveal container
container.appear(1000, 100);
}

  }
