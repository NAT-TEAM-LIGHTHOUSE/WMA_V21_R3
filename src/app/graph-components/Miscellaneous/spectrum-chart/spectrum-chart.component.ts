import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as  am5xy from "@amcharts/amcharts5/xy";
import * as  am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
standalone : true,
imports : [],
  selector: 'app-spectrum-chart',
  templateUrl: './spectrum-chart.component.html',
  styleUrls: ['./spectrum-chart.component.scss'],
})
export class SpectrumChartComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id='';
  @Input() subData: Subject<any>;
 emitPass: any;
  
 constructor(private gloabalObject : GlobalObjectsService,  private ngZone:NgZone) { }



 ngOnInit() {
   this.id = "spectrumChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
    let root = am5.Root.new(this.id);


root.setThemes([
  am5themes_Animated.new(root)
]);


let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  layout: root.verticalLayout
}));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let legend = chart.children.push(
  am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  })
);

// let datedata=(new Date("17-jun-2024 12:55:09")).getTime();
// alert(datedata);
   
let data:any=[];
for(let d of this.data){
  let specData={
    category: "",
    from: new Date(d.D1).getTime(),
    to: new Date(d.D2).getTime(),
    columnSettings: {
      fill: am5.color("#"+d.X2)
  }
}
data.push(specData);
}
console.log(data);
// let data = this.data;
// let data = [{
//   category: "",
//   from: new Date(2019, 0, 1, 11, 0).getTime(),
//   to: new Date(2019, 0, 1, 12, 30).getTime(),
//   columnSettings: {
//     fill: am5.color(0x69a74f)
//   }
// }, {
//   category: "",
//   from: new Date(2019, 0, 1, 12, 30).getTime(),
//   to: new Date(2019, 0, 1, 12, 45).getTime(),
//   columnSettings: {
//     fill: am5.color(0xfb9900)
//   }
// }, {
//   category: "",
//   from: new Date(2019, 0, 1, 12, 45).getTime(),
//   to: new Date(2019, 0, 1, 14, 3).getTime(),
//   columnSettings: {
//     fill: am5.color(0x69a74f)
//   }
// }, {
//   category: "",
//   from: new Date(2019, 0, 1, 14, 3).getTime(),
//   to: new Date(2019, 0, 1, 14, 14).getTime(),
//   columnSettings: {
//     fill: am5.color(0x664ea6)
//   }
// }, {
//   category: "",
//   from: new Date(2019, 0, 1, 14, 14).getTime(),
//   to: new Date(2019, 0, 1, 14, 38).getTime(),
//   columnSettings: {
//     fill: am5.color(0xcc0c00)
//   }
// }, {
//   category: "",
//   from: new Date(2019, 0, 1, 14, 38).getTime(),
//   to: new Date(2019, 0, 1, 15, 1).getTime(),
//   columnSettings: {
//     fill: am5.color(0xfb9900)
//   }
// }, {
//   category: "",
//   from: new Date(2019, 0, 1, 15, 1).getTime(),
//   to: new Date(2019, 0, 1, 16, 37).getTime(),
//   columnSettings: {
//     fill: am5.color(0x69a74f)
//   }
// }, {
//   category: "",
//   from: new Date(2019, 0, 1, 16, 37).getTime(),
//   to: new Date(2019, 0, 1, 16, 55).getTime(),
//   columnSettings: {
//     fill: am5.color(0x9900ff)
//   }
// }, {
//   category: "",
//   from: new Date(2019, 0, 1, 16, 55).getTime(),
//   to: new Date(2019, 0, 1, 17, 7).getTime(),
//   columnSettings: {
//     fill: am5.color(0x69a74f)
//   }
// }, {
//   category: "",
//   from: new Date(2019, 0, 1, 17, 7).getTime(),
//   to: new Date(2019, 0, 1, 17, 30).getTime(),
//   columnSettings: {
//     fill: am5.color(0xfb9900)
//   }
// }];


let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "category",
  renderer: am5xy.AxisRendererY.new(root, {})
}));
yAxis.data.setAll([{ category: "" }]);


let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  baseInterval: { timeUnit: "minute", count: 1 },
  renderer: am5xy.AxisRendererX.new(root, {})
}));

xAxis.get("renderer").labels.template.set("forceHidden", true);


let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueXField: "to",
  openValueXField: "from",
  categoryYField: "category"
}));

series.columns.template.setAll({
  strokeWidth: 0,
  strokeOpacity: 0,
  height: am5.percent(100),
  templateField: "columnSettings"
});

series.data.setAll(data);

for(var i = 0; i < data.length; i++) {
  let rangeDataItem = xAxis.makeDataItem({
    value: data[i].from
  });
  
  let range = xAxis.createAxisRange(rangeDataItem);
  
  rangeDataItem.get("grid").set("forceHidden", true);
  
  rangeDataItem.get("tick").setAll({
    visible: true,
    length: 18,
    strokeOpacity: 0.2
  });
  
  rangeDataItem.get("label").setAll({
    //fill: am5.color(0xffffff),
    centerX: am5.p0,
    forceHidden: false,
    fontSize: 10,
    text: root.dateFormatter.format(new Date(data[i].from), "HH:mm")
  });
}

let datalegend:any=[];
for(let d of this.data){
  let specData={
    name: d.X1,
  color: am5.color("#"+d.X2)
  }

datalegend.push(specData);
}


 legend = chart.children.push(am5.Legend.new(root, {
  nameField: "name",
  fillField: "color",
  strokeField: "color",
  centerX: am5.percent(50),
  x: am5.percent(50),
  clickTarget: "none"
}));


legend.data.setAll(datalegend);
// legend.data.setAll([{
//   name: "Normal operation",
//   color: am5.color("#69a74f")
// }, {
//   name: "Minor alarm",
//   color: am5.color("#fb9900")
// }, {
//   name: "Anomaly",
//   color: am5.color("#664ea6")
// }, {
//   name: "Critical error",
//   color: am5.color("#cc0c00")
// }]);


series.appear();
chart.appear(1000, 100);
  }


// displayChart() {
//   let root = am5.Root.new(this.id);

//   root.setThemes([am5themes_Animated.new(root)]);

//   let chart = root.container.children.push(
//     am5xy.XYChart.new(root, {
//       panX: false,
//       panY: false,
//       layout: root.verticalLayout,
//     })
//   );

//   let legend = chart.children.push(
//     am5.Legend.new(root, {
//       centerX: am5.percent(50),
//       x: am5.percent(50),
//     })
//   );

//   // Map input data (adjust field names as per your data structure)
//   console.log("spectrum chart"+this.data);
//   const data = this.data.map((item: any) => ({
//     category: item.X1 || '', // Map X1 to category
//     from: new Date(item.D1).getTime(), // Convert D1 to timestamp
//     to: new Date(item.D2).getTime(),  // Convert D2 to timestamp
//     columnSettings: {
//       fill: am5.color(item.color || 0x69a74f), // Default to green if no color provided
//     },
//   }));

//   let yAxis = chart.yAxes.push(
//     am5xy.CategoryAxis.new(root, {
//       categoryField: "category",
//       renderer: am5xy.AxisRendererY.new(root, {}),
//     })
//   );
//   yAxis.data.setAll(
//     data.map((item: any) => ({ category: item.category }))
//   );

//   let xAxis = chart.xAxes.push(
//     am5xy.DateAxis.new(root, {
//       baseInterval: { timeUnit: "day", count: 1 },
//       renderer: am5xy.AxisRendererX.new(root, {}),
//     })
//   );

//   xAxis.get("renderer").labels.template.set("forceHidden", true);

//   let series = chart.series.push(
//     am5xy.ColumnSeries.new(root, {
//       xAxis: xAxis,
//       yAxis: yAxis,
//       valueXField: "to",
//       openValueXField: "from",
//       categoryYField: "category",
//     })
//   );

//   series.columns.template.setAll({
//     strokeWidth: 0,
//     strokeOpacity: 0,
//     height: am5.percent(100),
//     templateField: "columnSettings",
//   });

//   series.data.setAll(data);

//   legend.data.setAll([
//     {
//       name: "Normal operation",
//       color: am5.color("#69a74f"),
//     },
//     {
//       name: "Minor alarm",
//       color: am5.color("#fb9900"),
//     },
//     {
//       name: "Anomaly",
//       color: am5.color("#664ea6"),
//     },
//     {
//       name: "Critical error",
//       color: am5.color("#cc0c00"),
//     },
//   ]);

//   series.appear();
//   chart.appear(1000, 100);
// }



}
