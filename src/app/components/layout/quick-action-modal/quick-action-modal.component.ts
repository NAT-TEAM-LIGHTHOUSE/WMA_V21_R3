import { Component, OnInit } from '@angular/core';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[...STANDALONE_IMPORTS],
  selector: 'app-quick-action-modal',
  templateUrl: './quick-action-modal.component.html',
  styleUrls: ['./quick-action-modal.component.scss'],
})
export class QuickActionModalComponent implements OnInit {
  frame: any;
  constructor(private canvasModal: CanvasModalService) { }

  ngOnInit() { }

  itemClicked(item) {
    if (item.item_enable_flag == 'T') {
      this.canvasModal.popDismiss(item)
    }
  }
}
