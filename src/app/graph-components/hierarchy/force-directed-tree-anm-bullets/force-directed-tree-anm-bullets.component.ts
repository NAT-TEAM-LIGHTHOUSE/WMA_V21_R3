import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
@Component({
standalone : true,
imports : [],
  selector: 'app-force-directed-tree-anm-bullets',
  templateUrl: './force-directed-tree-anm-bullets.component.html',
  styleUrls: ['./force-directed-tree-anm-bullets.component.scss'],
})
export class ForceDirectedTreeAnmBulletsComponent implements OnInit {

  @Input() data: any;
  @Input() frame: any;
  id="chartdiv";
  @Input() subData: Subject<any>
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
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
      // this.displayChart();
      })
    }, 100);

    
    this.subData.subscribe(data => {
      this.data = data;
      // this.displayChart();
    })
  }

//   displayChart(){


//     /* Chart code */
// // Create root element
// // https://www.amcharts.com/docs/v5/getting-started/#Root_element
// let root = am5.Root.new("chartdiv");


// // Set themes
// // https://www.amcharts.com/docs/v5/concepts/themes/
// root.setThemes([
//   am5themes_Animated.new(root)
// ]);


// let zoomableContainer = root.container.children.push(
//   am5.ZoomableContainer.new(root, {
//     width: am5.p100,
//     height: am5.p100,
//     wheelable: true,
//     pinchZoom: true
//   })
// );

// let zoomTools = zoomableContainer.children.push(am5.ZoomTools.new(root, {
//   target: zoomableContainer
// }));

// // Create series
// // https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
// let series = zoomableContainer.contents.children.push(am5hierarchy.ForceDirected.new(root, {
//   singleBranchOnly: false,
//   downDepth: 1,
//   initialDepth: 10,
//   nodePadding: 20,
//   valueField: "value",
//   categoryField: "name",
//   childDataField: "children"
// }));

// series.linkBullets.push(function(root, source, target) {
//   const bullet = am5.Bullet.new(root, {
//     locationX: 0.5,
//     autoRotate: true,
//     autoRotateAngle: 180,
//     sprite: am5.Graphics.new(root, {
//       fill: source.get("fill"),
//       centerY: am5.percent(50),
//       centerX: am5.percent(50),
//       draw: function(display) {
//         display.moveTo(0, -6);
//         display.lineTo(16, 0);
//         display.lineTo(0, 6);
//         display.lineTo(3, 0);
//         display.lineTo(0, -6);
//       }
//     })
//   });

//   bullet.animate({
//     key: "locationX",
//     to: -0.1,
//     from: 1.1,
//     duration: Math.random() * 500 + 1000,
//     loops: Infinity,
//     easing: am5.ease.quad
//   });

//   return bullet;
// });

// series.labels.template.set("minScale", 0);

// // Generate and set data
// // https://www.amcharts.com/docs/v5/charts/hierarchy/#Setting_data
// let maxLevels = 1;
// let maxNodes = 3;
// let maxValue = 100;

// let data = {
//   name: "Root",
//   children: []
// }
// generateLevel(data, "", 0);

// series.data.setAll([data]);
// series.set("selectedDataItem", series.dataItems[0]);

// function generateLevel(data, name, level) {
//   for (var i = 0; i < Math.ceil(maxNodes * Math.random()) + 1; i++) {
//     let nodeName = name + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i];
//     let child;
//     if (level < maxLevels) {
//       child = {
//         name: nodeName + level
//       }

//       if (level > 0 && Math.random() < 0.5) {
//         child.value = Math.round(Math.random() * maxValue);
//       }
//       else {
//         child.children = [];
//         generateLevel(child, nodeName + i, level + 1)
//       }
//     }
//     else {
//       child = {
//         name: name + i,
//         value: Math.round(Math.random() * maxValue)
//       }
//     }
//     data.children.push(child);
//   }

//   level++;
//   return data;
// }


// // Make stuff animate on load
// series.appear(1000, 100);
//   }

}
