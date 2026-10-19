import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-releasenotes',
  templateUrl: './releasenotes.component.html',
  styleUrls: ['./releasenotes.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class ReleasenotesComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {}
  constructor() { }

  ngOnInit() {

    console.log(this.frame)
  }
  itemClicked(event,i){
    this.emitPass.emit(event)
  
  }
  ngOnDestroy(){
    console.clear()
   }
}
