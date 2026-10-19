import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-frame-smart-filter-sliding-buttons',
  templateUrl: './frame-smart-filter-sliding-buttons.component.html',
  styleUrls: ['./frame-smart-filter-sliding-buttons.component.scss'],
})
export class FrameSmartFilterSlidingButtonsComponent implements OnInit {

  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-smart-filter-sliding")
    }
   }

  ngOnInit() {}
 
  onButtonGroupClick($event){
    
    let clickedElement = $event.target || $event.srcElement;
      
    if( clickedElement.nodeName === "ION-BUTTON" ) {
      let elemClasses = (clickedElement as HTMLIonButtonElement).classList;
      
      let isActive = elemClasses.contains("active");
      
      if( isActive ) {
        elemClasses.remove("active");
        elemClasses.add("inactive");
      }else{

        clickedElement.className += " active";
      }

    }

  }
}
