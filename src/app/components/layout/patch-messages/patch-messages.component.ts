import { Component, OnInit } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
  selector: 'app-patch-messages',
  templateUrl: './patch-messages.component.html',
  styleUrls: ['./patch-messages.component.scss'],
  imports:[STANDALONE_IMPORTS]
})
export class PatchMessagesComponent implements OnInit {

  arr = [];

  constructor(private globalObjects: GlobalObjectsService) { }

  ngOnInit() {
    let jmw_data = this.globalObjects.getLocallData('jmw_data');

    if (jmw_data) {
      this.arr = jmw_data;
    }
  }

  remove(i) {
    this.arr.splice(i, 1);

    this.globalObjects.setDataLocally('jmw_data', this.arr);
    // if (this.arr.length > 0) {
    // } else {
    //   this.globalObjects.patch_flag = false;
    //   this.globalObjects.destroyLocalData('jmw_data');
    // }
  }

}
