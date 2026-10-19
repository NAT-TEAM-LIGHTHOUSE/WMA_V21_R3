import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[...STANDALONE_IMPORTS],
  selector: 'app-noteslink',
  templateUrl: './noteslink.component.html',
  styleUrls: ['./noteslink.component.scss'],
})
export class NoteslinkComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {}
  tableRows = [];
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.layoutFlag){
      return applyLoggingDecorator(this,"noteslink")
    }
  }

  ngOnInit() {}

  itemClicked(event){
    this.emitPass.emit(event)
  }
}
