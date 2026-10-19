import { Component, Input, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
  selector: 'app-my-tab',
  templateUrl: './my-tab.component.html',
  styleUrls: ['./my-tab.component.scss'],
  standalone: true,
  imports: [STANDALONE_IMPORTS]
})
export class MyTabComponent  implements OnInit {

@Input('tabTitle') title: string;
  @Input() active = false;
  @Input() isCloseable = false;
  @Input() template;
  @Input() dataContext;
  @Input() superId;
  @Input() object_data;
  @Input() object_mast;
  @Input() click_events_str;
  @Input() dynamicTabs;
  @Input() tabs;
  @Input() isTab;
  @Input() tabIndex;
  @Input() breadcrumb
  @Input() id
  @Input() menuTabOpen

  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"my-tab-page")
    }
   }
  ngOnInit() {}
}
