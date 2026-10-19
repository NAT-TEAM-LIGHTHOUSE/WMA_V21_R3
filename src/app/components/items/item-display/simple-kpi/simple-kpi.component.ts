import { Component, OnInit } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-simple-kpi',
  templateUrl: './simple-kpi.component.html',
  styleUrls: ['./simple-kpi.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class SimpleKpiComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
