import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-multitask-treemenu',
  templateUrl: './multitask-treemenu.component.html',
  styleUrls: ['./multitask-treemenu.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class MultitaskTreemenuComponent implements OnInit {

  @Input() model: any;
  @Input() isChild: boolean;
  @Input() isMainFolder: boolean;
  @Input() isFile: any;
  @Input() itemData: any;
  l_url: any;

  productsofTree: any = {

    folderName: "Tree Menu",
    folders: [{

      folderName: "A",
      folders: [{

        folderName: "Option 1",
        folders: []
      }, {

        folderName: "Option 2",
        folders: [{

          folderName: "Projector 4",
          folders: []
        }]
      }],

    }, {

      folderName: "B",
      folders: [{

        folderName: "Option 1",
        folders: []
      }, {

        folderName: "Option 2",
        folders: [{

          folderName: "Option 3",
          folders: []
        }]
      }],

    },
    {

      folderName: "C",
      folders: [{
        files: [{
          fileName: "Option 1"
        }],
        folderName: "Option 2",
        folders: []
      }, {

        folderName: "Option 3",
        folders: [{

          folderName: "Option 4",
          folders: []
        }]
      }],

    }]
  }

  constructor(public events: Events,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"multitask-treemenu")
    }
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.isMainFolder) {
        this.getData();
        this.isMainFolder = false;
      } else {
        this.model.forEach((element: any) => {
          element.isSelect ? element.toggle = 'on' : element.toggle = 'init';
        });
      }
    }, 100)

  }

  toggleItem(item) {
    item.toggle === 'on' ? item.toggle = 'off' : item.toggle = 'on';
  }

  getData() {
    this.model = [];
    this.model.push(this.productsofTree);
    this.model.forEach((element: any) => {
      element.isSelect ? element.toggle = 'on' : element.toggle = 'init';

    });
  }


 


}
