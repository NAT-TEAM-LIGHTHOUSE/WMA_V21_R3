import { Component, Input, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-treemenu',
  templateUrl: './treemenu.component.html',
  styleUrls: ['./treemenu.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class TreemenuComponent implements OnInit {

 
  @Input() model: any;
  @Input() isChild: boolean;
  @Input() isMainFolder: boolean;
  @Input() isFile: any;
  @Input() itemData: any;
  l_url: any;
  productsofTree: any = {

    folderName: "Partial Selection",
    folders: [{

      folderName: "Unchecked with a very long name that might be wrapped",
      folders: [{

        folderName: "Projector 2",
        folders: []
      }, {

        folderName: "Projector 3",
        folders: [{

          folderName: "Projector 4",
          folders: []
        }]
      }],

    }, {

      folderName: "Partial Selects",
      folders: [{

        folderName: "Checked",
        folders: []
      }, {

        folderName: "Checked",
        folders: [{

          folderName: "Checked",
          folders: []
        }]
      }],

    },
    {

      folderName: "Projector1",
      folders: [{
        files: [{
          fileName: "mywork"
        }],
        folderName: "Projector 2",
        folders: []
      }, {

        folderName: "Projector 3",
        folders: [{

          folderName: "Projector 4",
          folders: []
        }]
      }],

    }]
  }

  constructor(public events: Events,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"treemenu")
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
