import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { CommonMethodService } from 'src/app/services/common-method.service';
import { Events } from 'src/app/services/events';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[...STANDALONE_IMPORTS],
  selector: 'app-itemclick',
  templateUrl: './itemclick.component.html',
  styleUrls: ['./itemclick.component.scss'],
})
export class ItemclickComponent implements OnInit {
  @Input() frame: any = {};
  @Input() item: any = {};
   @Input() isopen: any = {};
   @Input() e: any = {};
   @Input() index: any = {};
   @Input() rowCount: number;
   @Input() displayDataLen: number
   @Input() page: number
   @Input() parentDiv: any
   @Input() table2Body: any
   constructor(private events: Events, private commonMethod: CommonMethodService,private modalCtrl : ModalController) { }
 
   ngOnInit() {
     this.frame.rowCount = this.frame.from_record + this.index;
     console.log(this.item);
   }
 
  
  //  paginate(a_current_page) {
  //    this.page = a_current_page
  //    this.events.publish(`PageNumberSubscribe#${this.frame.apps_page_frame_seqid}`, this.page)
  //    this.commonMethod.paginate(a_current_page, this.frame, this.displayDataLen)
  //  }
   
  //  tableScrollEffect(direction){
  //    let children: any = this.table2Body.nativeElement.children && this.table2Body.nativeElement.children.length > 0 ? this.table2Body.nativeElement.children : [];
  //    let el = this.table2Body.nativeElement.children[this.frame.active_row];
  //    for (let c of children) {
  //      if (c.className.includes("trow-active")) {
  //        el = c;
  //      }
  //    }
  //    var ul = this.parentDiv.nativeElement;
  //    var elRect = el.getBoundingClientRect(),
  //      parRect = ul.getBoundingClientRect();
  //    if (elRect && parRect) {
  //      var elementHeight = elRect.height;
  //      if(direction=="forward"){
  //        if (!(elRect.top >= parRect.top && elRect.bottom <= parRect.bottom - 40 && elRect.bottom + elementHeight <= parRect.bottom - 40)) {
  //          if (parRect.height > elRect.bottom)
  //            ul.scrollTop = ul.scrollTop + (parRect.height - elRect.bottom);
  //          else
  //            ul.scrollTop = ul.scrollTop + elRect.height + (elRect.bottom - parRect.bottom + 40);
  //        }
  //      }else{
  //        if ((elRect.top) <= (parRect.top + 40) + elementHeight) {
  //          if (parRect.top + elementHeight >= elRect.top)
  //            ul.scrollTop = ul.scrollTop - (((parRect.top + 40) + elementHeight) - (elRect.top));
  //          else
  //            ul.scrollTop = ul.scrollTop - (elRect.height + (parRect.top + 40) - elRect.top);
  //        }
  //      }
  //    }
  //  }

  isObjectOrArray(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }
  

   closeModal(){
    this.modalCtrl.dismiss();
   }
 }
 
