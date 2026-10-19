import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-card-button-modal',
  templateUrl: './card-button-modal.component.html',
  styleUrls: ['./card-button-modal.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class CardButtonModalComponent implements OnInit {

  @Input() containerRows:any
  @Input() rowindex:any
  constructor(private popover:PopoverController) { }
  ngOnInit() {}
  
  itemClicked(item){
    this.popover.dismiss(item,'carBtnClose')
  }
}