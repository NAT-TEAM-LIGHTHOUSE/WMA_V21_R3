import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-smart-filter-column',
  templateUrl: './frame-smart-filter-column.component.html',
  styleUrls: ['./frame-smart-filter-column.component.scss'],
})
export class FrameSmartFilterColumnComponent implements OnInit {

  constructor(private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-smart-filter-column")
    }
  }

  ngOnInit() { }
  onColumnClick($event: { target: any; }) {
    let clickedElement = $event.target;
    if (clickedElement.nodeName === "ION-COL") {
      let elemClasses = (clickedElement as HTMLIonColElement).classList;
      let isActive = elemClasses.contains("activeColumn");
      if (isActive) {
        elemClasses.remove("activeColumn");
        elemClasses.add("inactiveColumn");
      } else {
        clickedElement.className += " activeColumn";
      }
    }
  }

}
