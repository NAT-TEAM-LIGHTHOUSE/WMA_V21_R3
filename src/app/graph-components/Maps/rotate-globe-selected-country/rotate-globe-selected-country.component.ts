import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5index from "@amcharts/amcharts5/index";
import * as am5map from "@amcharts/amcharts5/map";



import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
// import * as am4geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
standalone : true,
imports : [],
  selector: 'app-rotate-globe-selected-country',
  templateUrl: './rotate-globe-selected-country.component.html',
  styleUrls: ['./rotate-globe-selected-country.component.scss'],
})
export class RotateGlobeSelectedCountryComponent implements OnInit {

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
      this.displayChart();
      })
    }, 100);

    
    this.subData.subscribe(data => {
      this.data = data;
      this.displayChart();
    })
  }

  displayChart(){
    
  }
}
