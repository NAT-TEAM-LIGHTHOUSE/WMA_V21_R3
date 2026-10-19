import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
// import * as am5flow from '@amcharts/amcharts5-flow';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [CommonModule],
  selector: 'app-angular-gaugetwo-axis',
  templateUrl: './angular-gaugetwo-axis.component.html',
  styleUrls: ['./angular-gaugetwo-axis.component.scss'],
})
export class AngularGaugetwoAxisComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
   }


  ngOnInit() {
    // alert("init");
    this.id = "GaugeGradient_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
    let root = am5.Root.new(this.id);


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    let chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      startAngle: 180,
      endAngle: 360,
      radius: am5.percent(90),
      layout: root.verticalLayout
    }));
    
    
    // Colors
    let colors = am5.ColorSet.new(root, {
      step: 2
    });
    
    
    // Measurement #1
    
    // Axis
    let color1 = colors.next();
    
    let axisRenderer1:any = am5radar.AxisRendererCircular.new(root, {
      radius: -10,
      stroke: color1,
      strokeOpacity: 1,
      strokeWidth: 6,
      inside: true
    });
    
    axisRenderer1.grid.template.setAll({
      forceHidden: true
    });
    
    axisRenderer1.ticks.template.setAll({
      stroke: color1,
      visible: true,
      length: 10,
      strokeOpacity: 1,
      inside: true
    });
    
    axisRenderer1.labels.template.setAll({
      radius: 15,
      inside: true
    });
    
    let xAxis1:any = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      max: 160,
      strictMinMax: true,
      renderer: axisRenderer1
    }));
    
    
    // Label
    let label1 = chart.seriesContainer.children.push(am5.Label.new(root, {
      fill: am5.color(0xffffff),
      x: -100,
      y: -60,
      width: 100,
      centerX: am5.percent(50),
      textAlign: "center",
      centerY: am5.percent(50),
      fontSize: "2em",
      text: "0",
      background: am5.RoundedRectangle.new(root, {
        fill: color1
      })
    }));
    
    // Add clock hand
    let axisDataItem1 = xAxis1.makeDataItem({
      value: 0,
      fill: color1,
      name: "Measurement #1"
    });
    
    let clockHand1 = am5radar.ClockHand.new(root, {
      pinRadius: 14,
      radius: am5.percent(98),
      bottomWidth: 10
    });
    
    clockHand1.pin.setAll({
      fill: color1
    });
    
    clockHand1.hand.setAll({
      fill: color1
    });
    
    let bullet1 = axisDataItem1.set("bullet", am5xy.AxisBullet.new(root, {
      sprite: clockHand1
    }));
    
    xAxis1.createAxisRange(axisDataItem1);
    
    axisDataItem1.get("grid").set("forceHidden", true);
    axisDataItem1.get("tick").set("forceHidden", true);
    
    
    // Measurement #2
    
    // Axis
    let color2 = colors.next();
    
    let axisRenderer2 = am5radar.AxisRendererCircular.new(root, {
      //innerRadius: -40,
      stroke: color2,
      strokeOpacity: 1,
      strokeWidth: 6
    });
    
    axisRenderer2.grid.template.setAll({
      forceHidden: true
    });
    
    axisRenderer2.ticks.template.setAll({
      stroke: color2,
      visible: true,
      length: 10,
      strokeOpacity: 1
    });
    
    axisRenderer2.labels.template.setAll({
      radius: 15
    });
    
    let xAxis2:any = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      max: 240,
      strictMinMax: true,
      renderer: axisRenderer2
    }));
    
    
    // Label
    let label2 = chart.seriesContainer.children.push(am5.Label.new(root, {
      fill: am5.color(0xffffff),
      x: 100,
      y: -60,
      width: 100,
      centerX: am5.percent(50),
      textAlign: "center",
      centerY: am5.percent(50),
      fontSize: "2em",
      text: "0",
      background: am5.RoundedRectangle.new(root, {
        fill: color2
      })
    }));
    
    
    // Add clock hand
    let axisDataItem2 = xAxis2.makeDataItem({
      value: 0,
      fill: color2,
      name: "Measurement #2"
    });
    
    let clockHand2 = am5radar.ClockHand.new(root, {
      pinRadius: 10,
      radius: am5.percent(98),
      bottomWidth: 10
    });
    
    clockHand2.pin.setAll({
      fill: color2
    });
    
    clockHand2.hand.setAll({
      fill: color2
    });
    
    let bullet2 = axisDataItem2.set("bullet", am5xy.AxisBullet.new(root, {
      sprite: clockHand2
    }));
    
    xAxis2.createAxisRange(axisDataItem2);
    
    axisDataItem2.get("grid").set("forceHidden", true);
    axisDataItem2.get("tick").set("forceHidden", true);
    
    
    // Legend
    let legend = chart.children.push(am5.Legend.new(root, {
      x: am5.p50,
      centerX: am5.p50
    }));
    legend.data.setAll([axisDataItem1, axisDataItem2])
    
    
    // Animate values
    setInterval(function () {
      let value1:any = Math.round(Math.random() * 160);
      axisDataItem1.animate({
        key: "value",
        to: value1,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic)
      });
      
      label1.set("text", value1);
      
      let value2:any = Math.round(Math.random() * 240);
      axisDataItem2.animate({
        key: "value",
        to: value2,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic)
      });
      
      label2.set("text", value2);
    }, 2000)
    
    // chart.bulletsContainer.set("mask", undefined);
    
    
    // // Create axis ranges bands
    // // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
    // var bandsData = [{
    //   title: "Unsustainable",
    //   color: "#ee1f25",
    //   lowScore: -40,
    //   highScore: -20
    // }, {
    //   title: "Volatile",
    //   color: "#f04922",
    //   lowScore: -20,
    //   highScore: 0
    // }, {
    //   title: "Foundational",
    //   color: "#fdae19",
    //   lowScore: 0,
    //   highScore: 20
    // }, {
    //   title: "Developing",
    //   color: "#f3eb0c",
    //   lowScore: 20,
    //   highScore: 40
    // }, {
    //   title: "Maturing",
    //   color: "#b0d136",
    //   lowScore: 40,
    //   highScore: 60
    // }, {
    //   title: "Sustainable",
    //   color: "#54b947",
    //   lowScore: 60,
    //   highScore: 80
    // }, {
    //   title: "High Performing",
    //   color: "#0f9747",
    //   lowScore: 80,
    //   highScore: 100
    // }];
    
    // am5.array.each(bandsData, function (data) {
    //   var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
    
    //   axisRange.setAll({
    //     value: data.lowScore,
    //     endValue: data.highScore
    //   });
    
    //   axisRange.get("axisFill").setAll({
    //     visible: true,
    //     fill: am5.color(data.color),
    //     fillOpacity: 0.8
    //   });
    
    //   axisRange.get("label").setAll({
    //     text: data.title,
    //     inside: true,
    //     radius: 15,
    //     fontSize: "0.9em",
    //     fill: root.interfaceColors.get("background")
    //   });
    // });
    
    
    // Make stuff animate on load
    chart.appear(1000, 100);
  }

}
