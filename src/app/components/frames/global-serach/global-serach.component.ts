import { Component, OnInit } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-global-serach',
  templateUrl: './global-serach.component.html',
  styleUrls: ['./global-serach.component.scss'],
})
export class GlobalSerachComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
