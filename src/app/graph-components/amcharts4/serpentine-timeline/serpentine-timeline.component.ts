import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_timeline from "@amcharts/amcharts4/plugins/timeline";
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Platform } from '@ionic/angular/standalone';
import * as am4plugins_bullets from "@amcharts/amcharts4/plugins/bullets";
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
@Component({
standalone : true,
imports : [CommonModule],
  selector: 'app-serpentine-timeline',
  templateUrl: './serpentine-timeline.component.html',
  styleUrls: ['./serpentine-timeline.component.scss'],
})
export class SerpentineTimelineComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  doubleLineFlag = false
  @Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService,public platform: Platform,  private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "serpentineTimeline_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    this.gloabalObject.chartId++;
       this.ngZone.runOutsideAngular(() => {
    setTimeout(() => {
      this.data =  this.frame.chartData; 
      this.displayChart();
    }, 100);
  })

  this.subData.subscribe(data => {
    this.data = data;
    this.displayChart();
  })
  }


  displayChart(){
    let chart = am4core.create(this.id, am4plugins_timeline.SerpentineChart);
chart.curveContainer.padding(20, 20, 20, 20);
chart.levelCount = 3;
chart.yAxisRadius = am4core.percent(25);
chart.yAxisInnerRadius = am4core.percent(-25);
chart.maskBullets = false;

let colorSet = new am4core.ColorSet();
colorSet.saturation = 1;

let i = 0
for(let d of this.data){
    d.color = colorSet.getIndex(i);
    i+= 5;
}

chart.data =  this.data ;
console.log(this.data);

// chart.data = [{
//     "category": "Module #1",
//     "start": "2019-01-10",
//     "end": "2019-01-13",
//     "color": colorSet.getIndex(0),
//     "task": "Gathering requirements"
// }, {
//     "category": "Module #1",
//     "start": "2019-02-05",
//     "end": "2019-04-18",
//     "color": colorSet.getIndex(0),
//     "task": "Development"
// }, {
//     "category": "Module #2",
//     "start": "2019-01-08",
//     "end": "2019-01-10",
//     "color": colorSet.getIndex(5),
//     "task": "Gathering requirements"
// }, {
//     "category": "Module #2",
//     "start": "2019-01-12",
//     "end": "2019-01-15",
//     "color": colorSet.getIndex(5),
//     "task": "Producing specifications"
// }, {
//     "category": "Module #2",
//     "start": "2019-01-16",
//     "end": "2019-02-05",
//     "color": colorSet.getIndex(5),
//     "task": "Development"
// }, {
//     "category": "Module #2",
//     "start": "2019-02-10",
//     "end": "2019-02-18",
//     "color": colorSet.getIndex(5),
//     "task": "Testing and QA"
// }, {
//     "category": ""
// }, {
//     "category": "Module #3",
//     "start": "2019-01-01",
//     "end": "2019-01-19",
//     "color": colorSet.getIndex(9),
//     "task": "Gathering requirements"    
// }, {
//     "category": "Module #3",
//     "start": "2019-02-01",
//     "end": "2019-02-10",
//     "color": colorSet.getIndex(9),
//     "task": "Producing specifications"
// }, {
//     "category": "Module #3",
//     "start": "2019-03-10",
//     "end": "2019-04-15",
//     "color": colorSet.getIndex(9),
//     "task": "Development"
// }, {
//     "category": "Module #3",
//     "start": "2019-04-20",
//     "end": "2019-04-30",
//     "color": colorSet.getIndex(9),
//     "task": "Testing and QA",
//     "disabled2":false,
//     "image2":"/wp-content/uploads/assets/timeline/rachel.jpg",
//     "location":0
// }, {
//     "category": "Module #4",
//     "start": "2019-01-15",
//     "end": "2019-02-12",
//     "color": colorSet.getIndex(15),
//     "task": "Gathering requirements",
//     "disabled1":false,
//     "image1":"/wp-content/uploads/assets/timeline/monica.jpg"
// }, {
//     "category": "Module #4",
//     "start": "2019-02-25",
//     "end": "2019-03-10",
//     "color": colorSet.getIndex(15),
//     "task": "Development"
// }, {
//     "category": "Module #4",
//     "start": "2019-03-23",
//     "end": "2019-04-29",
//     "color": colorSet.getIndex(15),
//     "task": "Testing and QA"
// }];

chart.dateFormatter.dateFormat = "yyyy-MM-dd";
chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
chart.fontSize = 11;

let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis() as any);
categoryAxis.dataFields.category = "X1";
categoryAxis.renderer.grid.template.disabled = true;
categoryAxis.renderer.labels.template.paddingRight = 1;
categoryAxis.renderer.minGridDistance = 70;
categoryAxis.renderer.innerRadius = -60;
categoryAxis.renderer.radius = 60;
categoryAxis.renderer.labels.template.wrap = true;

let dateAxis = chart.xAxes.push(new am4charts.DateAxis() as any);
dateAxis.renderer.minGridDistance = 200;
dateAxis.baseInterval = { count: 1, timeUnit: "day" };
dateAxis.renderer.tooltipLocation = 0;
dateAxis.startLocation = -0.5;
dateAxis.renderer.line.strokeDasharray = "1,4";
dateAxis.renderer.line.strokeOpacity = 0.6;
dateAxis.tooltip.background.fillOpacity = 0.2;
dateAxis.tooltip.background.cornerRadius = 5;
dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
dateAxis.tooltip.label.paddingTop = 1;

let labelTemplate = dateAxis.renderer.labels.template;
labelTemplate.verticalCenter = "middle";
labelTemplate.fillOpacity = 1;
labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
labelTemplate.background.fillOpacity = 1;
labelTemplate.padding(0, 0, 0, 0);

let series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
series.columns.template.height = am4core.percent(20);
series.columns.template.tooltipText = "{X2}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

series.dataFields.openDateX = "D1";
series.dataFields.dateX = "D2";
series.dataFields.categoryY = "X1";
series.columns.template.propertyFields.fill = "color"; // get color from data
series.columns.template.propertyFields.stroke = "color";
series.columns.template.strokeOpacity = 1;
series.columns.template.maxWidth = 50

let bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.circle.radius = 7;
bullet.circle.strokeOpacity = 1;
bullet.propertyFields.fill = "color";
bullet.locationX = 0;
bullet.circle.maxHeight = 50;
bullet.circle.maxWidth = 50


let bullet2 = series.bullets.push(new am4charts.CircleBullet());
bullet2.circle.radius = 7;
bullet2.circle.strokeOpacity = 1;
bullet2.propertyFields.fill = "color";
bullet2.locationX = 1;


let imageBullet1 = series.bullets.push(new am4plugins_bullets.PinBullet());
imageBullet1.disabled = true;
imageBullet1.propertyFields.disabled = "disabled1";
imageBullet1.locationX = 1;
imageBullet1.circle.radius = 7;
imageBullet1.propertyFields.stroke = "color";
imageBullet1.background.propertyFields.fill = "color";
imageBullet1.image = new am4core.Image();

// imageBullet1.image.propertyFields.href = "image1";

// imageBullet1.height = 30;
// imageBullet1.width = 30;
// imageBullet1.label.text = "{valueY}";

let imageBullet2 = series.bullets.push(new am4plugins_bullets.PinBullet());
imageBullet2.disabled = true;
imageBullet2.propertyFields.disabled = "disabled2";
imageBullet2.locationX = 0;
imageBullet2.circle.radius = 100;
imageBullet2.propertyFields.stroke = "color";
imageBullet2.background.propertyFields.fill = "color";
imageBullet2.image = new am4core.Image();


// imageBullet2.image.propertyFields.href = "image2";


let eventSeries = chart.series.push(new am4plugins_timeline.CurveLineSeries());
eventSeries.dataFields.dateX = "D1";
eventSeries.dataFields.categoryY = "X1";
eventSeries.data = this.data

console.log(this.data)

// eventSeries.data = [
//     { category: "", eventDate: "2019-01-15", letter: "A", description: "Something happened here" },
//     { category: "", eventDate: "2019-01-23", letter: "B", description: "Something happened here" },
//     { category: "", eventDate: "2019-02-10", letter: "C", description: "Something happened here" },
//     { category: "", eventDate: "2019-02-29", letter: "D", description: "Something happened here" },
//     { category: "", eventDate: "2019-03-06", letter: "E", description: "Something happened here" },
//     { category: "", eventDate: "2019-03-12", letter: "F", description: "Something happened here" },
//     { category: "", eventDate: "2019-03-22", letter: "G", description: "Something happened here" }];
eventSeries.strokeOpacity = 0;

let flagBullet = eventSeries.bullets.push(new am4plugins_bullets.FlagBullet())
flagBullet.label.propertyFields.text = "X2";
flagBullet.locationX = 10;
flagBullet.tooltipText = "{X2}";
flagBullet.width = 50;

chart.scrollbarX = new am4core.Scrollbar();
// chart.scrollbarX.start = 0;
// chart.scrollbarX.end = 0.5;
chart.scrollbarX.align = "center"
chart.scrollbarX.width = am4core.percent(85);

let cursor = new am4plugins_timeline.CurveCursor();
chart.cursor = cursor;
cursor.xAxis = dateAxis;
cursor.yAxis = categoryAxis;
cursor.lineY.disabled = true;
cursor.lineX.strokeDasharray = "1,4";
cursor.lineX.strokeOpacity = 1;

dateAxis.renderer.tooltipLocation2 = 0;
categoryAxis.cursorTooltipEnabled = false;

chart.legend = new am4charts.Legend();



// let markerTemplate = chart.legend.markers.template;
// markerTemplate.width = 5;
// markerTemplate.height = 5 ;

// chart.legend.valueLabels.template.align = "right";
// chart.legend.valueLabels.template.textAlign = "end";

// chart.legend.itemContainers.template.paddingTop = 1;
// chart.legend.itemContainers.template.paddingBottom = 1;

// chart.legend.position = "right";
// chart.legend.maxHeight = 150;
// chart.legend.scrollable = true;
// chart.legend.maxWidth = 150;


categoryAxis.renderer.autoScale = true;

if ((this.platform.is('ios') || this.platform.is('android'))) {

    let label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 400;
    label.tooltipText = "{category}";
    label.fill = am4core.color("#808080");

    let per = 4 / this.data.length * 100
    //console.log(per)

    let c = per / 100;
    chart.scrollbarX.end= c;
    chart.swipeable = true;
    categoryAxis.renderer.labels.template.wrap = true;

    categoryAxis.events.on("sizechanged", function (ev) {
      var axis = ev.target;
      var cellWidth = 80;
      axis.renderer.labels.template.maxWidth = cellWidth;
    });
    categoryAxis.renderer.maxHeight = 50;
    categoryAxis.tooltipText = "{category}";
    categoryAxis.fill = am4core.color("#808080");

    series.events.on("hit", ($event) => {
      categoryAxis.tooltipText = "{category}";
      categoryAxis.fill = am4core.color("#808080");

    })


            categoryAxis.events.on("sizechanged", function (ev) {
        let axis = ev.target;
        var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
        if (cellWidth < axis.renderer.labels.template.maxWidth) {
          axis.renderer.labels.template.rotation = -45;
          axis.renderer.labels.template.horizontalCenter = "right";
          axis.renderer.labels.template.verticalCenter = "middle";
        }
        else {
          axis.renderer.labels.template.rotation = 0;
          axis.renderer.labels.template.horizontalCenter = "middle";
          axis.renderer.labels.template.verticalCenter = "top";
        }
      });

    // categoryAxis.renderer.maxWidth = 50;
    // categoryAxis.renderer.labels.template.wrap = true;
    // categoryAxis.renderer.labels.template.rotation = 90;
    // categoryAxis.renderer.labels.template.maxWidth = categoryAxis.renderer.maxHeight;

  } else {
    series.events.on("hit", ($event) => {
      let label = categoryAxis.renderer.labels.template;
      categoryAxis.tooltipText = "{category}";
      categoryAxis.fill = am4core.color("#808080");

    })
    for (let d of this.data) {
      if (d.X1 && d.X1.indexOf(' ') > -1) {
        this.doubleLineFlag = true;
      }
    }

    if (!this.frame.design_control_type || this.frame.design_control_type >= 8) {
      if (this.data.length > 6) {
        let per = 6 / this.data.length * 100
        //console.log(per)
        let c = per / 100;
        chart.scrollbarX.end= c;
      }

    }
    if (this.frame.design_control_type && this.frame.design_control_type >= 4 && this.frame.design_control_type < 8) {
      if (this.data.length > 6) {
        let per = 6 / this.data.length * 100

        let c = per / 100;
        chart.scrollbarX.end= c;
      }
    }
    if (this.frame.design_control_type && this.frame.design_control_type < 4) {
      if (this.data.length > 8) {
        let per = 8 / this.data.length * 100
        let c = per / 100;
        chart.scrollbarX.end= c;
      }
    }

    if (this.doubleLineFlag) {
      // categoryAxis.renderer.labels.template.wrap = true;
      // categoryAxis.events.on("sizechanged", function (ev) {
      //   var axis = ev.target;
      //   var cellWidth = 50;
      //   axis.renderer.labels.template.maxWidth = cellWidth;

      //   categoryAxis.renderer.paddingLeft = 1;
      //   chart.swipeable = true;
      //   categoryAxis.renderer.maxHeight = 42;
      //   categoryAxis.tooltipText = "{category}";
      //   categoryAxis.fill = am4core.color("#c7cacd");
      // });
      let label = categoryAxis.renderer.labels.template;
      label.truncate = true;
      label.maxWidth = 80;
      label.tooltipText = "{category}";
      label.fill = am4core.color("#808080");

      label.hideOversized = false;

      series.events.on("hit", ($event) => {
        let label = categoryAxis.renderer.labels.template;
        categoryAxis.tooltipText = "{category}";
        categoryAxis.fill = am4core.color("#808080");
        //console.log()
      });


      categoryAxis.tooltip.label.maxWidth = 400;
      categoryAxis.tooltip.label.wrap = true;

      categoryAxis.events.on("sizechanged", function (ev) {
        let axis = ev.target;
        var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
        if (cellWidth < axis.renderer.labels.template.maxWidth) {
          axis.renderer.labels.template.rotation = -45;
          axis.renderer.labels.template.horizontalCenter = "right";
          axis.renderer.labels.template.verticalCenter = "middle";
        }
        else {
          axis.renderer.labels.template.rotation = 0;
          axis.renderer.labels.template.horizontalCenter = "middle";
          axis.renderer.labels.template.verticalCenter = "top";
        }
      });

    } else {
      let label = categoryAxis.renderer.labels.template;
      // label.truncate = true;
      label.maxWidth = 50;
      label.tooltipText = "{category}";
      label.fill = am4core.color("#808080");

      label.hideOversized = false;


      categoryAxis.tooltip.label.maxWidth = 400;
      categoryAxis.tooltip.label.wrap = true;

      categoryAxis.events.on("sizechanged", function (ev) {
        let axis = ev.target;
        var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
        if (cellWidth < axis.renderer.labels.template.maxWidth) {
          axis.renderer.labels.template.rotation = -45;
          axis.renderer.labels.template.horizontalCenter = "right";
          axis.renderer.labels.template.verticalCenter = "middle";
        }
        else {
          axis.renderer.labels.template.rotation = 0;
          axis.renderer.labels.template.horizontalCenter = "middle";
          axis.renderer.labels.template.verticalCenter = "top";
        }
      });
    }

  }


  }

}
