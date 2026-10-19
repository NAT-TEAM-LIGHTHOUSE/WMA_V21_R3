import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import * as  am5xy from "@amcharts/amcharts5/xy";
import * as  am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Subject } from 'rxjs';
import { PopoverController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
@Component({
standalone : true,
imports : [],
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss'],
})
export class ProgressChartComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private gloabalObject : GlobalObjectsService,private PopoverController: PopoverController, private ngZone:NgZone) {
  }


 ngOnInit() {
   // alert("init");
   this.id = "progressChart_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
    
    
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
      })
    );
    

    let data:any=[];
for(let d of this.data){
  let specData={
    category: "",
    from: d.Y1,
    to: d.Y2,
    name : d.X1,
    columnSettings: {
      fill: am5.color("#"+d.X2)
  }
}
data.push(specData);
}

    // let data = [{
    //   category: "",
    //   from: 0,
    //   to: 15,
    //   name: "Stage #1",
    //   columnSettings: {
    //     fill: am5.color(0x0ca948)
    //   }
    // }, {
    //   category: "",
    //   from: 15,
    //   to: 75,
    //   name: "Stage #2",
    //   columnSettings: {
    //     fill: am5.color(0x93da49)
    //   }
    // }, {
    //   category: "",
    //   from: 75,
    //   to: 90,
    //   name: "Stage #3",
    //   columnSettings: {
    //     fill: am5.color(0xffd100)
    //   }
    // }, {
    //   category: "",
    //   from: 90,
    //   to: 95,
    //   name: "Stage #4",
    //   columnSettings: {
    //     fill: am5.color(0xcd213b)
    //   }
    // }, {
    //   category: "",
    //   from: 95,
    //   to: 100,
    //   name: "Stage #5",
    //   columnSettings: {
    //     fill: am5.color(0x9e9e9e)
    //   }
    // }];
    

    let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererY.new(root, {})
    }));
    yAxis.data.setAll([{ category: "" }]);
    
    
    let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      max: 100,
      numberFormat: "#'%'",
      renderer: am5xy.AxisRendererX.new(root, {})
    }));
    
    xAxis.get("renderer").labels.template.set("forceHidden", true);
    
  
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "to",
      openValueXField: "from",
      categoryYField: "category",
      categoryXField: "name"
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
        centerX: am5.p0,
        forceHidden: false,
        fontSize: 10,
        text: data[i].from + "%"
      });
    }

     legend = chart.children.push(am5.Legend.new(root, {
      nameField: "categoryX",
      centerX: am5.percent(50),
      x: am5.percent(50),
      clickTarget: "none"
    }));
    
    legend.markerRectangles.template.setAll({
      strokeOpacity: 0
    });
    
    legend.data.setAll(series.dataItems);
    

    series.appear();
    chart.appear(1000, 100);
  }
  }
