import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_timeline from "@amcharts/amcharts4/plugins/timeline";
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

/* Chart code */
// Themes begin
am4core.unuseTheme(am4themes_animated);

@Component({
standalone : true,
imports :  [CommonModule],
  selector: 'app-fishbone-timeline',
  templateUrl: './fishbone-timeline.component.html',
  styleUrls: ['./fishbone-timeline.component.scss'],
})
export class FishboneTimelineComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;

  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) { }

  ngOnInit() {
    this.id = "prepareFishBoneTimeline_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
    this.gloabalObject.chartId++;
    this.ngZone.runOutsideAngular(() => {
    setTimeout(() => {
     this.data =  this.frame.chartData;
      this.displayChart()
    }, 1000);
  })

  this.subData.subscribe(data => {
    this.data = data;
    this.displayChart();
  })
  }

  displayChart(){





    let chart = am4core.create(this.id, am4plugins_timeline.CurveChart);
    chart.curveContainer.padding(0, 100, 0, 120);
    chart.maskBullets = false;
    
    let colorSet = new am4core.ColorSet();

    chart.data = this.data;

    console.log(this.data)
    // chart.dateFormatter.inputDateFormat = "yyyy";
    chart.fontSize = 11;
    chart.tooltipContainer.fontSize = 11;
    
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis() as any);
    categoryAxis.dataFields.category = "X1";
    categoryAxis.renderer.grid.template.disabled = true;
    
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis() as any);
    dateAxis.renderer.points = [{ x: -400, y: 0 }, { x: 0, y: 50 }, { x: 400, y: 0 }]
    dateAxis.renderer.polyspline.tensionX = 0.8;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.line.strokeDasharray = "1,4";
    dateAxis.baseInterval = {period:"day", count:1}; // 
    
    dateAxis.renderer.labels.template.disabled = true;
    
    let series = chart.series.push(new am4plugins_timeline.CurveLineSeries());
    series.strokeOpacity = 0;
    series.dataFields.dateX = "X2";
    series.dataFields.categoryY = "X1";
    series.dataFields.value = "Y1";
    series.baseAxis = categoryAxis;
    
    let interfaceColors = new am4core.InterfaceColorSet();
    
    series.tooltip.pointerOrientation = "down";
    
    let distance = 60;
    let angle = 60;
    
    let bullet = series.bullets.push(new am4charts.Bullet());
    
    let line = bullet.createChild(am4core.Line);
    line.adapter.add("stroke", function(fill, target) {
      if (target.dataItem) {
        return chart.colors.getIndex(target.dataItem.index)
      }
    });
    
    line.x1 = 0;
    line.y1 = 0;
    line.y2 = 0;
    line.x2 = distance - 10;
    line.strokeDasharray = "1,3";
    
    let circle = bullet.createChild(am4core.Circle);
    circle.radius = 30;
    circle.fillOpacity = 1;
    circle.strokeOpacity = 0;
    
    let circleHoverState = circle.states.create("hover");
    circleHoverState.properties.scale = 1.3;
    
    series.heatRules.push({ target: circle, min: 20, max: 50, property: "radius" });
    circle.adapter.add("fill", function(fill, target) {
      if (target.dataItem) {
        return chart.colors.getIndex(target.dataItem.index)
      }
    });
    circle.tooltipText = "{X3}: {value}";
    // console.log(0)
    circle.adapter.add("tooltipY", function(tooltipY, target){
      return -target.pixelRadius - 4;
    });
    
    let yearLabel = bullet.createChild(am4core.Label);
    yearLabel.text = "{X2}";
    yearLabel.strokeOpacity = 0;
    yearLabel.fill = am4core.color("#fff");
    yearLabel.horizontalCenter = "middle";
    yearLabel.verticalCenter = "middle";
    yearLabel.interactionsEnabled = false;
    
    let label = bullet.createChild(am4core.Label);
    label.propertyFields.text = "X3";
    label.strokeOpacity = 0;
    label.horizontalCenter = "right";
    label.verticalCenter = "middle";

    label.truncate = true;
    label.maxWidth = 80;
   

// pieSeries.labels.template.maxWidth = 70;
// pieSeries.labels.template.wrap = true;
// pieSeries.alignLabels = false;  
    
    label.adapter.add("opacity", function(opacity, target) {
      if(target.dataItem){
        let index = target.dataItem.index;
        let line = target.parent.children.getIndex(0);
    
        if (index % 2 == 0) {
          target.y = -distance * am4core.math.sin(-angle);
          target.x = -distance * am4core.math.cos(-angle);
          line.rotation = -angle - 180;
          target.rotation = -angle;
        }
        else {
          target.y = -distance * am4core.math.sin(angle);
          target.x = -distance * am4core.math.cos(angle);
          line.rotation = angle - 180;
          target.rotation = angle;
        }
      }
      return 1;
    });
    
    let outerCircle = bullet.createChild(am4core.Circle);
    outerCircle.radius = 30;
    outerCircle.fillOpacity = 0;
    outerCircle.strokeOpacity = 0;
    outerCircle.strokeDasharray = "1,3";
    
    let hoverState = outerCircle.states.create("hover");
    hoverState.properties.strokeOpacity = 0.8;
    hoverState.properties.scale = 1.5;
    
    outerCircle.events.on("over", function(event:any){
      let circle = event.target.parent.children.getIndex(1);
      circle.isHover = true;
      event.target.stroke = circle.fill;
      event.target.radius = circle.pixelRadius;
      event.target.animate({property: "rotation", from: 0, to: 360}, 4000, am4core.ease.sinInOut);
    });
    
    outerCircle.events.on("out", function(event){
      let circle = event.target.parent.children.getIndex(1);
      circle.isHover = false;
    });
    

    chart.colors.list = [
      am4core.color("#845EC2"),
      am4core.color("#D65DB1"),
      am4core.color("#FF6F91"),
      am4core.color("#FF9671"),
      am4core.color("#FFC75F"),
      am4core.color("#F9F871")
    ];



    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.minHeight = 5;
    chart.scrollbarX.height = 0.2;
    
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.minWidth = 5;
    chart.scrollbarY.width = 0.2;     

    // chart.scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarX.opacity = 0.5;
    chart.scrollbarX.width = am4core.percent(50);
    // chart.scrollbarX.align = "center"


    chart.legend = new am4charts.Legend();
    
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 5;
    markerTemplate.height = 5 ;
    
    chart.legend.valueLabels.template.align = "right";
    chart.legend.valueLabels.template.textAlign = "end";
    
    chart.legend.itemContainers.template.paddingTop = 1;
    chart.legend.itemContainers.template.paddingBottom = 1;
    
    chart.legend.position = "right";
    chart.legend.maxHeight = 150;
    chart.legend.scrollable = true;
    chart.legend.maxWidth = 150;
  }




}
