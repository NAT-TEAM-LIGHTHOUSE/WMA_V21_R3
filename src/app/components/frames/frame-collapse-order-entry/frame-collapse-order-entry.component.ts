import { Component, OnInit } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-collapse-order-entry',
  templateUrl: './frame-collapse-order-entry.component.html',
  styleUrls: ['./frame-collapse-order-entry.component.scss'],
})
export class FrameCollapseOrderEntryComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
