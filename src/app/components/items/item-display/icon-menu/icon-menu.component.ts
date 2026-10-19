import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-icon-menu',
  templateUrl: './icon-menu.component.html',
  styleUrls: ['./icon-menu.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class IconMenuComponent implements OnInit {

  @Input() iconMenu : any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(public globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"icon-menu")
    }
   }

  ngOnInit() {
    if(!this.iconMenu.apps_icon_name){
      this.iconMenu.apps_icon_name = "aperture";
    }
    if(!this.iconMenu.css_class){
      this.iconMenu.css_class = "bg-blue";
    }
  }

  itemClicked(event){
    this.emitPass.emit(event);
  }
}
