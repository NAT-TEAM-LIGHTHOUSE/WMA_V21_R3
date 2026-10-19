import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as  am5venn from "@amcharts/amcharts5/venn";
import * as  am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Subject } from 'rxjs';

@Component({
standalone : true,
imports : [],
  selector: 'app-venn-diagram',
  templateUrl: './venn-diagram.component.html',
  styleUrls: ['./venn-diagram.component.scss'],
})
export class VennDiagramComponent  implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="";
  @Input() subData: Subject<any>;

 constructor(private gloabalObject : GlobalObjectsService, private ngZone:NgZone) { }

 ngOnInit() {
   this.id = "vennDiagram_"+ this.frame.apps_page_frame_seqid + this.gloabalObject.chartId ;
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
 for(let i=0;i<this.data.length;i++){
   let showDataObj={
     Y1:this.data[i].Y1,
         X1:this.data[i].X1+i
   }
   datashow.push(showDataObj);
 }
 this.data=datashow;
}
displayChart(){
 this.setData();
 /* Chart code */
// Create root
let root = am5.Root.new(this.id);

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
 categoryField: "X1",
 valueField: "Y1",
 intersectionsField: "sets",
 paddingTop: 40,
 paddingBottom: 40,
 paddingLeft: 40,
 paddingRight: 40
}));


chart.data.setAll(this.data);
// Set tooltip content
chart.slices.template.set("tooltipText", "{category}: {value}");

// Set up hover appearance
chart.hoverGraphics.setAll({
 strokeDasharray: [3, 3],
 stroke: am5.color(0xffffff),
 strokeWidth: 2
});

// Add legend
let legend = container.children.push(
 am5.Legend.new(root, {
   centerX: am5.p50,
   x: am5.p50
 })
);
legend.data.setAll(chart.dataItems);
}

}
