import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { TextInputNComponent } from '../../items/item-input/text-input-n/text-input-n.component';
import { NumberInputComponent } from '../../items/item-input/number-input/number-input.component';
import { ParaTextComponent } from '../../items/item-display/para-text/para-text.component';
import { CheckBoxComponent } from '../../items/item-input/check-box/check-box.component';
import { ButtonComponent } from '../../items/item-display/button/button.component';
import { DateInputNComponent } from '../../items/item-input/date-input-n/date-input-n.component';
import { ItemsComponent } from '../../items/items.component';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,TextInputNComponent,NumberInputComponent,ParaTextComponent,CheckBoxComponent,ButtonComponent,ItemsComponent,DateInputNComponent],
  selector: 'app-frame-plasto-summary-card',
  templateUrl: './frame-plasto-summary-card.component.html',
  styleUrls: ['./frame-plasto-summary-card.component.scss'],
})
export class FramePlastoSummaryCardComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  parentRows = [];
  summaryCartArr = [];
  tableRows = [];
  tHead = [];

  parentdata = [];

  constructor(private globalObjects: GlobalObjectsService) {
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-plasto-summary-card")
    }
   }

  ngOnInit() {
  this.summaryCartArr = this.globalObjects.plastoFrameSumm;

  let tableRows = [];
  if(this.globalObjects.plastoFrameSumm.length > 0){
    for(let p of this.globalObjects.plastoFrameSumm){
      if(p.cartArr){
        for(let c of p.cartArr){
          if(c.parentRow){
           for(let p of c.parentRow){
             tableRows.push(c.cardRow);
           }
          }
        }
      }
    }
  }
}

}
