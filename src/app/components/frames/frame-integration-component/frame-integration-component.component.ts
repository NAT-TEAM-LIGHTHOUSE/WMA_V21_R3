import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,ItemsComponent],
  selector: 'app-frame-integration-component',
  templateUrl: './frame-integration-component.component.html',
  styleUrls: ['./frame-integration-component.component.scss'],
})
export class FrameIntegrationComponentComponent implements OnInit {
@Input() frame:any={}
@Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
@Input() wscp
imgUrl
baseImg
title
  constructor(private globalObjects:GlobalObjectsService,private sqlServ: SqlLiteService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log(this.frame)
    for(let framedata of this.frame.canvasRows){
      for(let itemGroup of framedata){
        for(let item of itemGroup.Level5){
          if(item.item_type=='TITLE' && item.item_visible_flag=='T'){
            if(item.item_sub_type=='LOGO'){
              this.imgUrl = this.globalObjects.getScopeUrl() + 'getImage?id=' + item.apps_icon_name + '&appTheme=' + this.globalObjects.appTheme;
              this.sqlServ.getImageFromLocal(item, this.imgUrl).then((res: any) => {
                this.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
              });
            }
            if(item.item_sub_type=='TEXT'){
              this.title=item.value
            }
          }
          
        }
      }
    }
  }

  itemClicked(item){
    this.emitPass.emit(item)
  }
}
