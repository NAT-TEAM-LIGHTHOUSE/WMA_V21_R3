import { Component, OnInit } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-statuslink',
  templateUrl: './statuslink.component.html',
  styleUrls: ['./statuslink.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class StatuslinkComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
