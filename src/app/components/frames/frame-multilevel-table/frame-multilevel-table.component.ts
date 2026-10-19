import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-multilevel-table',
  templateUrl: './frame-multilevel-table.component.html',
  styleUrls: ['./frame-multilevel-table.component.scss'],
})
export class FrameMultilevelTableComponent implements OnInit {
  isShown: boolean = false ; // hidden by default
  isShown1: boolean = false ;
  isShown2: boolean = false ;
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-multilevel-table")
    }
   }

  ngOnInit() {}
 


  toggleShow() {
  
  this.isShown = ! this.isShown;
  }  
  toggleShow1() {
  
    this.isShown1 = ! this.isShown1;
    } 
    toggleShow2() {
  
      this.isShown2 = ! this.isShown2;
      }  
}
