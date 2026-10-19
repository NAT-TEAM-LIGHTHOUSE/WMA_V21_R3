import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class ImageComponent implements OnInit {

  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"image")
    }
   }

  ngOnInit() {
    // //console.log("this.querydata",this.displayPhoto);
  }
 
  itemClick(event) {
    // this.emitPass.emit(this.displayPhoto);
  }

  
}