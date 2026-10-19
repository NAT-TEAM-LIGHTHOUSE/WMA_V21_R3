import { Component, Input, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[...STANDALONE_IMPORTS],
  selector: 'app-report-engine-template-save',
  templateUrl: './report-engine-template-save.component.html',
  styleUrls: ['./report-engine-template-save.component.scss'],
})
export class ReportEngineTemplateSaveComponent implements OnInit {
  @Input() frame : any;
  isSearch: boolean = false
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.layoutFlag){
      return applyLoggingDecorator(this,"report-engine-template-save")
    }
   }

  ngOnInit() {}

  searchData() {
    this.isSearch = true
  }


  
}
