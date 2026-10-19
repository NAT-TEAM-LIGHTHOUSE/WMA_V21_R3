import { Component, OnInit } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-image-input-circle',
  templateUrl: './image-input-circle.component.html',
  styleUrls: ['./image-input-circle.component.scss'],
})
export class ImageInputCircleComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
