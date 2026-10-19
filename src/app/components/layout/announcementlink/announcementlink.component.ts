import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-announcementlink',
  templateUrl: './announcementlink.component.html',
  styleUrls: ['./announcementlink.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class AnnouncementlinkComponent implements OnInit {

 @Input() globalData: any;
  @Input() localData: any;
  selectedTab: string = 'Global';
 localList: any[] = [];
  isChecked: boolean = false;
globalList: any[] = [];
  constructor(  ) { }

  ngOnInit() {
     this.localList = this.convertData(this.localData);
     this.globalList = this.convertData(this.globalData);
    console.log(this.localList);
    console.log(this.globalList);
  }
  ngOnDestroy(){
    console.clear()
   }

  

Onupdates(type: string) {
  this.selectedTab = type;
}

convertData(data: any): any[] {

  if (!data || data.length < 2) {
    return [];
  }

  const headers = data[0];
  const rows = data[1];

  return rows.map(row => {

    let obj = {};

    headers.forEach((header, index) => {
      obj[header] = row[index];
    });

    return obj;

  });

}

}
