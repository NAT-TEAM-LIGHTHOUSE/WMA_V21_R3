import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
standalone : true,
imports : [],
  selector: 'app-images-as-categories',
  templateUrl: './images-as-categories.component.html',
  styleUrls: ['./images-as-categories.component.scss'],
})
export class ImagesAsCategoriesComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  icon :any;
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


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  paddingLeft: 0,
  layout: root.verticalLayout
}));


// Data
let colors = chart.get("colors");

let data = [{
  country: "US",
  visits: 725,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/united-states.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "UK",
  visits: 625,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/united-kingdom.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "China",
  visits: 602,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/china.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Japan",
  visits: 509,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/japan.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Germany",
  visits: 322,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/germany.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "France",
  visits: 214,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/france.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "India",
  visits: 204,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/india.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Spain",
  visits: 198,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/spain.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Netherlands",
  visits: 165,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/netherlands.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "South Korea",
  visits: 93,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/south-korea.svg",
  columnSettings: { fill: colors.next() }
}, {
  country: "Canada",
  visits: 41,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/canada.svg",
  columnSettings: { fill: colors.next() }
}];


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, {
  minGridDistance: 30,
  minorGridEnabled: true
})

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "country",
  renderer: xRenderer,
  bullet: function (root, axis, dataItem) {
    return am5xy.AxisBullet.new(root, {
      location: 0.5,
      sprite: am5.Picture.new(root, {
        width: 24,
        height: 24,
        centerY: am5.p50,
        centerX: am5.p50,
        // src: dataItem.dataContext.icon
            })
    });
  }
}));

xRenderer.grid.template.setAll({
  location: 1
})

xRenderer.labels.template.setAll({
  paddingTop: 20
});

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "visits",
  categoryXField: "country"
}));

series.columns.template.setAll({
  tooltipText: "{categoryX}: {valueY}",
  tooltipY: 0,
  strokeOpacity: 0,
  templateField: "columnSettings"
});

series.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear();
chart.appear(1000, 100);

// amCharts
}

}
