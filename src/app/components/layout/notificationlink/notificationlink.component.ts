import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[...STANDALONE_IMPORTS],
  selector: 'app-notificationlink',
  templateUrl: './notificationlink.component.html',
  styleUrls: ['./notificationlink.component.scss'],
})
export class NotificationlinkComponent implements OnInit {
  
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {}
  constructor() { }

  ngOnInit() {}

}
