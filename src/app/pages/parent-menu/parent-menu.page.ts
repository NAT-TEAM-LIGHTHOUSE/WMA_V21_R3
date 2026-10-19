import { isPlatformServer } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-parent-menu',
  templateUrl: './parent-menu.page.html',
  styleUrls: ['./parent-menu.page.scss'],
})
export class ParentMenuPage implements OnInit {

  show:boolean = false;
  buttonName:any = 'Show';
  openNewTab:boolean = false;
  @Input() childItems:any;
  constructor( public popOverCtrl: PopoverController, private globalObjects:GlobalObjectsService,@Inject(PLATFORM_ID) private platformId: Object) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"parent-menu-page")
    }
   }

  ngOnInit() {
    if(this.childItems.rightClickFlag){
      this.openNewTab = true;
    }else{
      this.openNewTab = false;
    }
  }
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  closePop(item){
    if(this.childItems.rightClickFlag){
      this.popOverCtrl.dismiss(this.childItems.calling_object_code,'openNewTab');
    }else{
      if(item.item_enable_flag == 'T'){
        this.popOverCtrl.dismiss(item,'openTab');
      }
    }
  }
  rightClickpopen(){
      if (isPlatformServer(this.platformId)) return;
   let targetid= document.getElementById('right-click-footer');
   targetid.classList.remove('collapse');
   document.getElementById('openrightp').style.display='none';
   document.getElementById('closerightp').style.display='block';
  }
  rightClickpoclose(){
      if (isPlatformServer(this.platformId)) return;
    let targetid= document.getElementById('right-click-footer');
    targetid.classList.add('collapse');
    document.getElementById('openrightp').style.display='block';
    document.getElementById('closerightp').style.display='none';
   }
}
